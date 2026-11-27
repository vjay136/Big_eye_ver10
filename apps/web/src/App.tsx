import { useEffect, useState, type ReactNode } from 'react';
import { Shield, Mail, Globe, Link2, Paperclip, Boxes, Settings2, LogOut } from 'lucide-react';
import { useAuth } from './lib/auth';
import { useIsAdmin } from './lib/useIsAdmin';
import { backendConfigured } from './lib/supabase';
import { version, release } from './release';
import AuthModal from './components/AuthModal';
import LocalTriage from './components/LocalTriage';
import EmailIntelligence from './components/EmailIntelligence';
import MailDns from './components/MailDns';
import ProductLookup from './components/ProductLookup';
import IntegrationReadiness from './components/IntegrationReadiness';
import AllInOneAnalysis from './components/AllInOneAnalysis';
import EmailHeaderAnalyzer from './components/EmailHeaderAnalyzer';
import DomainChecker from './components/DomainChecker';
import EmailLegitimacyChecker from './components/EmailLegitimacyChecker';
import BlacklistScanner from './components/BlacklistScanner';
import IPIntelligence from './components/IPIntelligence';
import PhishingProbability from './components/PhishingProbability';
import TempEmailDetector from './components/TempEmailDetector';
import DomainAgeTracker from './components/DomainAgeTracker';
import LinkChecker from './components/LinkChecker';
import DatabaseAnalysis from './components/DatabaseAnalysis';
import { AdminDashboard } from './components/AdminDashboard';
import './App.css';

type WorkspaceTool = { id: string; name: string; render: () => ReactNode; requires?: string[]; admin?: boolean };
// A frontend rollout flag. Every enabled function still enforces its own authorization.
const reviewedFunctions = new Set(
  (import.meta.env.VITE_REVIEWED_FUNCTIONS ?? '').split(',').map((name: string) => name.trim()).filter(Boolean),
);

const sections: { name: string; icon: typeof Mail; tools: WorkspaceTool[] }[] = [
  { name: 'Email', icon: Mail, tools: [
    { id: 'local-triage', name: 'Message triage', render: () => <LocalTriage mode="message" /> },
    { id: 'headers', name: 'Message headers', render: () => <LocalTriage mode="headers" /> },
    { id: 'email-intelligence', name: 'Mailbox intelligence', render: () => <EmailIntelligence /> },
    { id: 'all-in-one', name: 'Full investigation', render: () => <AllInOneAnalysis />, requires: ['comprehensive-email-analysis'] },
    { id: 'email-header', name: 'Backend header analysis', render: () => <EmailHeaderAnalyzer />, requires: ['analyze-email-header'] },
    { id: 'email-legitimacy', name: 'Email legitimacy', render: () => <EmailLegitimacyChecker />, requires: ['check-email-legitimacy'] },
    { id: 'temp-email', name: 'Disposable mail', render: () => <TempEmailDetector />, requires: ['detect-temp-email'] },
    { id: 'phishing-ai', name: 'Phishing probability', render: () => <PhishingProbability />, requires: ['analyze-phishing-probability'] },
  ] },
  { name: 'Domains & IP', icon: Globe, tools: [
    { id: 'mail-dns', name: 'Mail DNS', render: () => <MailDns /> },
    { id: 'domain-checker', name: 'Domain reputation', render: () => <DomainChecker />, requires: ['check-domain'] },
    { id: 'domain-age', name: 'Domain age', render: () => <DomainAgeTracker />, requires: ['get-domain-age'] },
    { id: 'ip-intelligence', name: 'IP reputation', render: () => <IPIntelligence />, requires: ['check-ip-reputation'] },
    { id: 'blacklist', name: 'Blocklists', render: () => <BlacklistScanner />, requires: ['scan-blacklist'] },
  ] },
  { name: 'Links', icon: Link2, tools: [
    { id: 'local-links', name: 'URL inspection', render: () => <LocalTriage mode="url" /> },
    { id: 'link-checker', name: 'Link reputation', render: () => <LinkChecker />, requires: ['check-link-reputation', 'analyze-email-links', 'track-user-analytics'] },
  ] },
  { name: 'Attachments', icon: Paperclip, tools: [
    { id: 'attachment', name: 'File fingerprint', render: () => <LocalTriage mode="attachment" /> },
  ] },
  { name: 'Inventory', icon: Boxes, tools: [
    { id: 'product-lookup', name: 'Software identifiers', render: () => <ProductLookup /> },
    { id: 'database-analysis', name: 'Database analysis', render: () => <DatabaseAnalysis />, requires: ['database-email-validation', 'database-threat-intelligence', 'database-comprehensive-analysis'] },
  ] },
  { name: 'Setup', icon: Settings2, tools: [
    { id: 'integration-readiness', name: 'API catalog', render: () => <IntegrationReadiness /> },
    { id: 'admin-dashboard', name: 'Admin dashboard', render: () => <AdminDashboard />, requires: ['get-api-usage'], admin: true },
  ] },
];

