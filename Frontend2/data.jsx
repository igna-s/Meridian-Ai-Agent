// Mock data for Meridian

const PEOPLE = [
  { id: "u1", name: "Amara Okafor", handle: "amara", hue: 300 },
  { id: "u2", name: "Rohan Mehta", handle: "rohan", hue: 220 },
  { id: "u3", name: "Kenji Ito", handle: "kenji", hue: 145 },
  { id: "u4", name: "Sofía Ruiz", handle: "sofia", hue: 20 },
  { id: "u5", name: "Lior Shapira", handle: "lior", hue: 75 },
  { id: "u6", name: "Priya Raman", handle: "priya", hue: 340 },
  { id: "u7", name: "Noah Bergström", handle: "noah", hue: 180 },
  { id: "u8", name: "Aiyana Redcloud", handle: "aiyana", hue: 40 },
  { id: "u9", name: "Tomás Velasco", handle: "tomas", hue: 260 },
];

const initials = (name) => name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();

const Avatar = ({ user, size = "sm" }) => {
  if (!user) return null;
  const s = { "--h": user.hue };
  return (
    <span className={`avatar ${size}`} style={{ background: `linear-gradient(135deg, oklch(0.62 0.16 ${user.hue}), oklch(0.52 0.18 ${(user.hue+60)%360}))`}} title={user.name}>
      {initials(user.name)}
    </span>
  );
};

const AvatarStack = ({ users, max = 3, size = "xs" }) => {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <span style={{ display: "inline-flex" }}>
      {shown.map((u, i) => (
        <span key={u.id} style={{ marginLeft: i === 0 ? 0 : -6, border: "1.5px solid var(--bg-1)", borderRadius: "50%", display: "inline-block" }}>
          <Avatar user={u} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span className={`avatar ${size}`} style={{ marginLeft: -6, background: "var(--bg-3)", color: "var(--fg-1)", border: "1.5px solid var(--bg-1)" }}>
          +{extra}
        </span>
      )}
    </span>
  );
};

const PROJECTS = [
  { id: "aurora", name: "Aurora", code: "AUR", color: "oklch(0.78 0.14 220)" },
  { id: "tessera", name: "Tessera", code: "TES", color: "oklch(0.72 0.17 300)" },
  { id: "nimbus", name: "Nimbus", code: "NIM", color: "oklch(0.80 0.14 75)" },
  { id: "halcyon", name: "Halcyon", code: "HAL", color: "oklch(0.80 0.16 145)" },
  { id: "ember", name: "Ember", code: "EMB", color: "oklch(0.72 0.17 20)" },
];

const LABELS = [
  { id: "bug", name: "bug", color: "oklch(0.70 0.17 20)" },
  { id: "feature", name: "feature", color: "oklch(0.78 0.14 220)" },
  { id: "infra", name: "infra", color: "oklch(0.68 0.12 260)" },
  { id: "design", name: "design", color: "oklch(0.72 0.17 300)" },
  { id: "perf", name: "perf", color: "oklch(0.80 0.14 75)" },
  { id: "a11y", name: "a11y", color: "oklch(0.80 0.16 145)" },
  { id: "docs", name: "docs", color: "oklch(0.65 0.02 250)" },
  { id: "security", name: "security", color: "oklch(0.70 0.17 0)" },
];

// Status enum
const STATUS = ["backlog", "todo", "progress", "review", "done"];
const STATUS_META = {
  backlog:  { label: "Backlog",     klass: "todo" },
  todo:     { label: "Todo",        klass: "todo" },
  progress: { label: "In progress", klass: "progress" },
  review:   { label: "In review",   klass: "review" },
  done:     { label: "Done",        klass: "done" },
  blocked:  { label: "Blocked",     klass: "blocked" },
};

const PRIORITY = {
  urgent: { label: "Urgent", klass: "priority-high", icon: "🔺", dots: 4 },
  high:   { label: "High",   klass: "priority-high", dots: 3 },
  med:    { label: "Medium", klass: "priority-med",  dots: 2 },
  low:    { label: "Low",    klass: "priority-low",  dots: 1 },
  none:   { label: "No priority", klass: "priority-low", dots: 0 },
};

const PriorityGlyph = ({ level }) => {
  const n = PRIORITY[level]?.dots ?? 0;
  const heights = [4, 7, 10, 13];
  const color = level === "urgent" || level === "high" ? "var(--rose)"
    : level === "med" ? "var(--amber)" : "var(--fg-3)";
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 1.5, height: 14 }} title={PRIORITY[level]?.label}>
      {[0,1,2,3].map(i => (
        <span key={i} style={{
          width: 2.5,
          height: heights[i],
          background: i < n ? color : "var(--border-strong)",
          borderRadius: 1
        }} />
      ))}
    </span>
  );
};

