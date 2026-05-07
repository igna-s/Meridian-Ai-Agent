// Home (dashboard) + Inbox + Issues (board + list) + Issue detail

// ==== HOME ====
const HomeView = ({ setView, setIssueId, cardStyle }) => {
  if (cardStyle === "minimal") return <HomeMinimal setView={setView} setIssueId={setIssueId} />;
  return <HomeDetailed setView={setView} setIssueId={setIssueId} />;
};

// Minimal home: quiet, scannable, editorial. Just 3 things.
const HomeMinimal = ({ setView, setIssueId }) => {
  const myIssues = ISSUES.filter(i => i.assignees.includes("u1") || i.assignees.includes("u2")).slice(0, 4);
  const activePRs = PRS.filter(p => p.status !== "merged").slice(0, 3);
  const urgentCount = ISSUES.filter(i => i.priority === "urgent").length;

  return (
    <div className="scroll-y" style={{ padding: "48px 28px 32px", flex: 1, minWidth: 0 }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Quiet greeting */}
        <div style={{ marginBottom: 48 }}>
          <div className="mono muted-2" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Monday · 20 April · 07:48</div>
          <h1 className="editorial" style={{ margin: 0, fontSize: 40, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
            Good morning, Amara.
          </h1>
          <p className="muted" style={{ fontSize: 16, marginTop: 10, lineHeight: 1.5, fontWeight: 300 }}>
            {urgentCount} urgent · {activePRs.length} reviews waiting · Iteration 42 on track.
          </p>
          <div className="flex gap-8" style={{ marginTop: 18 }}>
            <button className="btn" onClick={() => window.openWeek()}><Icon name="calendar" size={13} /> Week</button>
            <button className="btn" onClick={() => window.openDigest()}><Icon name="sparkle" size={13} /> Digest</button>
          </div>
        </div>

        {/* Focus — plain list, no chrome */}
        <div style={{ marginBottom: 40 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <div className="mono muted-2" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>Your focus</div>
            <button className="btn ghost sm" onClick={() => setView("issues")}>All issues <Icon name="arrow-right" size={12} /></button>
          </div>
          <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
            {myIssues.map(is => {
              const proj = PROJECTS.find(p => p.id === is.project);
              return (
                <button key={is.id}
                  onClick={() => { setIssueId(is.id); setView("issue"); }}
                  style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 0", borderBottom: "1px solid var(--border-subtle)", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer" }}>
                  <PriorityGlyph level={is.priority} />
                  <span className="mono muted-2" style={{ fontSize: 11, width: 64, flexShrink: 0 }}>{is.id}</span>
                  <span style={{ flex: 1, fontSize: 14 }} className="truncate">{is.title}</span>
                  <span className="mono muted-2" style={{ fontSize: 11 }}>{proj.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reviews — minimal */}
        <div style={{ marginBottom: 40 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <div className="mono muted-2" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>Review queue</div>
            <button className="btn ghost sm" onClick={() => setView("prs")}>All PRs <Icon name="arrow-right" size={12} /></button>
          </div>
          <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
            {activePRs.map(pr => {
              const author = PEOPLE.find(p => p.id === pr.author);
              return (
                <button key={pr.id} onClick={() => window.openPR(pr)}
                  style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 0", borderBottom: "1px solid var(--border-subtle)", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer" }}>
                  <Avatar user={author} size="xs" />
                  <span className="mono muted-2" style={{ fontSize: 11, width: 64, flexShrink: 0 }}>{pr.id}</span>
                  <span style={{ flex: 1, fontSize: 14 }} className="truncate">{pr.title}</span>
                  <span className="mono muted-2" style={{ fontSize: 11 }}>{pr.updated}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* One-line iteration status */}
        <div style={{ padding: "18px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "baseline", gap: 16 }}>
          <span className="mono muted-2" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>Iteration 42</span>
          <span style={{ fontSize: 14 }}><strong className="mono">12</strong><span className="muted"> / 34 pts · day 6 of 14 · on track</span></span>
          <div style={{ flex: 1 }} />
          <div style={{ width: 120, height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "35%", height: "100%", background: "var(--accent)" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Detailed home: the current dense dashboard
const HomeDetailed = ({ setView, setIssueId }) => {
  const myIssues = ISSUES.filter(i => i.assignees.includes("u1") || i.assignees.includes("u2")).slice(0, 5);
  const activePRs = PRS.filter(p => p.status !== "merged");
  const recentDocs = [
    { title: "Aurora: collaborative canvas PRD", author: "u1", time: "2h ago" },
    { title: "ADR 041 — Canvas rendering pipeline", author: "u2", time: "2d ago" },
    { title: "Apr 18 — Platform weekly", author: "u5", time: "2d ago" },
  ];

  const weekDays = ["Apr 14","15","16","17","18","19","20"];
  // Fake velocity sparkline
  const velocity = [3, 7, 5, 9, 12, 8, 11];

  return (
    <div className="scroll-y" style={{ padding: "24px 28px", flex: 1, minWidth: 0 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* greeting */}
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <div>
            <div className="mono muted-2" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Monday · 20 April 2026</div>
            <h1 className="editorial hero-title" style={{ margin: 0, fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em" }}>
              Good morning, Amara. Four things need your attention today.
            </h1>
          </div>
          <div className="flex gap-8">
            <button className="btn" onClick={() => window.openWeek()}><Icon name="calendar" size={13} /> This week</button>
            <button className="btn primary" onClick={() => window.openDigest()}><Icon name="sparkle" size={13} /> Daily digest</button>
          </div>
        </div>

        {/* focus row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
          {/* My focus */}
          <div className="card" style={{ padding: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <div className="flex items-center gap-8">
                <strong style={{ fontSize: 13 }}>My focus</strong>
                <span className="chip">{myIssues.length} issues</span>
              </div>
              <button className="btn ghost sm" onClick={() => setView("issues")}>View all <Icon name="arrow-right" size={12} /></button>
            </div>
            <div className="ruled">
              {myIssues.map(is => {
                const proj = PROJECTS.find(p => p.id === is.project);
                return (
                  <button key={is.id} className="flex items-center gap-12" style={{ width: "100%", padding: "10px 4px", textAlign: "left" }}
                    onClick={() => { setIssueId(is.id); setView("issue"); }}>
                    <PriorityGlyph level={is.priority} />
                    <span className="mono muted-2" style={{ fontSize: 11, width: 64, flexShrink: 0 }}>{is.id}</span>
                    <span className="status" >
                      <span className="s-dot" style={{ borderColor: `var(--status-${is.status === "backlog" ? "todo" : is.status})`, background: is.status === "done" ? `var(--status-${is.status})` : "transparent" }} />
                    </span>
                    <span className="flex-1 truncate" style={{ fontSize: 12.5 }}>{is.title}</span>
                    <span className="chip" style={{ color: proj.color, borderColor: "transparent", background: "transparent", padding: "2px 0" }}>
                      <span className="d" style={{ background: proj.color }} /> {proj.code}
                    </span>
                    <span className="muted-2 mono" style={{ fontSize: 11, width: 60, textAlign: "right" }}>{is.due || "—"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Iteration 42 progress */}
          <div className="card" style={{ padding: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <strong style={{ fontSize: 13 }}>Iteration 42</strong>
              <span className="chip"><span className="d" style={{ background: "var(--accent)" }} /> active</span>
            </div>
            <div className="muted mono" style={{ fontSize: 11, marginBottom: 12 }}>Apr 14 — Apr 28 · day 6 of 14</div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span className="stat-num" style={{ fontSize: 42 }}>12</span>
              <span className="muted" style={{ fontSize: 13 }}>/ 34 points done</span>
            </div>

            {/* segmented bar */}
            <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "var(--bg-3)", marginBottom: 10 }}>
              <div style={{ flex: 12, background: "var(--accent)" }} />
              <div style={{ flex: 8, background: "var(--violet)" }} />
              <div style={{ flex: 5, background: "var(--amber)" }} />
              <div style={{ flex: 9, background: "var(--bg-3)" }} />
            </div>

            <div className="flex gap-12" style={{ fontSize: 11.5, flexWrap: "wrap" }}>
              <span className="flex items-center gap-4"><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)" }} /> Done · 12</span>
              <span className="flex items-center gap-4"><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--violet)" }} /> Review · 8</span>
              <span className="flex items-center gap-4"><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--amber)" }} /> Doing · 5</span>
              <span className="flex items-center gap-4"><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--bg-3)" }} /> Todo · 9</span>
            </div>

            <div className="divider" />

            <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
              <span className="muted">On track for</span>
              <span>Apr 26 <span className="muted-2">(2d early)</span></span>
            </div>
          </div>
        </div>

        {/* second row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          {/* PR queue */}
          <div className="card" style={{ padding: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>Your review queue</strong>
              <button className="btn ghost sm" onClick={() => setView("prs")}>{activePRs.length}<Icon name="arrow-right" size={12} /></button>
            </div>
            <div className="ruled">
              {activePRs.slice(0, 4).map(pr => {
                const author = PEOPLE.find(p => p.id === pr.author);
                return (
                  <div key={pr.id} style={{ padding: "9px 0" }}>
                    <div className="flex items-center gap-8" style={{ marginBottom: 4 }}>
                      <Icon name="pr" size={13} style={{ color: pr.status === "draft" ? "var(--fg-3)" : "var(--accent)" }} />
                      <span className="mono muted-2" style={{ fontSize: 11 }}>{pr.id}</span>
                      <span className="flex-1 truncate" style={{ fontSize: 12 }}>{pr.title}</span>
                    </div>
                    <div className="flex items-center gap-8 muted" style={{ fontSize: 11 }}>
                      <Avatar user={author} size="xs" />
                      <span className="mono">{author.handle}</span>
                      <span>·</span>
                      <span style={{ color: "var(--status-done)" }}>+{pr.additions}</span>
                      <span style={{ color: "var(--rose)" }}>−{pr.deletions}</span>
                      <span>·</span>
                      <span>{pr.checks.failed ? <span style={{ color: "var(--rose)" }}>✕ {pr.checks.failed}</span> : <span style={{ color: "var(--status-done)" }}>✓ {pr.checks.passed}</span>}</span>
                      <span style={{ marginLeft: "auto" }}>{pr.updated}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity stream */}
          <div className="card" style={{ padding: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>Activity</strong>
              <span className="mono muted-2" style={{ fontSize: 11 }}>live</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {INBOX.slice(0, 5).map(n => {
                const u = PEOPLE.find(p => p.id === n.from);
                return (
                  <div key={n.id} className="flex gap-8" style={{ fontSize: 12 }}>
                    {u ? <Avatar user={u} size="xs" /> : <span className="avatar xs" style={{ background: "var(--bg-3)" }} />}
                    <div style={{ flex: 1, minWidth: 0, lineHeight: 1.4 }}>
                      <div>
                        {u && <strong>{u.name.split(" ")[0]}</strong>}{" "}
                        <span className="muted">{n.text}</span>{" "}
                        <span className="mono" style={{ color: "var(--accent)" }}>{n.target}</span>
                      </div>
                      <div className="muted-2 mono" style={{ fontSize: 10.5 }}>{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Velocity */}
          <div className="card" style={{ padding: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>Team velocity</strong>
              <span className="chip" style={{ color: "var(--status-done)" }}><Icon name="trend" size={11} /> +8%</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 96, marginBottom: 10 }}>
              {velocity.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className={`velo-bar ${i === velocity.length - 1 ? "" : "dim"}`} style={{ width: "100%", height: `${v * 7}px`, borderRadius: 3 }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between muted-2 mono" style={{ fontSize: 10 }}>
              {weekDays.map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="divider" />
            <div className="flex items-center justify-between" style={{ fontSize: 11.5 }}>
              <span className="muted">Avg points / day</span>
              <strong className="mono">7.8</strong>
            </div>
            <div className="flex items-center justify-between" style={{ fontSize: 11.5, marginTop: 4 }}>
              <span className="muted">Cycle time p50</span>
              <strong className="mono">2.4d</strong>
            </div>
          </div>
        </div>

        {/* Recent docs */}
        <div className="card" style={{ padding: 16, marginBottom: 32 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <strong style={{ fontSize: 13 }}>Recently edited docs</strong>
            <button className="btn ghost sm" onClick={() => setView("docs")}>All docs <Icon name="arrow-right" size={12} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {recentDocs.map((d, i) => {
              const u = PEOPLE.find(p => p.id === d.author);
              return (
                <button key={i} className="flex col" style={{
                  padding: 14, border: "1px solid var(--border)", borderRadius: 10,
                  background: "var(--bg-0)", textAlign: "left", gap: 8
                }} onClick={() => setView("docs")}>
                  <Icon name="docs" size={15} style={{ color: "var(--fg-2)" }} />
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{d.title}</div>
                  <div className="flex items-center gap-6 muted" style={{ fontSize: 11 }}>
                    <Avatar user={u} size="xs" />
                    <span>{u.name.split(" ")[0]}</span>
                    <span>·</span>
                    <span>{d.time}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==== ISSUES ====
const IssuesView = ({ setView, setIssueId, cardStyle }) => {
  const [mode, setMode] = React.useState("board");
  const [grouping, setGrouping] = React.useState("status");
  const [issues, setIssues] = React.useState(ISSUES);

  React.useEffect(() => {
    const load = () => window.apiFetch('GET', '/api/issues').then(setIssues).catch(() => {});
    load();
    document.addEventListener('meridian:refresh', load);
    return () => document.removeEventListener('meridian:refresh', load);
  }, []);

  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      <div className="page-header">
        <div className="page-title">
          <span className="eyebrow">PROJECT / AURORA</span>
          <Icon name="chevron-right" size={12} style={{ color: "var(--fg-3)" }} />
          <span>Issues</span>
          <span className="chip mono">{issues.length}</span>
        </div>
        <div className="topbar-spacer" />
        <button className="btn ghost sm" onClick={() => window.openFilter("issues")}><Icon name="filter" size={13} /> Filter</button>
        <button className="btn ghost sm" onClick={() => window.openPicker({
          title: "Group by",
          options: [
            { value: "status", label: "Status" },
            { value: "priority", label: "Priority" },
            { value: "assignee", label: "Assignee" },
            { value: "project", label: "Project" },
            { value: "label", label: "Label" },
          ],
          onChoose: (o) => setGrouping(o.value),
        })}>Group: <span className="mono" style={{ color: "var(--fg-0)" }}>{grouping}</span> <Icon name="chevron-down" size={12} /></button>
        <div className="vdivider" style={{ height: 20 }} />
        <div className="segmented">
          <button className={mode === "board" ? "on" : ""} onClick={() => setMode("board")}><Icon name="board" size={13} /> Board</button>
          <button className={mode === "list" ? "on" : ""} onClick={() => setMode("list")}><Icon name="list" size={13} /> List</button>
          <button className={mode === "timeline" ? "on" : ""} onClick={() => setMode("timeline")}><Icon name="timeline" size={13} /> Timeline</button>
        </div>
        <button className="btn ghost sm" onClick={() => window.openAI("What are the top blocking issues right now?")}><Icon name="sparkle" size={13} /> AI Summary</button>
        <button className="btn sm primary" onClick={() => window.openNewIssue()}><Icon name="plus" size={13} /> New issue</button>
      </div>

      {mode === "board" && <KanbanBoard setView={setView} setIssueId={setIssueId} cardStyle={cardStyle} issues={issues} />}
      {mode === "list" && <IssuesList setView={setView} setIssueId={setIssueId} issues={issues} />}
      {mode === "timeline" && <IssuesTimeline issues={issues} />}
    </div>
  );
};

const KanbanBoard = ({ setView, setIssueId, cardStyle, issues }) => {
  const cols = [
    { key: "backlog", label: "Backlog" },
    { key: "todo", label: "Todo" },
    { key: "progress", label: "In progress" },
    { key: "review", label: "In review" },
    { key: "done", label: "Done" },
  ];
  return (
    <div className="scroll-y" style={{ flex: 1, padding: "12px 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(260px, 1fr))`, gap: 12, minHeight: "100%" }}>
        {cols.map(col => {
          const items = issues.filter(i => i.status === col.key);
          const klass = col.key === "backlog" ? "todo" : col.key;
          return (
            <div key={col.key} style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
              <div className="flex items-center gap-8" style={{ padding: "6px 8px", marginBottom: 6 }}>
                <span className={`status ${klass}`}><span className="s-dot" /></span>
                <strong style={{ fontSize: 12 }}>{col.label}</strong>
                <span className="mono muted-2" style={{ fontSize: 11 }}>{items.length}</span>
                <div style={{ flex: 1 }} />
                <button className="icon-btn" style={{ width: 20, height: 20 }} onClick={() => window.openNewIssue({ status: col.key })}><Icon name="plus" size={12} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map(is => <KanbanCard key={is.id} issue={is} setView={setView} setIssueId={setIssueId} minimal={cardStyle === "minimal"} />)}
                {items.length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", color: "var(--fg-3)", border: "1px dashed var(--border)", borderRadius: 8, fontSize: 11.5 }}>
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KanbanCard = ({ issue, setView, setIssueId, minimal }) => {
  const proj = PROJECTS.find(p => p.id === issue.project);
  const assignees = issue.assignees.map(id => PEOPLE.find(p => p.id === id));
  if (minimal) {
    return (
      <button className="card" style={{ padding: "8px 10px", textAlign: "left", background: "var(--bg-1)" }}
        onClick={() => { setIssueId(issue.id); setView("issue"); }}>
        <div className="flex items-center gap-6" style={{ marginBottom: 4 }}>
          <PriorityGlyph level={issue.priority} />
          <span className="mono muted-2" style={{ fontSize: 10.5 }}>{issue.id}</span>
          <div style={{ flex: 1 }} />
          <AvatarStack users={assignees} size="xs" />
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.3 }}>{issue.title}</div>
      </button>
    );
  }
  return (
    <button className="card" style={{ padding: 10, textAlign: "left", background: "var(--bg-1)", display: "flex", flexDirection: "column", gap: 8 }}
      onClick={() => { setIssueId(issue.id); setView("issue"); }}>
      <div className="flex items-center gap-6">
        <PriorityGlyph level={issue.priority} />
        <span className="mono muted-2" style={{ fontSize: 10.5 }}>{issue.id}</span>
        <div style={{ flex: 1 }} />
        <span className="chip" style={{ color: proj.color, borderColor: "var(--border-subtle)", background: "transparent" }}>
          <span className="d" style={{ background: proj.color }} /> {proj.code}
        </span>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.35 }}>{issue.title}</div>
      <div className="flex items-center gap-6" style={{ flexWrap: "wrap" }}>
        {issue.labels.slice(0, 2).map(lid => {
          const lab = LABELS.find(l => l.id === lid);
          return <span key={lid} className="tag" style={{ color: lab.color }}>#{lab.name}</span>;
        })}
      </div>
      <div className="flex items-center gap-8" style={{ fontSize: 10.5, color: "var(--fg-3)" }}>
        <AvatarStack users={assignees} size="xs" />
        <div style={{ flex: 1 }} />
        {issue.branch && <span className="flex items-center gap-2"><Icon name="branch" size={10} /></span>}
        {issue.commentCount > 0 && <span className="flex items-center gap-2 mono"><Icon name="message" size={10} />{issue.commentCount}</span>}
        {issue.due && <span className="flex items-center gap-2 mono"><Icon name="calendar" size={10} />{issue.due}</span>}
      </div>
    </button>
  );
};

const IssuesList = ({ setView, setIssueId, issues }) => {
  const groups = {};
  issues.forEach(i => { (groups[i.status] ||= []).push(i); });

  return (
    <div className="scroll-y" style={{ flex: 1 }}>
      {STATUS.map(s => {
        const items = groups[s] || [];
        if (!items.length) return null;
        const klass = s === "backlog" ? "todo" : s;
        return (
          <div key={s}>
            <div className="flex items-center gap-8" style={{ padding: "10px 20px", background: "var(--bg-1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <span className={`status ${klass}`}><span className="s-dot" /></span>
              <strong style={{ fontSize: 12 }}>{STATUS_META[s].label}</strong>
              <span className="mono muted-2" style={{ fontSize: 11 }}>{items.length}</span>
              <div style={{ flex: 1 }} />
              <button className="icon-btn" style={{ width: 20, height: 20 }} onClick={() => window.openNewIssue({ status: s })}><Icon name="plus" size={12} /></button>
            </div>
            {items.map(is => {
              const proj = PROJECTS.find(p => p.id === is.project);
              const assignees = is.assignees.map(id => PEOPLE.find(p => p.id === id));
              return (
                <button key={is.id} className="row" style={{ width: "100%", textAlign: "left", paddingLeft: 20, paddingRight: 20 }}
                  onClick={() => { setIssueId(is.id); setView("issue"); }}>
                  <PriorityGlyph level={is.priority} />
                  <span className="mono muted-2" style={{ fontSize: 11, width: 70, flexShrink: 0 }}>{is.id}</span>
                  <span className="flex-1 truncate">{is.title}</span>
                  {is.labels.slice(0, 2).map(lid => {
                    const lab = LABELS.find(l => l.id === lid);
                    return <span key={lid} className="tag" style={{ color: lab.color, flexShrink: 0 }}>#{lab.name}</span>;
                  })}
                  <span className="chip" style={{ color: proj.color, flexShrink: 0 }}>
                    <span className="d" style={{ background: proj.color }} /> {proj.code}
                  </span>
                  {is.sprint && <span className="mono muted-2" style={{ fontSize: 11, flexShrink: 0 }}>{is.sprint}</span>}
                  <span className="muted-2 mono" style={{ fontSize: 11, width: 50, textAlign: "right", flexShrink: 0 }}>{is.due || "—"}</span>
                  <AvatarStack users={assignees} size="xs" />
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const IssuesTimeline = ({ issues }) => {
  // Weeks Apr 7 – Jun 1 (8 weeks)
  const weeks = ["Apr 07","Apr 14","Apr 21","Apr 28","May 05","May 12","May 19","May 26"];
  const items = issues.filter(i => i.due).slice(0, 10).map((is, i) => ({
    issue: is,
    startWeek: (i * 3) % 5,
    span: 1 + (i % 3),
  }));
  return (
    <div className="scroll-y" style={{ flex: 1, padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: `240px repeat(${weeks.length}, 1fr)`, fontSize: 11, color: "var(--fg-3)", borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
        <div />
        {weeks.map(w => <div key={w} className="mono" style={{ padding: "0 6px" }}>{w}</div>)}
      </div>
      <div>
        {items.map(({ issue, startWeek, span }) => {
          const proj = PROJECTS.find(p => p.id === issue.project);
          return (
            <div key={issue.id} style={{ display: "grid", gridTemplateColumns: `240px repeat(${weeks.length}, 1fr)`, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-6 truncate" style={{ fontSize: 12 }}>
                <PriorityGlyph level={issue.priority} />
                <span className="mono muted-2" style={{ fontSize: 10.5 }}>{issue.id}</span>
                <span className="truncate">{issue.title}</span>
              </div>
              {weeks.map((_, i) => (
                <div key={i} style={{ height: 24, position: "relative", borderLeft: "1px dashed var(--border-subtle)" }}>
                  {i === startWeek && (
                    <div style={{
                      position: "absolute", top: 3, bottom: 3, left: 4, right: 4,
                      width: `calc(${span * 100}% - 8px)`,
                      background: `color-mix(in oklch, ${proj.color} 30%, var(--bg-1))`,
                      borderLeft: `3px solid ${proj.color}`,
                      borderRadius: 4,
                      padding: "2px 6px", fontSize: 10.5, fontFamily: "var(--font-mono)",
                      color: "var(--fg-0)", overflow: "hidden", whiteSpace: "nowrap"
                    }}>
                      {issue.id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { HomeView, IssuesView });
