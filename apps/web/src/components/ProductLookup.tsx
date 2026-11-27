import { useState } from 'react';

type Product = { identifier: string; title?: string; deprecated: boolean };

export default function ProductLookup() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<{ products: Product[]; total: number }>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return <section className="space-y-5">
    <h2 className="text-xl font-semibold">Software identifiers</h2>
    <p className="text-text-secondary">Look up product names in the NIST Common Platform Enumeration dictionary.</p>
    <form className="space-y-3" onSubmit={async event => {
      event.preventDefault();
      setBusy(true);
      setError('');
      setResult(undefined);
      try {
        const query = new URLSearchParams({ keyword: keyword.trim() });
        const response = await fetch('/api/software-identifiers?' + query, { signal: AbortSignal.timeout(12000) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Software lookup failed.');
        if (!Array.isArray(data.products) || !Number.isSafeInteger(data.total)) throw new Error('Unexpected software lookup response.');
        setResult(data);
      } catch (failure) {
        setError(failure instanceof Error && failure.name === 'Error' ? failure.message : 'Software lookup is temporarily unavailable.');
      } finally {
        setBusy(false);
      }
    }}>
      <label className="block">Software name<input className="block w-full rounded border bg-bg-near-black p-2" value={keyword}
        onChange={event => { setKeyword(event.target.value); setResult(undefined); }} minLength={2} maxLength={80} placeholder="Mozilla Firefox" required disabled={busy} /></label>
      <button className="rounded bg-accent-primary px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={busy}>{busy ? 'Looking up…' : 'Find identifiers'}</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {result && <div role="status" className="space-y-2">
      <p>{result.total ? 'Showing ' + result.products.length + ' of ' + result.total + ' matches' : 'No matching products.'}</p>
      <ul className="space-y-2">{result.products.map(product => <li key={product.identifier} className="rounded border border-border-subtle p-3">
        <p className="font-semibold">{product.title || product.identifier}{product.deprecated ? ' · Deprecated' : ''}</p>
        <p className="break-all font-mono text-sm">{product.identifier}</p>
      </li>)}</ul>
    </div>}
    <p className="text-sm text-text-secondary">This product uses data from the NVD API and is not endorsed or certified by the NVD.</p>
  </section>;
}
