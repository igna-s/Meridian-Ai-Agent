// mock-api.jsx — simulated backend for demo mode (no real server needed)
// Intercepts all /api/* fetch calls; must load after data.jsx.

(function () {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // --- Chat response engine ---

  const CHAT_RESPONSES = [
    {
      match: ['hello', 'hi ', 'hey', 'help', 'what can you', 'who are you', 'what do you do'],
      steps: ['Loading capabilities...'],
      text: `## Hi! I'm VaultMind AI 👋

I'm your engineering project intelligence assistant. I have full context on your team, issues, PRs, sprints, and roadmap.

**Here's what I can help with:**

- 📊 **Sprint status** — "What's the status of Iteration 42?"
- 🚧 **Blockers** — "What's blocking the team right now?"
- 👥 **Team workload** — "Who has capacity to pick up new work?"
- 🗺️ **Roadmap risks** — "Which milestones are at risk this quarter?"
- 🔀 **Pull requests** — "Which PRs need attention?"
- 📝 **Issue triage** — "Summarize open issues by project"

What would you like to know?`
    },
    {
      match: ['aurora', 'aur-', 'canvas', 'tile', 'rendering'],
      steps: [
        'Searching Aurora project issues...',
        'Found 8 open issues in AUR project',
        'Checking PR #2341 status...',
        'Analyzing sprint velocity...',
        'Synthesizing response...'
      ],
      text: `## Aurora Project Status

**Status:** 🟡 Amber — one active blocker, critical path on track.

### Current sprint issues (AUR)
| ID | Title | Priority | Status |
|----|-------|----------|--------|
| AUR-412 | Canvas tile rendering pipeline | 🔴 Urgent | In progress |
| AUR-401 | Hit-test regression >10k nodes | 🟠 High | In review |
| AUR-398 | Multi-select perf on dense graphs | 🟡 Med | Todo |

### PR #2341 (perf/canvas-pipeline)
- Benchmarks: p95 paint **18ms → 9ms** ✓
- Checks: 4 passing, 0 failing
- Status: Awaiting 1 more approval

### Risk
SEC-12 (SSO audit) is the only blocker that can slip Aurora's Jun 12 launch — requires escalation to VP Eng by May 15.

Want me to go deeper on AUR-412 or the PR review queue?`
    },
    {
      match: ['sprint', 'iteration', 'iter 42', 'burndown', 'velocity'],
      steps: [
        'Fetching current sprint data...',
        'Iteration 42 is at day 6 of 14',
        'Computing burndown trajectory...',
        'Checking blocked items...',
        'Generating sprint summary...'
      ],
      text: `## Iteration 42 Status

**Day 6 of 14** · 12/34 story points complete · 82% confidence

### Velocity
\`\`\`
Completed:   ████████░░░░░░░  12 pts  (ideal: 12 ✓)
In progress: ████░░░░░░░░░░░   8 pts
Remaining:   ███████░░░░░░░░  14 pts
\`\`\`

### Goals
1. **Canvas tile pipeline** — 60% complete, on track ✓
2. **Token migration** — 100% complete ✓ *(closed yesterday)*
3. **SSO audit** — 0% complete, **BLOCKED** ⚠️

### Risk
SEC-12 SSO freeze is the critical blocker. If not resolved by Apr 25, expect a ~3 day slip on the iteration close.`
    },
    {
      match: ['block', 'stuck', 'blocker', 'waiting', 'depend'],
      steps: [
        'Searching for blocked items across all projects...',
        'Scanning issue labels and status...',
        'Cross-referencing dependency graph...',
        'Sorting blockers by severity...'
      ],
      text: `## Active Blockers — 3 found

### 🔴 SEC-12 — SSO infra audit freeze
- **Blocked by:** Security eng review not started
- **Deadline:** Jun 1 (firm, immovable)
- **Impact:** Blocks Aurora launch + Tessera SSO features
- **Action needed:** Escalate to VP Eng today — 3-week turnaround minimum needed

### 🟡 AUR-401 — Canvas hit-test regression
- Root cause identified by Kenji
- Fix in review on branch \`perf/hittest-fix\`
- **ETA:** Tomorrow

### 🟡 TSR-92 — Token sync failing on Windows CI
- Intermittent failure, likely path separator bug
- Assigned to Priya
- **ETA:** End of week`
    },
    {
      match: ['pr', 'pull request', 'review queue', 'merge', 'approved', 'open pr'],
      steps: [
        'Fetching open pull requests...',
        'Checking CI status for each PR...',
        'Identifying ready-to-merge candidates...',
        'Sorting by priority...'
      ],
      text: `## Pull Request Status

**7 open PRs** across all projects:

### ✅ Ready to merge (2)
- **#2341** \`perf/canvas-pipeline\` — token sync fix · 2 approvals · checks green
- **#2338** \`fix/ci-timeout\` — CI timeout bump · 1 approval · quick fix

### 👁️ Needs review (3)
- **#2345** \`feat/canvas-resize\` — awaiting 1 more approval
- **#2347** \`sec/sso-middleware\` — awaiting Security team review ⚠️
- **#2349** \`refactor/notifier\` — 2 reviewers assigned, 0 approvals

### 📝 Drafts (2)
- **#2350** \`feat/tessera-dark-mode\` — in progress, not ready
- **#2352** \`feat/perf-dashboard\` — stalled, needs owner

**Recommendation:** Merge **#2341 first** — it unblocks Tessera iOS and Android nightly builds.`
    },
    {
      match: ['team', 'workload', 'capacity', 'over-allocated', 'who is working', 'assignee'],
      steps: [
        'Loading team capacity data...',
        'Computing workload per member...',
        'Checking sprint allocations...',
        'Identifying imbalances...'
      ],
      text: `## Team Workload — Iteration 42

| Member | Assigned | Cap | Status |
|--------|----------|-----|--------|
| Kenji | 18 pts | 12 | 🔴 Over-allocated |
| Sara | 11 pts | 12 | 🟢 On track |
| Priya | 9 pts | 12 | 🟢 Available |
| Diego | 8 pts | 10 | 🟡 Pulled into SEC-12 |
| Amara | 7 pts | 10 | 🟢 On track |
| Rohan | 6 pts | 10 | 🟢 Available |

### Recommendation
Move **TSR-92** (3pts) from Kenji to Priya — she has capacity and it's in her domain. Diego's original 6pts of canvas work is now unassigned; consider pulling it into a backlog item for next iteration.`
    },
    {
      match: ['roadmap', 'milestone', 'quarter', 'q2', 'q3', 'launch', 'at risk'],
      steps: [
        'Loading roadmap data...',
        'Computing milestone risk scores...',
        'Analyzing critical path dependencies...',
        'Generating quarterly overview...'
      ],
      text: `## Q2–Q3 2026 Roadmap

### Q2 (Apr — Jun)
| Initiative | Deadline | Status | Progress |
|-----------|----------|--------|----------|
| Aurora canvas launch | Jun 12 | 🟡 Amber | 42% |
| Token design system v2 | May 30 | 🟢 Green | 78% |
| SSO audit completion | Jun 1 | 🔴 Red | 5% |
| Meridian API v3 | Jun 28 | 🟢 Green | 31% |

### Q3 (Jul — Sep)
| Initiative | Deadline | Status | Progress |
|-----------|----------|--------|----------|
| Tessera 2.0 | Aug 22 | 🟢 Green | 35% |
| Perf dashboard | Sep 5 | 🟢 Green | 20% |
| Infra CDN migration | Sep 30 | ⚪ Not started | 0% |

### Top risks
- **Aurora Jun 12** (Amber) — 5-day slip risk if SEC-12 not resolved by May 15
- **SSO Jun 1** (Red) — must escalate by Jun 9 to hit deadline; 3-week review minimum`
    },
    {
      match: ['issue', 'bug', 'feature', 'open issue', 'all issue', 'list issue', 'backlog', 'triage'],
      steps: [
        'Loading issue tracker...',
        'Grouping by project and status...',
        'Sorting by priority...',
        'Generating summary...'
      ],
      text: `## Issue Overview

**18 open issues** tracked across 5 projects:

### By priority
- 🔴 **Urgent:** 2 issues (AUR-412, SEC-12)
- 🟠 **High:** 5 issues
- 🟡 **Medium:** 8 issues
- 🟢 **Low:** 3 issues

### By project
| Project | Open | In progress | Done this sprint |
|---------|------|-------------|-----------------|
| Aurora (AUR) | 8 | 3 | 2 |
| Tessera (TSR) | 5 | 1 | 3 |
| Nimbus (NIM) | 2 | 1 | 0 |
| Halcyon (HAL) | 2 | 0 | 1 |
| Ember (EMB) | 1 | 0 | 0 |

Want me to filter by assignee, label, or dig into a specific project?`
    },
    {
      match: ['doc', 'documentation', 'wiki', 'handbook', 'adr', 'spec'],
      steps: [
        'Searching documentation tree...',
        'Indexing recent changes...',
        'Generating doc summary...'
      ],
      text: `## Documentation Overview

**14 documents** in the engineering handbook:

### Recently updated
- **ADR 041** — Canvas rendering pipeline *(updated Apr 18)*
- **API Guidelines v3** — Rate limiting rules updated *(Apr 14)*
- **Onboarding guide** — New section on GPU compute access *(Apr 10)*

### Pinned documents
- Engineering Handbook (root)
- Architecture Decision Records
- Team processes & ceremonies

### Stale docs (>60 days)
- Nimbus deployment runbook *(last updated Feb 12)*
- Legacy auth migration guide *(last updated Jan 28)*

Use the Docs view to browse the full tree or create a new document.`
    },
    {
      match: ['summary', 'status update', 'standup', 'brief me', "what's happening", "what happened", 'overview', 'update'],
      steps: [
        'Pulling today\'s activity feed...',
        'Summarizing issue changes...',
        'Checking overnight commits...',
        'Generating standup brief...'
      ],
      text: `## Daily Standup Brief — Apr 20

### Overnight activity
- Kenji pushed **4 commits** to \`perf/canvas-pipeline\`; all checks green ✓
- Priya **closed TSR-88** (token migration — Android) — iteration goal 2 complete ✓
- Security audit freeze pushed to Apr 29, unblocking SEC-12 timeline
- Sara requested your review on **#2341** — 12 minutes ago

### Your focus today
1. **Review #2341** — it's on Iteration 42 critical path
2. **Decide tile-size heuristic** — Kenji is waiting on your call (AUR-412 comment, 12m ago)
3. **Unblock SSO audit** — 30 min with Security eng before standup

### Iteration pulse
On track · 12/34 pts · 82% confidence · 8 days remaining`
    },
  ];

  const FALLBACK_STEPS = [
    'Parsing query...',
    'Searching issue tracker...',
    'Checking PR and sprint data...',
    'Scanning team and roadmap...',
    'No specific match — generating contextual response...'
  ];

  const generateChatResponse = (query) => {
    const q = (query || '').toLowerCase();
    for (const r of CHAT_RESPONSES) {
      if (r.match.some(kw => q.includes(kw))) {
        return { response: r.text, reasoning_data: { steps: r.steps } };
      }
    }
    // Contextual fallback
    const openIssues = (typeof ISSUES !== 'undefined' ? ISSUES : []).filter(i => i.status !== 'done').length;
    const openPRs = (typeof PRS !== 'undefined' ? PRS : []).filter(p => p.status === 'open' || p.status === 'review').length;
    return {
      response: `I searched your project data for **"${query}"** but didn't find a specific match.

Here's a quick snapshot instead:

- **${openIssues} open issues** across all projects
- **${openPRs} PRs** awaiting review
- Iteration 42 is at **35% completion**, day 6 of 14

Try asking about:
- A specific project — *"What's the status of Aurora?"*
- Blockers — *"What's blocking the team?"*
- Workload — *"Who has capacity for new work?"*
- Roadmap — *"Which milestones are at risk?"*`,
      reasoning_data: { steps: FALLBACK_STEPS }
    };
  };

  // --- Route handler ---

  const handleRequest = async (path, method, body) => {
    // Simulate network latency
    await delay(180 + Math.random() * 250);

    // Chat
    if (path === '/api/chat' && method === 'POST') {
      // Add a small "thinking" delay proportional to complexity
      await delay(600 + Math.random() * 800);
      return generateChatResponse(body && body.query);
    }

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
