import { useRef, useState } from 'react';
import { domainDns, emailProfile, type EmailProfile, type DnsEvidence } from '../analysis/intelligence.mjs';

export default function EmailIntelligence() {
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<EmailProfile>();
  const [dns, setDns] = useState<DnsEvidence[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);

  return <section className="space-y-5">
    <h2 className="text-2xl font-semibold">Email intelligence</h2>
    <form className="space-y-3" onSubmit={event => {
      event.preventDefault();
      generation.current++;
      setBusy(false);
      setError('');
      setProfile(undefined);
      setDns([]);
      try {
        setProfile(emailProfile(email));
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : 'Invalid address.');
      }
    }}>
      <label className="block">Email address
        <input value={email} maxLength={254} onChange={event => {
          generation.current++;
          setBusy(false);
          setEmail(event.target.value);
          setProfile(undefined);
          setDns([]);
        }} className="block w-full rounded border p-3 bg-bg-near-black" />
      </label>
      <button className="rounded bg-accent-primary px-4 py-2 text-white">Inspect address locally</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {profile && <div className="space-y-3">
      <h3 className="font-semibold break-all">{profile.email}</h3>
      <p>{profile.classification} · {profile.confidence} confidence</p>
      <p className="text-sm text-text-secondary">{profile.source} · {profile.collectedAt}</p>
      <dl className="space-y-2">
        <div><dt>Actual account creation</dt><dd>UNKNOWN. {profile.accountCreation.evidence}</dd></div>
        <div><dt>First observed</dt><dd>UNKNOWN. {profile.firstObserved.evidence}</dd></div>
        <div><dt>Domain registration</dt><dd>UNKNOWN. {profile.domainRegistration.evidence}</dd></div>
      </dl>
      <p>Optional DNS lookup sends the domain to Google Public DNS.</p>
      <button disabled={busy} className="rounded border px-4 py-2 disabled:opacity-50" onClick={async () => {
        const current = ++generation.current;
        setBusy(true);
        setDns([]);
        try {
          const evidence = await domainDns(profile.domain);
          if (current === generation.current) setDns(evidence);
        } catch {
          if (current === generation.current) setError('DNS lookup failed.');
        } finally {
          if (current === generation.current) setBusy(false);
        }
      }}>{busy ? 'Looking up DNS…' : 'Check MX, SPF and DMARC'}</button>
      <p className="text-sm text-text-secondary">DNS results show published records. Message authentication requires evaluation by a receiving mail server.</p>
      <div aria-live="polite" className="space-y-4">{dns.map(item => <section key={item.kind} className="rounded border border-border-subtle p-4">
        <h3 className="font-semibold">{item.kind} · {item.state}</h3>
        <p className="text-xs text-text-secondary">{item.source} · {item.collectedAt} · Resolver DNSSEC validation {item.dnssecValidated ? 'reported' : 'unconfirmed'}</p>
        {item.records.map((record, index) => <pre className="whitespace-pre-wrap break-all mt-2" key={index}>{record}</pre>)}
      </section>)}</div>
    </div>}
  </section>;
}
