export interface EmailProfile {
  email: string;
  domain: string;
  classification: string;
  confidence: string;
  source: string;
  collectedAt: string;
  accountCreation: { classification: string; value: null; evidence: string };
  firstObserved: { classification: string; value: null; evidence: string };
  domainRegistration: { classification: string; value: null; evidence: string };
}
export interface DnsEvidence {
  kind: string;
  source: string;
  collectedAt: string;
  state: string;
  records: string[];
  dnssecValidated: boolean;
}
export function emailProfile(value: string): EmailProfile;
export function domainDns(domain: string, request?: typeof fetch, options?: { resolver?: 'google' | 'cloudflare'; selector?: string }): Promise<DnsEvidence[]>;
