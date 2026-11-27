import { useState } from 'react';
import { domainDns, type DnsEvidence } from '../analysis/intelligence.mjs';

export default function MailDns() {
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState('');
  const [resolver, setResolver] = useState<'google' | 'cloudflare'>('google');
  const [evidence, setEvidence] = useState<DnsEvidence[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <section className="space-y-5">
    <h2 className="text-xl font-semibold">Mail DNS</h2>
    <p className="text-text-secondary">Inspect MX, SPF, DMARC and optional DKIM records. Only the DNS names are sent to the selected resolver.</p>
    <form className="space-y-4" onSubmit={async event => {
      event.preventDefault();
      setBusy(true);
      setError('');
      setEvidence([]);
      try {
        setEvidence(await domainDns(domain.trim().toLowerCase(), fetch, { resolver, selector: selector.trim() }));
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : 'DNS lookup failed.');
      } finally {
        setBusy(false);
      }
    }}>
      <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
        <label>Domain<input required value={domain} maxLength={253} onChange={event => setDomain(event.target.value)} placeholder="example.com" className="block w-full rounded border bg-bg-near-black p-2" /></label>
        <label>DKIM selector (optional)<input value={selector} maxLength={63} onChange={event => setSelector(event.target.value)} placeholder="selector1" className="block w-full rounded border bg-bg-near-black p-2" /></label>
        <label>DNS resolver<select value={resolver} onChange={event => setResolver(event.target.value === 'cloudflare' ? 'cloudflare' : 'google')} className="block w-full rounded border border-border-subtle bg-bg-near-black p-2">
          <option value="google">Google Public DNS</option><option value="cloudflare">Cloudflare 1.1.1.1</option>
        </select></label>
      </fieldset>
      <button disabled={busy} className="rounded bg-accent-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? 'Checking records…' : 'Check records'}</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {evidence.length > 0 && <div aria-live="polite" className="space-y-3">
      {evidence.map(item => <section key={item.kind} className="rounded border border-border-subtle p-3">
        <h3 className="font-semibold">{item.kind} · {item.state === 'OBSERVED' ? 'Published records' : item.state === 'NO_RECORDS' ? 'No matching record' : 'Resolver unavailable'}</h3>
        <p className="text-sm text-text-secondary">{item.source} · {new Date(item.collectedAt).toLocaleString()}</p>
        <ul className="mt-2 space-y-1">{item.records.map((record, index) => <li className="break-all font-mono text-sm" key={index}>{record}</li>)}</ul>
      </section>)}
      <p className="text-sm text-text-secondary">Published records do not establish whether a particular message passed authentication.</p>
    </div>}
  </section>;
}
