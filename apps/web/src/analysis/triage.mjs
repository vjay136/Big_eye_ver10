const maximumInput = 1024 * 1024;

export function analyze({ subject = '', message = '', url = '' }) {
  if ([subject, message, url].some((value) => typeof value !== 'string') ||
      subject.length + message.length + url.length > maximumInput) {
    throw new Error('Enter up to 1 MiB of text.');
  }

  const findings = [];
  const add = (id, points, explanation) => {
    if (!findings.some((finding) => finding.id === id)) {
      findings.push({ id, points, explanation });
    }
  };
  const headers = new Map();
  const firstBlock = message.split(/\r?\n\r?\n/, 1)[0];
  let previous;
  for (const line of firstBlock.split(/\r?\n/)) {
    if (/^[ \t]/.test(line) && previous) {
      previous[previous.length - 1] += ' ' + line.trim();
      continue;
    }
    const match = /^([A-Za-z0-9-]+):[ \t]*(.*)$/.exec(line);
    if (!match) break;
    const name = match[1].toLowerCase();
    previous = headers.get(name) ?? [];
    previous.push(match[2]);
    headers.set(name, previous);
  }

  const senderDomain = (name) => {
    const value = headers.get(name)?.[0] ?? '';
    const angle = /<([^<>]+)>\s*$/.exec(value);
    return /@([a-z0-9.-]+)\s*$/i.exec(angle?.[1] ?? value)?.[1].toLowerCase();
  };
  const from = senderDomain('from');
  const reply = senderDomain('reply-to');
  if (headers.get('from')?.length > 1) add('multiple-from', 20, 'Multiple From headers were present.');
  if (from && reply && from !== reply) {
    add('reply-domain', 25, 'From and Reply-To use different domains. Confirm the reply address independently.');
  }
  if (headers.get('authentication-results')?.some((line) => /\b(?:spf|dkim|dmarc)\s*=\s*(?:fail|softfail|permerror)\b/i.test(line))) {
    add('reported-auth-failure', 20, 'A supplied Authentication-Results header reports a failure. Verify it with the receiving mail server.');
  }

  const combined = subject + '\n' + message;
  if (/\b(?:urgent(?:ly)?|immediately|final notice|within 24 hours|act now)\b/i.test(combined) &&
      /\b(?:password|verify|payment|invoice|wire transfer|gift cards?)\b/i.test(combined)) {
    add('pressure', 25, 'The message combines urgency with a credential or payment cue.');
  }

  const urls = new Set();
  let urlLimitReached = false;
  if (url.trim()) urls.add(url.trim());
  for (const match of message.matchAll(/https?:\/\/[^\s<>"']+/gi)) {
    urls.add(match[0].replace(/[.,;)\]]+$/, ''));
    if (urls.size >= 100) {
      urlLimitReached = true;
      break;
    }
  }
  for (const candidate of urls) {
    let parsed;
    try {
      parsed = new URL(candidate);
    } catch {
      if (candidate === url.trim()) throw new Error('Enter a complete HTTP or HTTPS URL.');
      continue;
    }
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      if (candidate === url.trim()) throw new Error('Enter a complete HTTP or HTTPS URL.');
      continue;
    }
    if (parsed.protocol === 'http:') add('cleartext', 10, 'At least one URL uses cleartext HTTP.');
    if (parsed.username || parsed.password) add('url-userinfo', 35, 'A URL contains user information ahead of its actual hostname.');
    if (parsed.hostname.split('.').some((label) => label.startsWith('xn--'))) {
      add('international-domain', 15, 'A URL uses an encoded internationalized domain. Check the spelling.');
    }
    if (/^\d+(?:\.\d+){3}$|^\[/.test(parsed.hostname)) {
      add('ip-host', 15, 'A URL uses an IP address as its hostname.');
    }
  }

  const score = Math.min(100, findings.reduce((total, finding) => total + finding.points, 0));
  return { score, findings, urlsInspected: urls.size, urlLimitReached };
}

export function attachmentSignals(name) {
  const findings = [];
  if (/\.(?:exe|scr|msi|js|vbs|ps1|bat|cmd|lnk|hta|dll|jar|com|pif)$/i.test(name)) {
    findings.push('The filename has an executable or script extension.');
    if (/\.(?:pdf|docx?|xlsx?|jpg|png|txt)\.[^.]+$/i.test(name)) {
      findings.push('The filename has a document or image extension before its executable extension.');
    }
  }
  if (/[\u202a-\u202e\u2066-\u2069]/u.test(name)) findings.push('The filename contains bidirectional display controls.');
  if (/\.(?:docm|xlsm|pptm)$/i.test(name)) findings.push('The filename indicates a macro-enabled Office document.');
  return findings;
}
