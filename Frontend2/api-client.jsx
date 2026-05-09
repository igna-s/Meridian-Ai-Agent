// api-client.jsx — fetch wrapper for CRUD operations
// Reads from /backend/data/*.json (static files on Azure).
// Writes fall back to in-memory ISSUES/PRS/DOCS arrays + localStorage delta.
// mock-api.jsx intercepts /api/* and handles mutations in-memory.

// Pre-load JSON data from static backend files on first load
(async function seedFromBackend() {
  const tryLoad = async (url, globalName) => {
    try {
      const r = await window._realFetch(url);
      if (!r.ok) return;
      const data = await r.json();
      if (Array.isArray(data) && typeof window[globalName] !== 'undefined') {
        // Merge: backend is source of truth; localStorage deltas layered on top
        const delta = JSON.parse(localStorage.getItem('meridian-delta-' + globalName) || '{}');
        window[globalName].length = 0;
        data.forEach(item => {
          window[globalName].push(delta[item.id] ? { ...item, ...delta[item.id] } : item);
        });
        // Append any newly created items stored only in delta
        Object.values(delta).forEach(d => {
          if (d._new && !window[globalName].find(i => i.id === d.id)) {
            window[globalName].push(d);
          }
        });
        console.log(`[api-client] Loaded ${window[globalName].length} items for ${globalName} from backend`);
      }
    } catch(e) {
      console.log(`[api-client] Backend not available for ${globalName}, using built-in data`);
    }
  };

  // Stash real fetch before mock-api overrides it
  window._realFetch = window._realFetch || window.fetch.bind(window);

  await Promise.allSettled([
    tryLoad('/backend/data/issues.json', 'ISSUES'),
    tryLoad('/backend/data/prs.json', 'PRS'),
    tryLoad('/backend/data/docs.json', 'DOCS'),
    tryLoad('/backend/data/projects.json', 'PROJECTS'),
    tryLoad('/backend/data/people.json', 'PEOPLE'),
    tryLoad('/backend/data/inbox.json', 'INBOX'),
  ]);
})();

window.apiFetch = async (method, path, body) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts); // mock-api intercepts /api/* mutations
  if (!res.ok) throw new Error(res.status);
  return res.json();
};

// Persist a mutation delta to localStorage so it survives refresh
window.persistDelta = (collection, item) => {
  const key = 'meridian-delta-' + collection;
  const delta = JSON.parse(localStorage.getItem(key) || '{}');
  delta[item.id] = item;
  localStorage.setItem(key, JSON.stringify(delta));
};

window.meridianRefresh = () =>
  document.dispatchEvent(new CustomEvent('meridian:refresh'));
