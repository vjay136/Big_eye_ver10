import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../apps/web/api/software-identifiers.js';

function recordedResponse() {
  return { headers: {}, setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; } };
}

test('CPE lookup validates user input and returns bounded product metadata', async t => {
  const provider = t.mock.method(globalThis, 'fetch', async (url, options) => {
    const query = new URL(url);
    assert.equal(query.origin, 'https://services.nvd.nist.gov');
    assert.equal(query.searchParams.get('keywordSearch'), 'Mozilla Firefox');
    assert.equal(query.searchParams.get('resultsPerPage'), '10');
    assert.equal(options.redirect, 'error');
    return Response.json({
      totalResults: 1,
      products: [{ cpe: { cpeName: 'cpe:2.3:a:mozilla:firefox:1.0:*:*:*:*:*:*:*',
        titles: [{ lang: 'en', title: 'Mozilla Firefox' }], deprecated: false, ignored: 'upstream data' } }],
    });
  });
  const invalid = await handler({ method: 'GET', query: { keyword: ['one', 'two'] } }, recordedResponse());
  assert.equal(invalid.code, 400);
  assert.equal(provider.mock.callCount(), 0);
  const response = await handler({ method: 'GET', query: { keyword: 'Mozilla Firefox' } }, recordedResponse());
  assert.equal(response.code, 200);
  assert.equal(response.body.total, 1);
  assert.deepEqual(Object.keys(response.body.products[0]), ['identifier', 'deprecated', 'title']);
});

test('upstream throttling is reported and cannot be mistaken for zero matches', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 429 }));
  const response = await handler({ method: 'GET', query: { keyword: 'Firefox' } }, recordedResponse());
  assert.equal(response.code, 429);
  assert.match(response.body.error, /rate limit/);
});
