import { useState } from 'react';
import { analyze, attachmentSignals } from '../analysis/triage.mjs';

export default function LocalTriage() {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyze>>();
  const [file, setFile] = useState<{ name: string; hash: string }>();
  const [tab, setTab] = useState<'message' | 'attachment'>('message');
  const [hashing, setHashing] = useState(false);

  return <section className="space-y-5">
    <h2 className="text-2xl font-semibold">Local phishing triage</h2>
    <p className="text-text-secondary">Checks run in this browser. The score reflects heuristic signals. Use a trusted scanner for a malware verdict.</p>
    <nav className="flex flex-wrap gap-3" aria-label="Triage tools">
      <button type="button" aria-pressed={tab === 'message'} onClick={() => { setError(''); setTab('message'); }} className="rounded border px-3 py-2">Message and URL</button>
      <button type="button" aria-pressed={tab === 'attachment'} onClick={() => { setError(''); setTab('attachment'); }} className="rounded border px-3 py-2">Attachment</button>
    </nav>
    {tab === 'message' ? <form className="space-y-3" onSubmit={(event) => {
      event.preventDefault();
      setError('');
      setResult(undefined);
      try {
        setResult(analyze({ message, url }));
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : 'Analysis failed.');
      }
    }}>
      <label className="block">Import .eml or plain-text message up to 1 MiB
        <input type="file" accept=".eml,.txt" className="block" onChange={async event => {
          const input = event.currentTarget;
          const uploaded = input.files?.[0];
          input.value = '';
          if (!uploaded) return;
          setError('');
          setResult(undefined);
          if (uploaded.size > 1024 * 1024) {
            setError('Choose a message of 1 MiB or smaller.');
            return;
          }
          try {
            setMessage(await uploaded.text());
          } catch {
            setError('Could not read the message file.');
          }
        }} />
      </label>
      <label className="block">Email headers or plain-text message
        <textarea value={message} maxLength={1024 * 1024} onChange={(event) => { setMessage(event.target.value); setResult(undefined); }} rows={8} className="block w-full rounded border p-3 bg-bg-near-black" />
      </label>
      <label className="block">URL
        <input value={url} maxLength={8192} onChange={(event) => { setUrl(event.target.value); setResult(undefined); }} className="block w-full rounded border p-3 bg-bg-near-black" />
      </label>
      <button disabled={!message.trim() && !url.trim()} className="rounded bg-accent-primary px-4 py-2 text-white disabled:opacity-50">Analyze</button>
    </form> : <div className="space-y-3">
      <label className="block">Attachment up to 25 MiB
        <input type="file" disabled={hashing} className="block" onChange={async (event) => {
          const input = event.currentTarget;
          const uploaded = input.files?.[0];
          input.value = '';
          if (!uploaded) return;
          setError('');
          setFile(undefined);
          if (uploaded.size > 25 * 1024 * 1024) {
            setError('Choose an attachment of 25 MiB or smaller.');
            return;
          }
          setHashing(true);
          try {
            const digest = await crypto.subtle.digest('SHA-256', await uploaded.arrayBuffer());
            const hash = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
            setFile({ name: uploaded.name, hash });
          } catch {
            setError('Could not calculate the file fingerprint.');
          } finally {
            setHashing(false);
          }
        }} />
      </label>
      {hashing && <p role="status">Calculating SHA-256…</p>}
      {file && <div role="status">
        <p>{file.name}</p>
        <p className="break-all">SHA-256 {file.hash}</p>
        {attachmentSignals(file.name).map(signal => <p key={signal}>{signal}</p>)}
      </div>}
    </div>}
    {error && <p role="alert">{error}</p>}
    {tab === 'message' && result && <div role="status" className="space-y-2">
      <button className="rounded border px-3 py-2" onClick={() => {
        const report = { schemaVersion: 1, collectedAt: new Date().toISOString(), method: 'local-heuristics', ...result };
        const downloadUrl = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'big-eye-triage.json';
        link.click();
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }}>Download JSON report</button>
      <p className="font-semibold">Heuristic score {result.score}/100 · {result.urlsInspected} URLs inspected</p>
      {result.urlLimitReached && <p>The 100-URL inspection limit was reached. Additional URLs may remain.</p>}
      {result.findings.length ? <ul className="list-disc pl-6">{result.findings.map(finding => <li key={finding.id}>{finding.explanation}</li>)}</ul> : <p>No configured signals matched.</p>}
    </div>}
  </section>;
}
