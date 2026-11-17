import { useState, useEffect, useMemo } from 'react';

import { Shield, User, LogOut } from 'lucide-react';

import { useAuth } from './lib/auth';

import { useIsAdmin } from './lib/useIsAdmin';

import AuthModal from './components/AuthModal';

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

import { AdminDashboard } from './components/AdminDashboard';

import DatabaseAnalysis from './components/DatabaseAnalysis';

import IntegrationReadiness from './components/IntegrationReadiness';
import EmailIntelligence from './components/EmailIntelligence';

import LocalTriage from './components/LocalTriage';

import { backendConfigured } from './lib/supabase';

import { version, release } from './release';

import './App.css';



type Tool =

  | 'integration-readiness'
  | 'email-intelligence'

  | 'local-triage'

  | 'all-in-one'

  | 'email-header'

  | 'domain-checker'

  | 'email-legitimacy'

  | 'blacklist'

  | 'ip-intelligence'

  | 'phishing-ai'

  | 'temp-email'

  | 'domain-age'

  | 'link-checker'

  | 'database-analysis'

  | 'admin-dashboard';



const baseTools = [
  { id: 'integration-readiness' as Tool, name: 'Integration Readiness' },

  { id: 'email-intelligence' as Tool, name: 'Email Intelligence' },

  { id: 'local-triage' as Tool, name: 'Local Triage' },

  { id: 'all-in-one' as Tool, name: 'All in One Analysis' },

  { id: 'email-header' as Tool, name: 'Email Header Analyzer' },

  { id: 'domain-checker' as Tool, name: 'Domain Checker' },

  { id: 'email-legitimacy' as Tool, name: 'Email Legitimacy' },

  { id: 'blacklist' as Tool, name: 'Blacklist Scanner' },

  { id: 'ip-intelligence' as Tool, name: 'IP Intelligence' },

  { id: 'phishing-ai' as Tool, name: 'AI Phishing Detection' },

  { id: 'temp-email' as Tool, name: 'Temp Email Detector' },

  { id: 'domain-age' as Tool, name: 'Domain Age Tracker' },

  { id: 'link-checker' as Tool, name: 'Link Checker' },

  { id: 'database-analysis' as Tool, name: 'Database Analysis' },

];



function App() {

  const [activeTool, setActiveTool] = useState<Tool>('local-triage');

  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, loading, signOut } = useAuth();

  const { isAdmin } = useIsAdmin();



  // Memoize tools array to include admin dashboard if user is admin

  const tools = useMemo(() => {

    if (isAdmin) {

      return [...baseTools, { id: 'admin-dashboard' as Tool, name: 'Admin Dashboard' }];

    }

    return user ? baseTools : baseTools.slice(0, 3);

  }, [isAdmin, user]);



  // Return to local triage after the authenticated session ends.

  useEffect(() => {

    if (!loading && !user) setActiveTool('local-triage');

  }, [loading, user]);



  const handleSignOut = async () => {

    await signOut();

  };



  return (

    <div className="min-h-screen bg-bg-near-black text-text-primary">

      {/* Authentication */}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}



      {/* Header */}

      <header className="h-16 bg-bg-near-black border-b border-border-subtle">

        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Shield className="w-8 h-8 shrink-0 text-accent-primary" />

            <h1 className="text-2xl whitespace-nowrap font-semibold text-text-primary">Big Eye</h1>

            <div className="hidden md:flex flex-col">

              <span className="text-sm text-text-secondary font-semibold">A Revolution in Email Analysis</span>

              <span className="text-xs text-text-tertiary">Email security analysis</span>

            </div>

          </div>

          <div className="flex items-center gap-4">

            {user ? (

              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 text-sm text-text-secondary">

                  <User className="w-4 h-4" />

                  <span>{user.email}</span>

                </div>

                <button

                  onClick={handleSignOut}

                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border-subtle rounded-md hover:bg-bg-hover-surface transition-colors"

                >

                  <LogOut className="w-4 h-4" />

                  Sign Out

                </button>

              </div>

            ) : (

              <button

                disabled={!backendConfigured}

                onClick={() => setShowAuthModal(true)}

                className="px-4 py-2 text-sm font-semibold bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-50"

              >

                Sign In

              </button>

            )}

          </div>

        </div>

      </header>



      {/* Tab Navigation */}

      <div className="bg-bg-near-black border-b border-border-subtle">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex overflow-x-auto scrollbar-hide">

            {tools.map((tool) => (

              <button

                key={tool.id}

                onClick={() => setActiveTool(tool.id)}

                className={`

                  px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200

                  border-b-2 hover:bg-bg-hover-surface

                  ${

                    activeTool === tool.id

                      ? 'border-accent-primary text-text-primary bg-bg-hover-surface'

                      : 'border-transparent text-text-secondary'

                  }

                `}

              >

                {tool.name}

              </button>

            ))}

          </div>

        </div>

      </div>



      {/* Main Content */}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {!backendConfigured && <p role="status" className="mb-5 text-text-secondary">Backend setup is pending. Configure the Supabase URL and publishable key to enable account-based tools.</p>}

        <div className="animate-fade-in">

          {activeTool === 'integration-readiness' && <IntegrationReadiness />}
          {activeTool === 'email-intelligence' && <EmailIntelligence />}

          {activeTool === 'local-triage' && <LocalTriage />}

          {user && <div>

          {activeTool === 'all-in-one' && <AllInOneAnalysis />}

          {activeTool === 'email-header' && <EmailHeaderAnalyzer />}

          {activeTool === 'domain-checker' && <DomainChecker />}

          {activeTool === 'email-legitimacy' && <EmailLegitimacyChecker />}

          {activeTool === 'blacklist' && <BlacklistScanner />}

          {activeTool === 'ip-intelligence' && <IPIntelligence />}

          {activeTool === 'phishing-ai' && <PhishingProbability />}

          {activeTool === 'temp-email' && <TempEmailDetector />}

          {activeTool === 'domain-age' && <DomainAgeTracker />}

          {activeTool === 'link-checker' && <LinkChecker />}

          {activeTool === 'database-analysis' && <DatabaseAnalysis />}

          {activeTool === 'admin-dashboard' && isAdmin && <AdminDashboard />}

          </div>}

        </div>

      </main>



      {/* Footer */}

      <footer className="mt-16 py-8 border-t border-border-subtle">

        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-text-tertiary">

          <p className="font-semibold">Big Eye - A Revolution in Email Analysis</p>

          <p className="mt-1">Email security analysis</p>

          <p className="mt-2 text-xs">Version {version} · Release {release}</p>

        </div>

      </footer>

    </div>

  );

}



export default App;

