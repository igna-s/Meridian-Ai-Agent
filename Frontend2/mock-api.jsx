// mock-api.jsx — simulated CRUD backend for demo mode (no real server needed)
// Intercepts /api/issues, /api/prs, /api/docs fetch calls.
// AI chat is handled by ai-engine.jsx → Groq directly (no mock needed).
// Must load after data.jsx.

(function () {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const handleRequest = async (path, method, body) => {
    await delay(180 + Math.random() * 250);

    // Issues list
    if (path === '/api/issues' && method === 'GET') {
      return typeof ISSUES !== 'undefined' ? [...ISSUES] : [];
    }

    // Single issue
    const issueMatch = path.match(/^\/api\/issues\/([^/]+)$/);
    if (issueMatch) {
      const id = issueMatch[1];
      if (method === 'GET') {
        return typeof ISSUES !== 'undefined' ? ISSUES.find(i => i.id === id) || null : null;
      }
      if (method === 'PATCH' && typeof ISSUES !== 'undefined') {
        const idx = ISSUES.findIndex(i => i.id === id);
        if (idx !== -1) {
          Object.assign(ISSUES[idx], body || {});
          return { ...ISSUES[idx] };
        }
        return null;
      }
    }

    // Create issue
    if (path === '/api/issues' && method === 'POST' && typeof ISSUES !== 'undefined') {
      const proj = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).find(p => p.id === (body && body.project)) || { code: 'AUR' };
      const num = 400 + Math.floor(Math.random() * 200);
      const newIssue = {
        id: `${proj.code}-${num}`,
        title: body.title || 'Untitled',
        priority: body.priority || 'med',
        status: body.status || 'backlog',
        project: body.project || (PROJECTS[0] && PROJECTS[0].id),
        assignees: body.assignees || [],
        labels: body.labels || [],
        estimate: null,
        created: 'just now',
        updated: 'just now',
        commentCount: 0,
      };
      ISSUES.unshift(newIssue);
      return newIssue;
    }

    // PRs list
    if (path === '/api/prs' && method === 'GET') {
      return typeof PRS !== 'undefined' ? [...PRS] : [];
    }

    // Create PR
    if (path === '/api/prs' && method === 'POST' && typeof PRS !== 'undefined') {
      const newPR = {
        id: `#${2360 + Math.floor(Math.random() * 40)}`,
        title: body.title || 'Untitled PR',
        branch: body.branch || 'feature/new',
        base: body.base || 'main',
        status: body.status || 'open',
        author: 'u1',
        project: body.project || 'Aurora',
        additions: 0,
        deletions: 0,
        checks: { passed: 0, failed: 0, running: 1 },
        reviewers: [],
        comments: 0,
        draft: false,
        updated: 'just now',
      };
      PRS.unshift(newPR);
      return newPR;
    }

    // Docs list
    if (path === '/api/docs' && method === 'GET') {
      return typeof DOCS !== 'undefined' ? [...DOCS] : [];
    }

    // Create doc
    if (path === '/api/docs' && method === 'POST' && typeof DOCS !== 'undefined') {
      const newDoc = {
        id: `doc-${Date.now()}`,
        title: (body && body.title) || 'Untitled',
        icon: 'doc-add',
        section: 'Drafts',
        children: [],
      };
      DOCS.push(newDoc);
      return newDoc;
    }

    // Auth / login (stub — always succeeds in demo mode)
    if (path === '/api/auth/login' && method === 'POST') {
      return { token: 'demo-token-' + Date.now(), user: { id: 'u1', name: 'Amara Osei' } };
    }

    // 404 fallback
    return { error: 'Not found', path, method };
  };

  // --- Fetch interceptor ---

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : input.url);
    if (!url || !url.startsWith('/api/')) {
      return originalFetch(input, init);
    }

    const method = ((init && init.method) || 'GET').toUpperCase();
    let body = null;
    if (init && init.body) {
      try { body = JSON.parse(init.body); } catch { body = init.body; }
    }

    try {
      const data = await handleRequest(url, method, body);
      return new Response(JSON.stringify(data), {
        status: data === null ? 404 : 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('[mock-api] Error handling', method, url, err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  // Also cover window.apiFetch so mutations reach the mock
  // (apiFetch is defined later in api-client.jsx, so we patch it after DOMContentLoaded)
  document.addEventListener('DOMContentLoaded', () => {
    // Nothing needed: apiFetch already calls window.fetch which is now intercepted
  });

  console.log('[mock-api] Demo mode active — all /api/* requests are simulated');
})();