const pick = (arr, n) => {
  const out = [];
  const used = new Set();
  while (out.length < n && out.length < arr.length) {
    const i = Math.floor((Math.sin((out.length+1) * 9301 + n * 49297) * 0.5 + 0.5) * arr.length) % arr.length;
    if (!used.has(i)) { used.add(i); out.push(arr[i]); }
  }
  return out;
};

const ISSUES = [
  { id: "AUR-412", title: "Rebuild canvas-rendering pipeline for 10k+ node graphs", status: "progress", priority: "urgent", project: "aurora", assignees: ["u2","u3"], labels: ["perf","infra"], due: "Apr 29", created: "Apr 02", estimate: 8, commentCount: 14, sprint: "Iter 42", branch: "perf/canvas-pipeline" },
  { id: "AUR-418", title: "Keyboard navigation for multi-select in tree view", status: "todo", priority: "high", project: "aurora", assignees: ["u4"], labels: ["a11y"], due: "May 02", created: "Apr 11", estimate: 3, commentCount: 4, sprint: "Iter 42" },
  { id: "TES-207", title: "Design tokens v3: unify semantic layer across platforms", status: "review", priority: "high", project: "tessera", assignees: ["u1","u4"], labels: ["design","docs"], due: "Apr 25", created: "Mar 28", estimate: 5, commentCount: 22, sprint: "Iter 42", branch: "design/tokens-v3" },
  { id: "NIM-091", title: "Migrate ingestion workers from AWS Batch to Kubernetes Jobs", status: "progress", priority: "high", project: "nimbus", assignees: ["u7","u5"], labels: ["infra"], due: "May 10", created: "Mar 20", estimate: 13, commentCount: 31, sprint: "Iter 42", branch: "infra/k8s-migration" },
  { id: "HAL-033", title: "Rotate SSO signing keys for SAML federation", status: "todo", priority: "urgent", project: "halcyon", assignees: ["u8"], labels: ["security"], due: "Apr 22", created: "Apr 15", estimate: 2, commentCount: 3, sprint: "Iter 42" },
  { id: "EMB-514", title: "Fix drag-preview offset on trackpad in Safari 17", status: "backlog", priority: "med", project: "ember", assignees: ["u6"], labels: ["bug"], due: null, created: "Apr 18", estimate: 1, commentCount: 2 },
  { id: "AUR-401", title: "Collaborative cursors: presence reconciliation on reconnect", status: "progress", priority: "med", project: "aurora", assignees: ["u2"], labels: ["feature"], due: "May 05", created: "Apr 07", estimate: 5, commentCount: 18, sprint: "Iter 42", branch: "feat/presence-reconnect" },
  { id: "TES-214", title: "Docs site: MDX components for live previews", status: "todo", priority: "low", project: "tessera", assignees: ["u1"], labels: ["docs","feature"], due: "May 14", created: "Apr 10", estimate: 3, commentCount: 6 },
  { id: "NIM-103", title: "Rate-limit public search endpoint per workspace", status: "review", priority: "high", project: "nimbus", assignees: ["u5","u9"], labels: ["security","perf"], due: "Apr 26", created: "Apr 08", estimate: 3, commentCount: 9, sprint: "Iter 42", branch: "sec/search-ratelimit" },
  { id: "HAL-035", title: "Audit log export as Parquet for BigQuery ingestion", status: "backlog", priority: "med", project: "halcyon", assignees: ["u8","u9"], labels: ["infra","docs"], due: null, created: "Apr 16", estimate: 5, commentCount: 1 },
  { id: "EMB-520", title: "Inline previews of Figma frames in comment threads", status: "done", priority: "med", project: "ember", assignees: ["u6","u4"], labels: ["feature","design"], due: "Apr 12", created: "Mar 30", estimate: 3, commentCount: 11 },
  { id: "AUR-395", title: "Telemetry: sampled traces for canvas interactions", status: "done", priority: "low", project: "aurora", assignees: ["u7"], labels: ["infra","perf"], due: "Apr 08", created: "Mar 22", estimate: 2, commentCount: 5 },
  { id: "TES-199", title: "Color contrast warnings inline in token editor", status: "done", priority: "high", project: "tessera", assignees: ["u1"], labels: ["a11y","design"], due: "Apr 14", created: "Apr 01", estimate: 2, commentCount: 7 },
  { id: "NIM-110", title: "Regional failover runbook for EU-West primary", status: "todo", priority: "urgent", project: "nimbus", assignees: ["u7"], labels: ["infra","docs","security"], due: "Apr 30", created: "Apr 17", estimate: 5, commentCount: 2, sprint: "Iter 42" },
  { id: "HAL-041", title: "SCIM provisioning: nested group mapping", status: "progress", priority: "med", project: "halcyon", assignees: ["u8"], labels: ["feature","security"], due: "May 09", created: "Apr 09", estimate: 8, commentCount: 14, sprint: "Iter 42", branch: "feat/scim-groups" },
  { id: "EMB-523", title: "Comments: resolve threads without losing context", status: "review", priority: "med", project: "ember", assignees: ["u6","u3"], labels: ["feature"], due: "Apr 27", created: "Apr 13", estimate: 3, commentCount: 8, sprint: "Iter 42", branch: "feat/resolve-threads" },
  { id: "AUR-422", title: "Export canvas → SVG with embedded fonts", status: "todo", priority: "low", project: "aurora", assignees: ["u3"], labels: ["feature"], due: "May 20", created: "Apr 18", estimate: 5, commentCount: 0 },
  { id: "TES-220", title: "Motion tokens: cubic-bezier presets", status: "backlog", priority: "low", project: "tessera", assignees: ["u4"], labels: ["design"], due: null, created: "Apr 19", estimate: 2, commentCount: 1 },
];