function App() {
  const [toolId, setToolId] = useState(() => window.location.hash.slice(1));
  const [showAuth, setShowAuth] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useIsAdmin(reviewedFunctions.has('get-api-usage'));
  const section = sections.find(group => group.tools.some(tool => tool.id === toolId)) ?? sections[0];
  const tool = section.tools.find(candidate => candidate.id === toolId) ?? section.tools[0];

  useEffect(() => {
    const onHash = () => setToolId(window.location.hash.slice(1));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const toolAvailable = !tool.requires || (backendConfigured && tool.requires.every(name => reviewedFunctions.has(name)));
  const blocked = tool.requires && (!toolAvailable || !user || (tool.admin && !isAdmin));
  return (
    <div className="big-eye-shell">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <header className="workspace-header">
        <a className="workspace-brand" href="#local-triage"><Shield size={24} aria-hidden="true" /> Big Eye</a>
        <div className="workspace-account">
          {!backendConfigured && <span>Backend setup pending</span>}
          {signOutError && <span role="alert">Could not sign out. Try again.</span>}
          {user ? <><span className="workspace-email">{user.email}</span><button onClick={async () => {
            setSignOutError(false);
            try { await signOut(); } catch { setSignOutError(true); }
          }}><LogOut size={16} aria-hidden="true" /> Sign out</button></> : <button
            disabled={!backendConfigured || loading} onClick={() => setShowAuth(true)}>
            {loading ? 'Checking session…' : 'Sign in'}
          </button>}
        </div>
      </header>
      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <nav aria-label="Workspaces">{sections.map(group => <a key={group.name} href={'#' + group.tools[0].id}
            aria-current={group === section ? 'true' : undefined}>
            <group.icon size={17} aria-hidden="true" /> {group.name}
          </a>)}</nav>
          <p className="workspace-release">v{version} · Release {release}</p>
        </aside>
        <main className="workspace-main">
          <div className="workspace-heading"><h1>{section.name}</h1></div>
          <nav className="workspace-tools" aria-label={section.name + ' tools'}>{section.tools.map(candidate =>
            <a key={candidate.id} href={'#' + candidate.id} aria-current={tool === candidate ? 'page' : undefined}>{candidate.name}</a>
          )}</nav>
          <div className="workspace-panel" key={tool.id}>
            {blocked ? <section className="space-y-3"><h2 className="text-2xl font-semibold">{tool.name}</h2>
              {!toolAvailable ? <><p>This tool needs a reviewed Supabase function deployment.</p><a className="text-accent-primary underline" href="#integration-readiness">View integration status</a></>
                : !user ? <><p>Sign in to use this backend tool.</p><button onClick={() => setShowAuth(true)}>Sign in</button></>
                : <p>This tool requires an administrator account.</p>}
            </section> : tool.render()}
          </div>
        </main>
      </div>
    </div>
  );
}
export default App;
