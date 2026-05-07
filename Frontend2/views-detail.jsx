// Issue detail + Docs + Roadmap + Sprints + PRs + Team + Settings

// ==== ISSUE DETAIL ====
const IssueDetail = ({ issueId, setView }) => {
  const [issue, setIssue] = React.useState(ISSUES.find(i => i.id === issueId) || ISSUES[0]);
  const proj = PROJECTS.find(p => p.id === issue.project);
  const assignees = issue.assignees.map(id => PEOPLE.find(p => p.id === id));
  const [activeTab, setActiveTab] = React.useState("comments");

  React.useEffect(() => {
    const load = () => window.apiFetch('GET', `/api/issues/${issueId}`).then(setIssue).catch(() => {});
    load();
    document.addEventListener('meridian:refresh', load);
    return () => document.removeEventListener('meridian:refresh', load);
  }, [issueId]);

  const activity = [
    { type: "create", user: "u1", time: "Apr 02", text: "opened this issue" },
    { type: "status", user: "u1", time: "Apr 02", text: "moved from backlog to todo" },
    { type: "assign", user: "u5", time: "Apr 07", text: "assigned Rohan Mehta and Kenji Ito" },
    { type: "comment", user: "u2", time: "Apr 09", text: "Baseline profiling below — main hot path is composite hit-testing on every pointermove. Worth exploring tile-level caches before we touch the renderer.", code: true },
    { type: "status", user: "u2", time: "Apr 09", text: "moved to in progress" },
    { type: "branch", user: "u2", time: "Apr 09", text: "linked branch perf/canvas-pipeline" },
    { type: "comment", user: "u3", time: "Apr 12", text: "Quick question on the tile size — are we going with 256px or adaptive? I worry about memory pressure on large documents.", code: false },
    { type: "comment", user: "u2", time: "Apr 12", text: "Adaptive: base 256, halves if a tile's point count > 2k. Prototyped in the branch." },
    { type: "pr", user: "u2", time: "Apr 14", text: "opened pull request #2341" },
    { type: "comment", user: "u1", time: "12m", text: "@Kenji — can you weigh in on the tile-size heuristic? I want to make sure it plays well with the presence system.", highlight: true },
  ];

  const related = ISSUES.filter(i => i.project === issue.project && i.id !== issue.id).slice(0, 4);

  return (
    <div className="flex flex-1" style={{ minWidth: 0 }}>
      <div className="flex col flex-1" style={{ minWidth: 0, borderRight: "1px solid var(--border)" }}>
        {/* Sub-header */}
        <div className="page-header">
          <button className="icon-btn" onClick={() => setView("issues")}><Icon name="chevron-left" size={16} /></button>
          <span className="mono muted" style={{ fontSize: 12 }}>{issue.id}</span>
          <div className="status progress flex items-center gap-6" style={{ fontSize: 11.5 }}>
            <span className="s-dot" />In progress
          </div>
          <div className="topbar-spacer" />
          <button className="btn ghost sm" onClick={() => window.copyLink(issue.id)}><Icon name="link" size={13} /> Copy link</button>
          <button className="btn ghost sm" onClick={() => window.openAttach()}><Icon name="attach" size={13} /></button>
          <button className="btn sm" onClick={() => window.openPicker({ title: "Issue actions", options: [
            { value: "duplicate", label: "Duplicate", icon: "plus" },
            { value: "subscribe", label: "Subscribe", icon: "bell" },
            { value: "archive", label: "Archive", icon: "x" },
            { value: "delete", label: "Delete", icon: "x" },
          ], onChoose: (o) => window.toast(o.label) })}><Icon name="more" size={13} /></button>
        </div>

        <div className="scroll-y issue-spotlight" style={{ flex: 1, padding: "24px 32px 48px", maxWidth: 820, width: "100%", margin: "0 auto" }}>
          <h1 className="editorial hero-title" style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.015em", margin: "0 0 8px", lineHeight: 1.2 }}>
            {issue.title}
          </h1>
          <div className="flex items-center gap-8 muted" style={{ fontSize: 12, marginBottom: 24 }}>
            <Avatar user={PEOPLE.find(p => p.id === "u1")} size="xs" />
            <strong style={{ color: "var(--fg-1)" }}>Amara</strong>
            <span>opened</span>
            <span className="mono">{issue.id}</span>
            <span>on {issue.created}</span>
            <span>·</span>
            <span>{issue.commentCount} comments</span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 32, lineHeight: 1.6, fontSize: 13.5, color: "var(--fg-1)" }}>
            <p>The current canvas-rendering path redraws the entire viewport on every interaction — cursor moves, selection changes, even hover states. For documents above ~2,000 nodes we're seeing 18–24ms paint budgets, which turns into sub-30fps during multi-select drags.</p>

            <p>This work rebuilds the pipeline around three primitives:</p>

            <ul>
              <li><strong>Tile-based composition.</strong> Split the scene into adaptive 256×256 tiles, each backed by an <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "var(--bg-2)", padding: "1px 5px", borderRadius: 4, border: "1px solid var(--border)" }}>OffscreenCanvas</code>. Only dirty tiles repaint.</li>
              <li><strong>Hit-test indexing.</strong> R-tree keyed by bounding boxes, rebuilt incrementally on edit.</li>
              <li><strong>Transform isolation.</strong> Pan/zoom become CSS transforms on the tile grid — no repaint needed.</li>
            </ul>

            <p><strong>Target:</strong> steady 60fps on documents up to 10k nodes, p95 paint budget under 8ms. Traces attached below.</p>
          </div>

          {/* Checklist */}
          <div style={{ marginBottom: 32, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div className="flex items-center" style={{ padding: "10px 14px", background: "var(--bg-1)", borderBottom: "1px solid var(--border)", fontSize: 12, gap: 8 }}>
              <strong>Acceptance criteria</strong>
              <span className="mono muted-2">3 / 5</span>
              <div style={{ flex: 1 }} />
              <div style={{ width: 60, height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: "60%", height: "100%", background: "var(--accent)" }} />
              </div>
            </div>
            {[
              { done: true, text: "Tile-based composition with OffscreenCanvas" },
              { done: true, text: "Hit-test R-tree with incremental rebuild" },
              { done: true, text: "Pan/zoom without full repaint" },
              { done: false, text: "Benchmark harness for 1k/5k/10k scenes" },
              { done: false, text: "Regression guard in CI (perf budget ≤ 8ms p95)" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-10" style={{ padding: "8px 14px", borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none", fontSize: 12.5 }}>
                <span style={{
                  width: 14, height: 14, border: "1.5px solid var(--border-strong)", borderRadius: 3,
                  background: c.done ? "var(--accent)" : "transparent",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  color: "var(--accent-fg)"
                }}>{c.done && <Icon name="check" size={10} strokeWidth={3} />}</span>
                <span style={{ textDecoration: c.done ? "line-through" : "none", color: c.done ? "var(--fg-3)" : "var(--fg-0)" }}>{c.text}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center" style={{ borderBottom: "1px solid var(--border)", marginBottom: 16, gap: 0 }}>
            {[
              { id: "comments", label: "Activity", count: 14 },
              { id: "linked", label: "Linked work", count: 3 },
              { id: "files", label: "Attachments", count: 4 },
            ].map(t => (
              <button key={t.id} className="flex items-center gap-6" onClick={() => setActiveTab(t.id)}
                style={{ padding: "8px 14px", fontSize: 12.5, color: activeTab === t.id ? "var(--fg-0)" : "var(--fg-2)", fontWeight: 500, borderBottom: `2px solid ${activeTab === t.id ? "var(--accent)" : "transparent"}`, marginBottom: -1 }}>
                {t.label} <span className="mono muted-2" style={{ fontSize: 10.5 }}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Activity */}
          {activeTab === "comments" && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {activity.map((ev, i) => {
                  const u = PEOPLE.find(p => p.id === ev.user);
                  if (ev.type === "comment") {
                    return (
                      <div key={i} className="flex gap-10" style={{ background: ev.highlight ? "var(--accent-soft)" : "var(--bg-1)", border: `1px solid ${ev.highlight ? "var(--accent-dim)" : "var(--border)"}`, borderRadius: 10, padding: 12 }}>
                        <Avatar user={u} size="sm" />
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-6" style={{ marginBottom: 4, fontSize: 12 }}>
                            <strong>{u.name}</strong>
                            <span className="muted-2">{ev.time} ago</span>
                          </div>
                          <div style={{ fontSize: 13, lineHeight: 1.5 }}>{ev.text}</div>
                          {ev.code && (
                            <pre className="mono" style={{ marginTop: 8, background: "var(--bg-0)", border: "1px solid var(--border)", padding: 10, borderRadius: 6, fontSize: 11, color: "var(--fg-1)", overflow: "auto" }}>
{`scripting   4.2ms
rendering   14.8ms
painting     3.1ms
compositing  0.8ms  ← budget OK
--------------------
  paint (main thread)  18.1ms  ❌ p95 target 8ms`}
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  }
                  const iconFor = { create: "plus", status: "arrow-right", assign: "at", branch: "branch", pr: "pr" };
                  return (
                    <div key={i} className="flex items-center gap-10 muted" style={{ fontSize: 11.5, paddingLeft: 4 }}>
                      <span className="avatar xs" style={{ background: "var(--bg-2)", color: "var(--fg-2)" }}><Icon name={iconFor[ev.type]} size={9} /></span>
                      {u && <strong style={{ color: "var(--fg-1)", fontWeight: 500 }}>{u.name.split(" ")[0]}</strong>}
                      <span>{ev.text}</span>
                      <span style={{ marginLeft: "auto" }} className="mono muted-2">{ev.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 10, padding: 4, background: "var(--bg-1)" }}>
                <textarea id="commentbox" placeholder="Leave a comment… /commands and @mentions supported" rows={3} style={{
                  width: "100%", background: "transparent", border: "none", outline: "none", resize: "vertical",
                  padding: 10, fontSize: 13, fontFamily: "inherit", color: "var(--fg-0)"
                }} />
                <div className="flex items-center gap-6" style={{ padding: 6, borderTop: "1px solid var(--border-subtle)" }}>
                  <button className="icon-btn" title="Attach" onClick={() => window.openAttach()}><Icon name="attach" size={13} /></button>
                  <button className="icon-btn" title="Code" onClick={() => window.toast("Insert code block")}><Icon name="hash" size={13} /></button>
                  <button className="icon-btn" title="Mention" onClick={() => window.toast("Mention teammate")}><Icon name="at" size={13} /></button>
                  <button className="icon-btn" title="AI" onClick={() => window.openAI("What's blocking Aurora?")}><Icon name="sparkle" size={13} /></button>
                  <div style={{ flex: 1 }} />
                  <span className="mono muted-2" style={{ fontSize: 10.5 }}>⌘↵ to send</span>
                  <button className="btn sm primary" onClick={() => {
                    const el = document.getElementById("commentbox");
                    if (!el || !el.value.trim()) { window.toast("Type a comment first"); return; }
                    window.toast("Comment posted"); el.value = "";
                  }}>Comment</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <aside style={{ width: 300, flexShrink: 0, padding: "20px 16px", overflow: "auto" }}>
        <Section title="Status">
          <div className="flex items-center gap-8" onClick={() => window.openPicker({ title: "Status", options: [
            { value: "backlog", label: "Backlog" },{ value: "todo", label: "Todo" },
            { value: "progress", label: "In progress" },{ value: "review", label: "In review" },{ value: "done", label: "Done" },
          ], onChoose: (o) => window.apiFetch('PATCH', `/api/issues/${issue.id}`, { status: o.value }).then(setIssue).catch(() => window.toast("Update failed")) })} style={{ cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: "var(--bg-1)", border: "1px solid var(--border)" }}>
            <span className={`status ${issue.status === 'backlog' ? 'todo' : issue.status}`}><span className="s-dot" /></span>
            <span style={{ fontSize: 12.5 }}>{STATUS_META[issue.status]?.label || issue.status}</span>
            <Icon name="chevron-down" size={12} style={{ marginLeft: "auto", color: "var(--fg-3)" }} />
          </div>
        </Section>
        <Section title="Priority">
          <div className="flex items-center gap-8" onClick={() => window.openPicker({ title: "Priority", options: [
            { value: "urgent", label: "Urgent" },{ value: "high", label: "High" },{ value: "med", label: "Medium" },{ value: "low", label: "Low" },{ value: "none", label: "No priority" },
          ], onChoose: (o) => window.apiFetch('PATCH', `/api/issues/${issue.id}`, { priority: o.value }).then(setIssue).catch(() => window.toast("Update failed")) })} style={{ cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: "var(--bg-1)", border: "1px solid var(--border)" }}>
            <PriorityGlyph level={issue.priority} />
            <span style={{ fontSize: 12.5 }}>{issue.priority === 'med' ? 'Medium' : issue.priority?.charAt(0).toUpperCase() + issue.priority?.slice(1)}</span>
            <Icon name="chevron-down" size={12} style={{ marginLeft: "auto", color: "var(--fg-3)" }} />
          </div>
        </Section>
        <Section title="Assignees">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {assignees.map(a => (
              <div key={a.id} className="flex items-center gap-8" style={{ fontSize: 12.5 }}>
                <Avatar user={a} size="xs" />
                <span>{a.name}</span>
                <span className="mono muted-2" style={{ marginLeft: "auto", fontSize: 10.5 }}>@{a.handle}</span>
              </div>
            ))}
            <button className="btn ghost sm" style={{ justifyContent: "flex-start", marginTop: 2 }} onClick={() => window.openPicker({ title: "Assign teammate", options: PEOPLE.map(u => ({ value: u.id, label: u.name, hint: `@${u.handle}` })), onChoose: (o) => window.apiFetch('PATCH', `/api/issues/${issue.id}`, { assignees: [...issue.assignees, o.value] }).then(setIssue).catch(() => window.toast("Update failed")) })}><Icon name="plus" size={12} /> Add</button>
          </div>
        </Section>
        <Section title="Project">
          <div className="flex items-center gap-8" style={{ fontSize: 12.5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: proj.color }} />
            <span>{proj.name}</span>
            <span className="mono muted-2" style={{ marginLeft: "auto", fontSize: 10.5 }}>{proj.code}</span>
          </div>
        </Section>
        <Section title="Sprint">
          <div className="flex items-center gap-8" style={{ fontSize: 12.5 }}>
            <Icon name="sprint" size={13} style={{ color: "var(--accent)" }} />
            <span>Iteration 42</span>
            <span className="mono muted-2" style={{ marginLeft: "auto", fontSize: 10.5 }}>Apr 14–28</span>
          </div>
        </Section>
        <Section title="Labels">
          <div className="flex items-center gap-4" style={{ flexWrap: "wrap" }}>
            {issue.labels.map(lid => {
              const lab = LABELS.find(l => l.id === lid);
              return <span key={lid} className="tag" style={{ color: lab.color }}>#{lab.name}</span>;
            })}
            <button className="tag muted-2" onClick={() => window.openPicker({ title: "Add label", options: LABELS.map(l => ({ value: l.id, label: `#${l.name}`, swatch: l.color })), onChoose: (o) => window.apiFetch('PATCH', `/api/issues/${issue.id}`, { labels: [...issue.labels, o.value] }).then(setIssue).catch(() => window.toast("Update failed")) })}><Icon name="plus" size={10} /></button>
          </div>
        </Section>
        <Section title="Estimate">
          <div className="flex items-center gap-6" style={{ fontSize: 12.5 }}>
            <span className="mono" style={{ fontSize: 14 }}>{issue.estimate}</span>
            <span className="muted">points</span>
            <div style={{ flex: 1 }} />
            <span className="muted-2 mono" style={{ fontSize: 10.5 }}>~3d</span>
          </div>
        </Section>
        <Section title="Dates">
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>
            <div className="flex items-center justify-between"><span className="muted">Created</span><span className="mono">{issue.created}</span></div>
            <div className="flex items-center justify-between"><span className="muted">Due</span><span className="mono" style={{ color: "var(--rose)" }}>{issue.due}</span></div>
            <div className="flex items-center justify-between"><span className="muted">Updated</span><span className="mono">2h ago</span></div>
          </div>
        </Section>
        {issue.branch && (
          <Section title="Development">
            <div className="flex items-center gap-6" style={{ fontSize: 11.5, padding: "6px 8px", borderRadius: 6, background: "var(--bg-1)", border: "1px solid var(--border)" }}>
              <Icon name="branch" size={12} style={{ color: "var(--accent)" }} />
              <span className="mono">{issue.branch}</span>
            </div>
            <div className="flex items-center gap-6" style={{ fontSize: 11.5, padding: "6px 8px", borderRadius: 6, background: "var(--bg-1)", border: "1px solid var(--border)", marginTop: 6 }}>
              <Icon name="pr" size={12} style={{ color: "var(--accent)" }} />
              <span className="mono">#2341</span>
              <span className="truncate">perf(canvas): tile-based rendering</span>
            </div>
          </Section>
        )}
        <Section title="Related">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {related.map(r => (
              <button key={r.id} className="flex items-center gap-6" style={{ textAlign: "left", padding: "4px 6px", borderRadius: 4, fontSize: 11.5 }}>
                <PriorityGlyph level={r.priority} />
                <span className="mono muted-2" style={{ fontSize: 10.5 }}>{r.id}</span>
                <span className="truncate flex-1">{r.title}</span>
              </button>
            ))}
          </div>
        </Section>
      </aside>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div className="sb-label" style={{ padding: "0 0 6px 0" }}>{title}</div>
    {children}
  </div>
);

// ==== DOCS ====
const DocsView = () => {
  const [selected, setSelected] = React.useState("d3");
  const [expanded, setExpanded] = React.useState(new Set(["d1","d2","d6","d10"]));
  const [docs, setDocs] = React.useState(DOCS);

  React.useEffect(() => {
    const load = () => window.apiFetch('GET', '/api/docs').then(setDocs).catch(() => {});
    load();
    document.addEventListener('meridian:refresh', load);
    return () => document.removeEventListener('meridian:refresh', load);
  }, []);

  const toggle = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderTree = (items, depth = 0) => items.map(it => (
    <div key={it.id}>
      <button className="flex items-center gap-6" onClick={() => { if (it.children) toggle(it.id); setSelected(it.id); }}
        style={{
          width: "100%", textAlign: "left", padding: "4px 10px", fontSize: 12.5, paddingLeft: 10 + depth * 14,
          color: selected === it.id ? "var(--fg-0)" : "var(--fg-1)",
          background: selected === it.id ? "var(--bg-2)" : "transparent",
          borderRadius: 5,
        }}>
        {it.children ? (
          <Icon name={expanded.has(it.id) ? "chevron-down" : "chevron-right"} size={11} style={{ color: "var(--fg-3)" }} />
        ) : <span style={{ width: 11 }} />}
        {it.emoji ? <span style={{ fontSize: 11, color: "var(--fg-2)" }}>{it.emoji}</span> : <Icon name="docs" size={12} style={{ color: "var(--fg-2)" }} />}
        <span className="truncate">{it.title}</span>
      </button>
      {it.children && expanded.has(it.id) && renderTree(it.children, depth + 1)}
    </div>
  ));

  return (
    <div className="flex flex-1" style={{ minWidth: 0 }}>
      <aside style={{ width: 260, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--bg-1)", overflow: "auto" }}>
        <div style={{ padding: "12px 12px 6px" }}>
          <div className="search" style={{ minWidth: 0 }}>
            <Icon name="search" size={12} />
            <input placeholder="Search docs…" />
          </div>
        </div>
        <div style={{ padding: "6px 4px 24px" }}>
          {renderTree(docs)}
        </div>
      </aside>
      <div className="flex col flex-1" style={{ minWidth: 0 }}>
        <div className="page-header">
          <div className="page-title">
            <span className="eyebrow">DOCS / ENGINEERING HANDBOOK / ADR</span>
          </div>
          <div className="topbar-spacer" />
          <span className="chip" style={{ color: "var(--fg-2)" }}><Icon name="lock" size={11} /> Private</span>
          <button className="btn ghost sm" onClick={() => window.toast("Watching this doc") }><Icon name="eye" size={13} /> 8</button>
          <div className="vdivider" style={{ height: 20 }} />
          <AvatarStack users={[PEOPLE[1], PEOPLE[2], PEOPLE[4]]} size="xs" />
          <button className="btn ghost sm" onClick={() => window.openAI("Summarize this doc")}><Icon name="sparkle" size={13} /> Ask AI</button>
          <button className="btn sm primary" onClick={() => window.openShare("ADR 041 — Canvas rendering pipeline")}><Icon name="plus" size={13} /> Share</button>
        </div>

        <div className="scroll-y" style={{ flex: 1, padding: "40px 64px" }}>
          <article style={{ maxWidth: 740, margin: "0 auto" }}>
            <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>ADR 041 · Engineering · Accepted</div>
            <h1 className="editorial" style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 400, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              Canvas rendering pipeline, rebuilt on tiles
            </h1>
            <div className="flex items-center gap-10 muted" style={{ fontSize: 12.5, marginBottom: 36 }}>
              <Avatar user={PEOPLE[1]} size="xs" />
              <span><strong style={{ color: "var(--fg-1)" }}>Rohan Mehta</strong> · updated 2 days ago</span>
              <span>·</span>
              <span>4 min read</span>
              <span>·</span>
              <span className="flex items-center gap-4"><Icon name="link" size={11} /> AUR-412</span>
            </div>

            <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--fg-1)" }}>
              <p style={{ fontSize: 17, color: "var(--fg-0)", fontStyle: "italic" }}>
                The canvas hasn't aged well. Between <code style={{ fontFamily: "var(--font-mono)", fontSize: 13, background: "var(--bg-2)", padding: "2px 6px", borderRadius: 4 }}>v1.2</code> and now, the scene graph quietly quintupled in size while the renderer stayed monolithic. This is the plan to pay that down.
              </p>

              <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 36, marginBottom: 10, color: "var(--fg-0)" }}>Context</h2>
              <p>At the shape of traffic we saw in March, p95 paint budgets crossed 18ms on documents above ~2k nodes. The current pipeline repaints the entire viewport on every pointer event — inexpensive in isolation, expensive when multiplied by modern input rates.</p>

              <blockquote style={{ margin: "20px 0", paddingLeft: 16, borderLeft: "2px solid var(--accent)", fontStyle: "italic", color: "var(--fg-1)" }}>
                We don't need a new renderer. We need a renderer that knows when <em>not</em> to run.
              </blockquote>

              <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 36, marginBottom: 10, color: "var(--fg-0)" }}>Decision</h2>
              <p>Adopt a tile-composited pipeline. Each tile owns its own <code style={{ fontFamily: "var(--font-mono)", fontSize: 13, background: "var(--bg-2)", padding: "2px 6px", borderRadius: 4 }}>OffscreenCanvas</code>; the compositor composes tiles on the main thread using cheap CSS transforms for pan and zoom.</p>

              {/* Code block */}
              <div style={{ margin: "20px 0", borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
                <div className="flex items-center gap-8" style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg-1)", fontSize: 11, color: "var(--fg-2)" }}>
                  <Icon name="hash" size={11} />
                  <span className="mono">renderer/tile.ts</span>
                </div>
                <pre className="mono" style={{ margin: 0, padding: 14, background: "var(--bg-0)", fontSize: 12, lineHeight: 1.65, color: "var(--fg-1)", overflow: "auto" }}>
{`interface Tile {
  readonly key: TileKey
  readonly bounds: Rect
  readonly canvas: OffscreenCanvas
  dirty: boolean
  version: number
}

function composite(
  viewport: Rect,
  tiles: ReadonlyMap<TileKey, Tile>,
  ctx: CanvasRenderingContext2D,
): void {
  for (const tile of visible(viewport, tiles)) {
    if (tile.dirty) repaint(tile)
    ctx.drawImage(tile.canvas, tile.bounds.x, tile.bounds.y)
  }
}`}
                </pre>
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 36, marginBottom: 10, color: "var(--fg-0)" }}>Consequences</h2>
              <ul>
                <li>Peak memory goes up (tile atlases) but flat-lines instead of growing linearly with document size.</li>
                <li>Multi-select drag is dominated by compositing, not repainting — costs drop by an order of magnitude.</li>
                <li>Plugin renderers have to target tiles, not the root canvas; we ship a shim for the transition.</li>
              </ul>

              {/* Callout */}
              <div style={{ margin: "24px 0", padding: "14px 16px", background: "var(--amber-soft)", border: "1px solid var(--amber)", borderRadius: 8, fontSize: 13, color: "var(--fg-0)" }}>
                <div className="flex items-center gap-6" style={{ marginBottom: 4 }}>
                  <Icon name="flag" size={13} style={{ color: "var(--amber)" }} />
                  <strong style={{ fontSize: 12.5 }}>Migration risk</strong>
                </div>
                Third-party plugin renderers (14 in the registry as of Q1) will need a recompile against <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "var(--bg-1)", padding: "1px 5px", borderRadius: 3 }}>@meridian/canvas@2</code>. The shim buys us one minor version.
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

// ==== ROADMAP ====
const RoadmapView = () => {
  const months = ["Apr","May","Jun","Jul","Aug","Sep"];
  const cellsPerQ = 9; // cols in timeline
  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      <div className="page-header">
        <div className="page-title">
          <span>Roadmap</span>
          <span className="mono muted-2" style={{ fontSize: 12 }}>Q2 — Q3 2026</span>
        </div>
        <div className="topbar-spacer" />
        <div className="segmented">
          <button className="on">Timeline</button>
          <button onClick={() => window.openPicker({ title: "Switch view", options: [{ value: "q", label: "Quarters" }, { value: "m", label: "Milestones" }], onChoose: (o) => window.toast(`Switched to ${o.label}`) })}>Quarters</button>
          <button onClick={() => window.openPicker({ title: "Milestones", options: [{ value: "m1", label: "Aurora launch · Jun 12" }, { value: "m2", label: "SSO audit · Jul 1" }, { value: "m3", label: "Tessera 2.0 · Aug 22" }], onChoose: (o) => window.toast(o.label) })}>Milestones</button>
        </div>
        <button className="btn ghost sm" onClick={() => window.openPicker({ title: "Filter projects", options: PROJECTS.map(p => ({ value: p.id, label: p.name, swatch: p.color })), onChoose: (o) => window.toast(`Filtered to ${o.label}`) })}><Icon name="filter" size={13} /> Projects: all</button>
        <button className="btn ghost sm" onClick={() => window.openAI("What milestones are at risk this quarter?")}><Icon name="sparkle" size={13} /> AI Summary</button>
        <button className="btn sm primary" onClick={() => window.openNewIssue({ kind: "initiative" })}><Icon name="plus" size={13} /> New initiative</button>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: "16px 20px 40px" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: 0, position: "sticky", top: 0, background: "var(--bg-0)", zIndex: 2, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRight: "1px solid var(--border)" }}>
            <strong style={{ fontSize: 13 }}>Q2 2026</strong>
            <span className="mono muted-2" style={{ fontSize: 10.5 }}>APR — JUN</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px" }}>
            <strong style={{ fontSize: 13 }}>Q3 2026</strong>
            <span className="mono muted-2" style={{ fontSize: 10.5 }}>JUL — SEP</span>
          </div>
        </div>

        {/* Months */}
        <div style={{ display: "grid", gridTemplateColumns: `220px repeat(${months.length}, 1fr)`, borderBottom: "1px solid var(--border-subtle)" }}>
          <div />
          {months.map((m, i) => (
            <div key={i} className="mono muted-2" style={{ padding: "6px 10px", fontSize: 11, borderLeft: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>{m}</div>
          ))}
        </div>

        {/* Group by project */}
        {PROJECTS.map(proj => {
          const items = ROADMAP.filter(r => r.project === proj.id);
          if (!items.length) return null;
          return (
            <div key={proj.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-8" style={{ padding: "10px 0 6px 6px", position: "sticky", left: 0 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: proj.color }} />
                <strong style={{ fontSize: 12 }}>{proj.name}</strong>
                <span className="mono muted-2" style={{ fontSize: 10.5 }}>{proj.code}</span>
                <span className="chip">{items.length}</span>
              </div>
              {items.map(it => {
                // Map startCol (0-17) across 2 quarters
                const totalCells = 18;
                const startPct = (it.startCol / totalCells) * 100;
                const widthPct = (it.span / totalCells) * 100;
                return (
                  <div key={it.id} style={{ display: "grid", gridTemplateColumns: `220px repeat(${months.length}, 1fr)`, alignItems: "center", padding: "6px 0", position: "relative" }}>
                    <div className="flex items-center gap-6 truncate" style={{ padding: "0 8px", fontSize: 12.5 }}>
                      <Icon name="bolt" size={12} style={{ color: proj.color }} />
                      <span className="truncate">{it.title}</span>
                    </div>
                    <div style={{ gridColumn: `2 / span ${months.length}`, position: "relative", height: 30 }}>
                      {months.map((_, i) => (
                        <div key={i} style={{ position: "absolute", left: `${(i / months.length) * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed var(--border-subtle)" }} />
                      ))}
                      <div className="roadmap-bar" style={{
                        position: "absolute", left: `${startPct}%`, width: `${widthPct}%`,
                        top: 4, bottom: 4, borderRadius: 6,
                        background: `color-mix(in oklch, ${proj.color} 22%, var(--bg-1))`,
                        border: `1px solid ${proj.color}`,
                        boxShadow: `0 0 20px -6px ${proj.color}`,
                        "--proj": proj.color,
                        overflow: "hidden",
                        display: "flex", alignItems: "center", padding: "0 10px",
                        fontSize: 11.5, color: "var(--fg-0)", gap: 8
                      }}>
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${proj.color} 0%, ${proj.color} ${it.progress}%, transparent ${it.progress}%)`, opacity: 0.25 }} />
                        <span className="truncate" style={{ position: "relative" }}>{it.title}</span>
                        <span className="mono muted-2" style={{ position: "relative", marginLeft: "auto", fontSize: 10.5 }}>{it.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Today marker note */}
        <div className="flex items-center gap-8 mono muted-2" style={{ fontSize: 10.5, marginTop: 12 }}>
          <span style={{ width: 12, height: 2, background: "var(--accent)" }} />
          <span>Today · Apr 20</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { IssueDetail, DocsView, RoadmapView });
