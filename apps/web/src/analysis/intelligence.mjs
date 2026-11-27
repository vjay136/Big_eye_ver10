const domainPattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export function emailProfile(value) {
  if (typeof value !== 'string' || value.length > 254) throw new Error('Enter a supported email address up to 254 characters.');
  const match = /^([^\s@]+)@([^\s@]+)$/.exec(value.trim());
  if (!match || match[1].length > 64 || !domainPattern.test(match[2]) ||
      !/^[a-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[a-z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/i.test(match[1])) {
    throw new Error('Enter an email address with an ASCII dot-atom local part and a public DNS domain.');
  }
  const domain = match[2].toLowerCase();
  const free = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'proton.me', 'protonmail.com'];
  const aliases = ['privaterelay.appleid.com', 'simplelogin.com', 'simplelogin.fr', 'slmail.me'];
  const classification = aliases.includes(domain) ? 'PRIVACY_ALIAS' : free.includes(domain) ? 'FREE_PROVIDER' : 'UNKNOWN';
  return {
    email: match[1] + '@' + domain,
    domain,
    classification,
    source: 'Big Eye curated provider hints v1',
    confidence: classification === 'UNKNOWN' ? 'LOW' : 'MEDIUM',
    collectedAt: new Date().toISOString(),
    accountCreation: { classification: 'UNKNOWN', value: null, evidence: 'An authorized provider account record is required.' },
    firstObserved: { classification: 'UNKNOWN', value: null, evidence: 'No first-observed provider has been queried.' },
    domainRegistration: { classification: 'UNKNOWN', value: null, evidence: 'No registration service has been queried.' },
  };
}

const resolvers = {
  google: { name: 'Google Public DNS', url: 'https://dns.google/resolve' },
  cloudflare: { name: 'Cloudflare 1.1.1.1', url: 'https://cloudflare-dns.com/dns-query' },
};

export async function domainDns(domain, request = fetch, { resolver = 'google', selector = '' } = {}) {
  const upstream = resolvers[resolver];
  if (!Object.hasOwn(resolvers, resolver)) throw new Error('Choose a supported DNS resolver.');
  if (selector && !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(selector)) {
    throw new Error('Enter a valid single-label DKIM selector.');
  }

  if (typeof domain !== 'string' || !domainPattern.test(domain)) throw new Error('Enter a public DNS domain.');
  const definitions = [
    { kind: 'MX', name: domain, type: 15, prefix: '' },
    { kind: 'SPF', name: domain, type: 16, prefix: 'v=spf1' },
    { kind: 'DMARC', name: '_dmarc.' + domain, type: 16, prefix: 'v=DMARC1' },
  ];
  if (selector) {
    const name = selector.toLowerCase() + '._domainkey.' + domain;
    if (name.length > 253) throw new Error('The combined selector and domain are too long.');
    definitions.push({ kind: 'DKIM', name, type: 16, prefix: '' });
  }
  return Promise.all(definitions.map(async (definition) => {
    const evidence = {
      kind: definition.kind,
      source: upstream.name,
      collectedAt: new Date().toISOString(),
    };
    try {
      const query = new URLSearchParams({ name: definition.name, type: String(definition.type) });
      if (resolver === 'google') query.set('edns_client_subnet', '0.0.0.0/0');
      const response = await request(upstream.url + '?' + query, {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(8000), redirect: 'error',
      });
      if (!response.ok) throw new Error('Resolver unavailable.');
      const raw = await response.text();
      if (raw.length > 65536) throw new Error('Resolver response exceeded the limit.');
      const body = JSON.parse(raw);
      if (![0, 3].includes(body.Status) || body.TC === true ||
          (body.Answer !== undefined && !Array.isArray(body.Answer))) {
        throw new Error('Resolver returned an unsupported response.');
      }
      const answers = body.Answer ?? [];
      if (answers.some(answer => !answer || typeof answer.data !== 'string' || typeof answer.type !== 'number')) {
        throw new Error('Resolver returned invalid records.');
      }
      const records = answers
        .filter(answer => answer.type === definition.type)
        .map(answer => answer.type === 16 ? answer.data.replace(/"\s+"/g, '').replace(/^"|"$/g, '') : answer.data)
        .filter(record => !definition.prefix || record.toLowerCase().startsWith(definition.prefix.toLowerCase()));
      return { ...evidence, state: records.length ? 'OBSERVED' : 'NO_RECORDS', records, dnssecValidated: body.AD === true };
    } catch {
      return { ...evidence, state: 'UNAVAILABLE', records: [], dnssecValidated: false };
    }
  }));
}
