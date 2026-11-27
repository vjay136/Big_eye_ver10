import { test } from 'node:test';
import assert from 'node:assert/strict';
import { domainDns } from '../apps/web/src/analysis/intelligence.mjs';

test('Cloudflare lookups query only DNS names including the provided DKIM selector', async () => {
  const requests = [];
  const result = await domainDns('example.com', async (url, options) => {
    const query = new URL(url);
    assert.equal(query.origin, 'https://cloudflare-dns.com');
    assert.equal(options.headers.Accept, 'application/dns-json');
    requests.push(query.searchParams.get('name'));
    return Response.json({ Status: 0, Answer: [] });
  }, { resolver: 'cloudflare', selector: 'Mail1' });
  assert.deepEqual(requests, ['example.com', 'example.com', '_dmarc.example.com', 'mail1._domainkey.example.com']);
  assert.equal(result[3].kind, 'DKIM');
  assert.equal(result[3].source, 'Cloudflare 1.1.1.1');
});

test('rejects invalid selectors before calling a DNS provider', async () => {
  await assert.rejects(domainDns('example.com', () => assert.fail('Unexpected request'), { selector: 'a.b' }), /selector/i);
});
