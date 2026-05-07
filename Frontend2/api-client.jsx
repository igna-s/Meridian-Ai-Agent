// Thin fetch wrapper that attaches the auth token and returns parsed JSON.
// Usage: await window.apiFetch('GET', '/api/issues')
//        await window.apiFetch('POST', '/api/issues', { title: '...' })
// Call window.meridianRefresh() after any mutation to let all live views re-fetch.

window.apiFetch = async (method, path, body) => {
  const token = localStorage.getItem('meridian-token');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(res.status);
  return res.json();
};

window.meridianRefresh = () =>
  document.dispatchEvent(new CustomEvent('meridian:refresh'));
