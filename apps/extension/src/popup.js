import { analyze } from './triage.mjs';

document.querySelector('#version').textContent = chrome.runtime.getManifest().version_name;
const result = document.querySelector('#result');
const webapp = document.querySelector('#webapp');
const open = document.querySelector('#open');

function showLink(value) {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
    throw new Error('Use an HTTPS URL without embedded credentials.');
  }
  parsed.hash = '';
  parsed.search = '';
  open.href = parsed.href;
  open.hidden = false;
  webapp.value = parsed.href;
  return parsed.href;
}

document.querySelector('#analysis').addEventListener('submit', (event) => {
  event.preventDefault();
  result.replaceChildren();
  try {
    const analysis = analyze({
      message: document.querySelector('#message').value,
      url: document.querySelector('#url').value,
    });
    const heading = document.createElement('h2');
    heading.textContent = 'Heuristic score ' + analysis.score + '/100';
    result.append(heading);
    if (analysis.urlLimitReached) result.append("The 100-URL inspection limit was reached. Additional URLs may remain.");
    for (const finding of analysis.findings) {
      const paragraph = document.createElement('p');
      paragraph.textContent = finding.explanation;
      result.append(paragraph);
    }
    if (!analysis.findings.length) result.append('No configured signals matched.');
  } catch (error) {
    result.textContent = error.message;
  }
});

for (const input of document.querySelectorAll('#analysis input, #analysis textarea')) {
  input.addEventListener('input', () => result.replaceChildren());
}

document.querySelector('#settings').addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.querySelector('#saved');
  try {
    const value = showLink(webapp.value);
    await chrome.storage.local.set({ webapp: value });
    status.textContent = 'Web app link saved.';
  } catch (error) {
    status.textContent = error.message;
  }
});

try {
  const stored = await chrome.storage.local.get('webapp');
  if (stored.webapp) showLink(stored.webapp);
} catch {
  document.querySelector('#saved').textContent = 'Save your web app URL to connect.';
}
