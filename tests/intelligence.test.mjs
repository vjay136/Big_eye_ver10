import test from 'node:test';
import assert from 'node:assert/strict';
import { emailProfile, domainDns } from '../apps/web/src/analysis/intelligence.mjs';

test('email normalization preserves local-part casing', () => {
  assert.equal(emailProfile(' User@GMAIL.com ').email, 'User@gmail.com');
});
test('privacy alias and free provider remain separate classes', () => {
  assert.equal(emailProfile('user@privaterelay.appleid.com').classification, 'PRIVACY_ALIAS');
  assert.equal(emailProfile('user@outlook.com').classification, 'FREE_PROVIDER');
  assert.equal(emailProfile('user@example.com').classification, 'UNKNOWN');
});
test('all age categories remain unknown without external records', () => {
  const profile = emailProfile('user@gmail.com');
  assert.equal(profile.accountCreation.value, null);
  assert.equal(profile.firstObserved.value, null);
  assert.equal(profile.domainRegistration.value, null);
});
test('invalid supported syntax and internal names are rejected', () => {
  for (const value of ['a..b@example.com', 'user@localhost', 'user@-bad.example', '@example.com', 'a@b@example.com']) {
    assert.throws(() => emailProfile(value));
  }
});
test('DNS lookups use a fixed resolver and filter records by type', async () => {
  const response = await domainDns('example.com', async (url) => {
    const query = new URL(url);
    assert.equal(query.origin, 'https://dns.google');
    const isMx = query.searchParams.get('type') === '15';
    const record = query.searchParams.get('name').startsWith('_dmarc') ? '"v=DMARC1; p=reject"' : '"v=spf1 " "-all"';
    return new Response(JSON.stringify({
      Status: 0, AD: true,
      Answer: [{ type: isMx ? 15 : 16, data: isMx ? '0 .' : record }],
    }));
  });
  assert.deepEqual(response.map(item => item.state), ['OBSERVED', 'OBSERVED', 'OBSERVED']);
  assert.equal(response[1].records[0], 'v=spf1 -all');
});
test('partial failure preserves independent DNS results', async () => {
  const response = await domainDns('example.com', async (url) => {
    if (new URL(url).searchParams.get('type') === '15') throw new Error('Offline');
    return new Response(JSON.stringify({ Status: 3 }));
  });
  assert.deepEqual(response.map(item => item.state), ['UNAVAILABLE', 'NO_RECORDS', 'NO_RECORDS']);
});
test('malformed DNS response is unknown', async () => {
  const response = await domainDns('example.com', async () => new Response(JSON.stringify({ Status: 0, Answer: [{}] })));
  assert.ok(response.every(item => item.state === 'UNAVAILABLE'));
});
