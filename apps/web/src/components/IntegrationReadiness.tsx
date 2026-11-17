import { useState } from 'react';
import catalog from '../config/integrationCatalog.json';

export default function IntegrationReadiness() {
  const [query, setQuery] = useState('');
  const entries = catalog.entries.filter(entry =>
    [entry.host, ...entry.sourceModules].join(' ').toLowerCase().includes(query.toLowerCase()),
  );
  return <section className="space-y-5">
    <h2 className="text-2xl font-semibold">Integration readiness</h2>
    <p>The archived source claims {catalog.sourceClaim}. Its selected final branch contains {catalog.sourceHandlerCount} function handlers and {catalog.outboundHostReferenceCount} outbound host references.</p>
    <p className="text-text-secondary">{catalog.limitations}</p>
    <p>Live verification requires the intended Supabase project, provider credentials and confirmed request contracts. Credential names below are source references.</p>
    <label className="block">Filter host or source module
      <input value={query} onChange={event => setQuery(event.target.value)} className="block w-full rounded border p-3 bg-bg-near-black" />
    </label>
    <p role="status">{entries.length} host references shown</p>
    <div className="space-y-3">{entries.map(entry => <article key={entry.host} className="rounded border border-border-subtle p-4 space-y-2">
      <h3 className="font-semibold break-all">{entry.host}</h3>
      <p>{entry.verification === 'VERIFIED' ? 'Verified for the stated scope' : 'Verification pending'}</p>
      {entry.scope && <p>{entry.scope}</p>}
      <p className="text-sm break-words">Source modules {entry.sourceModules.join(', ')}</p>
      {!!entry.secretReferencesInModules.length && <details>
        <summary>Credential references in these modules</summary>
        <ul className="text-sm list-disc pl-6">{entry.secretReferencesInModules.map(name => <li key={name} className="break-all">{name}</li>)}</ul>
      </details>}
    </article>)}</div>
  </section>;
}
