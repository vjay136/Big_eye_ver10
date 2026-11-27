import { useState } from 'react';
import catalog from '../config/providerCatalog.json';
import archived from '../config/integrationCatalog.json';
import { backendConfigured, supabase } from '../lib/supabase';

type ProviderReadiness = {
  id: string;
  configured: boolean;
  wired: boolean;
};

const categories = [...new Set(catalog.entries.map(entry => entry.category))].sort();

export default function IntegrationReadiness() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [providers, setProviders] = useState<ProviderReadiness[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const entries = catalog.entries.filter(entry =>
    (!category || entry.category === category) && [entry.name, entry.provider, entry.category, entry.id].join(' ').toLowerCase().includes(query.toLowerCase()),
  );

  async function loadReadiness() {
    setBusy(true);
    setError('');
    setLoaded(false);
    try {
      const response = await supabase.functions.invoke('get-provider-catalog', { body: {} });
      const list: unknown = response.data?.data?.providers;
      if (response.error?.context?.status === 404) {
        setError('The provider catalog function is not installed on this Supabase project.');
        return;
      }
      if (response.error || !Array.isArray(list) || !list.every(item =>
        item && typeof item.id === 'string' && typeof item.configured === 'boolean' && typeof item.wired === 'boolean',
      )) throw new Error('Invalid catalog response.');
      setProviders(list);
      setLoaded(true);
    } catch {
      setError('Backend readiness could not be loaded. Check the project configuration and function access.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="space-y-5">
    <h2 className="text-2xl font-semibold">Integration readiness</h2>
    <p>{catalog.registeredApiCount} APIs registered in Big Eye · Registry checked {catalog.collectedAt}</p>
    <p className="text-text-secondary">{catalog.verificationNote}</p>
    <button disabled={!backendConfigured || busy} onClick={loadReadiness} className="rounded border px-4 py-2 disabled:opacity-50">
      {busy ? 'Checking backend…' : 'Load backend readiness'}
    </button>
    {error && <p role="alert">{error}</p>}
    {loaded && <section aria-live="polite" className="rounded border border-border-subtle p-4 space-y-3">
      <h3 className="font-semibold">Backend adapter configuration</h3>
      <p>{providers.length} adapter configurations reported by the deployed function. Configuration status needs a provider request and response check to establish live verification.</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead><tr><th className="p-2">Adapter</th><th className="p-2">Configured</th><th className="p-2">Wiring reported</th></tr></thead>
        <tbody>{providers.map(item => <tr key={item.id}>
          <td className="p-2 break-all">{item.id}</td>
          <td className="p-2">{item.configured ? 'Yes' : 'Pending'}</td>
          <td className="p-2">{item.wired ? 'Yes' : 'Pending'}</td>
        </tr>)}</tbody>
      </table></div>
    </section>}
    <label className="block">Filter API, provider or category
      <input value={query} onChange={event => setQuery(event.target.value)} className="block w-full rounded border p-3 bg-bg-near-black" />
    </label>
    <label className="block">Use case
      <select value={category} onChange={event => setCategory(event.target.value)} className="block w-full rounded border border-border-subtle bg-bg-near-black p-2">
        <option value="">All categories</option>
        {categories.map(name => <option key={name}>{name}</option>)}
      </select>
    </label>
    <p role="status">{entries.length} registered APIs shown</p>
    {!entries.length && <p>Try a different search or category.</p>}
    <div className="space-y-3">{entries.map(entry => <article key={entry.id} className="rounded border border-border-subtle p-4 space-y-2">
      <h3 className="font-semibold">{entry.name}</h3>
      <p className="text-sm text-text-secondary">{entry.provider} · {entry.category}</p>
      <p>{entry.id === 'CPE-CP-001'
        ? <a className="text-accent-primary underline" href="#product-lookup">Open the keyless NIST lookup</a>
        : 'Provider result verification pending'}</p>
      <dl className="text-sm">
        <dt>Authentication</dt><dd className="mb-2">{entry.authentication || 'Needs review'}</dd>
        <dt>Registry ID</dt><dd>{entry.id}</dd>
      </dl>
      {/^https:\/\//i.test(entry.docs_url || '') && <a className="text-accent-primary underline" href={entry.docs_url} target="_blank" rel="noopener noreferrer">Provider documentation</a>}
    </article>)}</div>
    <details className="text-sm text-text-secondary">
      <summary>Historical source inventory</summary>
      <p>{archived.sourceHandlerCount} archived function handlers and {archived.outboundHostReferenceCount} host references were found in the earlier source review. The current registry supplies the 83-API integration checklist.</p>
    </details>
  </section>;
}