// Pull requests
const PRS = [
  { id: "#2341", title: "perf(canvas): tile-based rendering with offscreen canvas", author: "u2", status: "open", branch: "perf/canvas-pipeline", base: "main", issue: "AUR-412", additions: 842, deletions: 217, reviewers: ["u3","u7"], checks: { passed: 11, failed: 1, running: 2 }, updated: "2h ago" },
  { id: "#2339", title: "feat(tokens): v3 semantic layer", author: "u1", status: "review", branch: "design/tokens-v3", base: "main", issue: "TES-207", additions: 1204, deletions: 890, reviewers: ["u4"], checks: { passed: 14, failed: 0, running: 0 }, updated: "5h ago" },
  { id: "#2338", title: "infra(k8s): batch → jobs migration phase 2", author: "u7", status: "draft", branch: "infra/k8s-migration", base: "main", issue: "NIM-091", additions: 421, deletions: 180, reviewers: ["u5"], checks: { passed: 8, failed: 0, running: 3 }, updated: "1d ago" },
  { id: "#2337", title: "sec(search): per-workspace rate limiting", author: "u5", status: "review", branch: "sec/search-ratelimit", base: "main", issue: "NIM-103", additions: 312, deletions: 44, reviewers: ["u9","u7"], checks: { passed: 12, failed: 0, running: 0 }, updated: "3h ago" },
  { id: "#2335", title: "feat(scim): nested group mapping", author: "u8", status: "open", branch: "feat/scim-groups", base: "main", issue: "HAL-041", additions: 678, deletions: 121, reviewers: ["u9"], checks: { passed: 9, failed: 2, running: 0 }, updated: "6h ago" },
  { id: "#2334", title: "feat(comments): resolve threads with context snapshot", author: "u6", status: "merged", branch: "feat/resolve-threads", base: "main", issue: "EMB-523", additions: 298, deletions: 76, reviewers: ["u3"], checks: { passed: 15, failed: 0, running: 0 }, updated: "1d ago" },
  { id: "#2332", title: "feat(presence): reconcile on websocket reconnect", author: "u2", status: "open", branch: "feat/presence-reconnect", base: "main", issue: "AUR-401", additions: 184, deletions: 52, reviewers: ["u7"], checks: { passed: 13, failed: 0, running: 1 }, updated: "8h ago" },
];

// Docs tree
const DOCS = [
  { id: "d1", title: "Engineering handbook", emoji: "◐", section: "space", children: [
    { id: "d2", title: "Architecture decisions", emoji: "◇", children: [
      { id: "d3", title: "ADR 041 — Canvas rendering pipeline", updated: "2d ago", author: "u2" },
      { id: "d4", title: "ADR 042 — Multi-region data residency", updated: "5d ago", author: "u7" },
      { id: "d5", title: "ADR 043 — Typed RPC between services", updated: "1w ago", author: "u5" },
    ]},
    { id: "d6", title: "On-call runbooks", emoji: "◈", children: [
      { id: "d7", title: "Ingestion pipeline saturation", updated: "3d ago", author: "u7" },
      { id: "d8", title: "SAML SSO outage procedure", updated: "1w ago", author: "u8" },
    ]},
    { id: "d9", title: "Release process", updated: "4d ago", author: "u5" },
  ]},
  { id: "d10", title: "Product briefs", emoji: "◑", section: "space", children: [
    { id: "d11", title: "Q2 planning — themes & bets", updated: "1d ago", author: "u1" },
    { id: "d12", title: "Aurora: collaborative canvas PRD", updated: "2d ago", author: "u1" },
    { id: "d13", title: "Tessera: design system v3 vision", updated: "6h ago", author: "u4" },
  ]},
  { id: "d14", title: "Meeting notes", emoji: "◎", section: "space", children: [
    { id: "d15", title: "Apr 18 — Platform weekly", updated: "2d ago", author: "u5" },
    { id: "d16", title: "Apr 17 — Design review: Aurora", updated: "3d ago", author: "u4" },
    { id: "d17", title: "Apr 15 — Incident review: EU-West", updated: "5d ago", author: "u7" },
  ]},
];

