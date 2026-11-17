import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, attachmentSignals } from '../apps/web/src/analysis/triage.mjs';

test('no signals yields zero', () => {
  assert.deepEqual(analyze({ message: 'Hello, see you tomorrow.' }).findings, []);
});
test('pressure and credential cues are explained', () => {
  const result = analyze({ message: 'Urgent, verify your password immediately.' });
  assert.equal(result.score, 25);
  assert.equal(result.findings[0].id, 'pressure');
});
test('sender and reply domains are compared after unfolding', () => {
  const result = analyze({ message: 'From: Person <person@example.com>\r\nReply-To:\r\n person@other.example\r\n\r\nHello' });
  assert.ok(result.findings.some(f => f.id === 'reply-domain'));
});
test('authentication in a message body is excluded from header parsing', () => {
  assert.equal(analyze({ message: 'From: sender@example.com\n\nAuthentication-Results: dmarc=fail' }).score, 0);
});
test('reported header failure has qualified evidence', () => {
  assert.equal(analyze({ message: 'Authentication-Results: mx.example; dmarc=fail\n\nHello' }).findings[0].id, 'reported-auth-failure');
});
test('URL credentials, IP hosts and HTTP are independent signals', () => {
  assert.equal(analyze({ url: 'http://trusted.example@192.0.2.1/login' }).score, 60);
});
test('encoded international domain is identified', () => {
  assert.equal(analyze({ url: 'https://xn--pple-43d.example' }).score, 15);
});
test('repeated URL signals do not multiply score', () => {
  assert.equal(analyze({ message: 'http://a.example http://b.example' }).score, 10);
});
test('bad input is rejected', () => {
  assert.throws(() => analyze({ url: 'javascript:alert(1)' }), /HTTP/);
  assert.throws(() => analyze({ message: 'x'.repeat(1024 * 1024 + 1) }), /1 MiB/);
  assert.throws(() => analyze({ message: null }), /1 MiB/);
});
test('filename flags cover scripts, macros and bidi controls', () => {
  assert.equal(attachmentSignals('invoice.pdf.exe').length, 2);
  assert.equal(attachmentSignals('budget.xlsm').length, 1);
  assert.equal(attachmentSignals('invoice\u202epdf.exe').length, 2);
  assert.equal(attachmentSignals('normal.pdf').length, 0);
});
test('the URL inspection limit is disclosed', () => {
  const message = Array.from({ length: 150 }, (_, index) => 'https://host' + index + '.example').join(' ');
  const result = analyze({ message });
  assert.equal(result.urlsInspected, 100);
  assert.equal(result.urlLimitReached, true);
});