// Activity / notifications
const INBOX = [
  { id: "n1", type: "mention", from: "u1", target: "AUR-412", text: "mentioned you in a comment", snippet: "@you — can you weigh in on the tile-size heuristic? I think 256 is…", time: "12m", unread: true, kind: "issue" },
  { id: "n2", type: "review", from: "u4", target: "#2339", text: "requested your review on", snippet: "feat(tokens): v3 semantic layer", time: "34m", unread: true, kind: "pr" },
  { id: "n3", type: "assign", from: "u5", target: "NIM-110", text: "assigned you", snippet: "Regional failover runbook for EU-West primary", time: "1h", unread: true, kind: "issue" },
  { id: "n4", type: "status", from: "u2", target: "#2341", text: "marked checks failing on", snippet: "e2e-canvas: 'cursor-reconnect' flaked on retry", time: "2h", unread: true, kind: "pr" },
  { id: "n5", type: "comment", from: "u6", target: "EMB-523", text: "replied in a thread", snippet: "The snapshot approach feels right, but we should bound…", time: "3h", unread: false, kind: "issue" },
  { id: "n6", type: "doc", from: "u1", target: "d12", text: "updated the PRD", snippet: "Aurora: collaborative canvas — v0.4 with multi-select changes", time: "6h", unread: false, kind: "doc" },
  { id: "n7", type: "merged", from: "u6", target: "#2334", text: "merged pull request", snippet: "feat(comments): resolve threads with context snapshot", time: "1d", unread: false, kind: "pr" },
  { id: "n8", type: "due", target: "HAL-033", text: "is due tomorrow", snippet: "Rotate SSO signing keys for SAML federation", time: "1d", unread: false, kind: "issue" },
];

// Sprints
const SPRINTS = [
  { id: "i42", name: "Iteration 42", range: "Apr 14 – Apr 28", active: true, done: 12, scope: 34, velocity: 47 },
  { id: "i41", name: "Iteration 41", range: "Mar 31 – Apr 13", active: false, done: 29, scope: 29, velocity: 52 },
  { id: "i40", name: "Iteration 40", range: "Mar 17 – Mar 30", active: false, done: 27, scope: 31, velocity: 45 },
  { id: "i43", name: "Iteration 43", range: "Apr 28 – May 12", active: false, done: 0, scope: 18, velocity: 0 },
];

// Roadmap items
const ROADMAP = [
  { id: "r1", title: "Aurora 2.0 — collaborative canvas", project: "aurora", q: "Q2", startCol: 0, span: 9, progress: 62, status: "progress" },
  { id: "r2", title: "Tessera design tokens v3", project: "tessera", q: "Q2", startCol: 1, span: 5, progress: 85, status: "review" },
  { id: "r3", title: "Nimbus EU-West multi-region", project: "nimbus", q: "Q2", startCol: 2, span: 10, progress: 40, status: "progress" },
  { id: "r4", title: "Halcyon — SSO hardening", project: "halcyon", q: "Q2", startCol: 0, span: 4, progress: 58, status: "progress" },
  { id: "r5", title: "Ember — comment system overhaul", project: "ember", q: "Q2", startCol: 4, span: 6, progress: 30, status: "progress" },
  { id: "r6", title: "Aurora plugins SDK preview", project: "aurora", q: "Q3", startCol: 9, span: 6, progress: 5, status: "todo" },
  { id: "r7", title: "Tessera — motion system", project: "tessera", q: "Q3", startCol: 6, span: 4, progress: 0, status: "todo" },
  { id: "r8", title: "Nimbus — query cost insights", project: "nimbus", q: "Q3", startCol: 12, span: 6, progress: 0, status: "todo" },
  { id: "r9", title: "Halcyon — audit log streaming", project: "halcyon", q: "Q3", startCol: 4, span: 7, progress: 0, status: "todo" },
];

Object.assign(window, {
  PEOPLE, PROJECTS, LABELS, STATUS, STATUS_META, PRIORITY,
  ISSUES, PRS, DOCS, INBOX, SPRINTS, ROADMAP,
  Avatar, AvatarStack, PriorityGlyph, initials
});
