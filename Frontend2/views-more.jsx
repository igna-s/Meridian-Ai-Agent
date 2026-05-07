// Sprints, Pull requests, Team, Settings views

// ==== SPRINTS ====
const SprintsView = ({ setView, setIssueId }) => {
  const active = SPRINTS.find(s => s.active);
  const sprintIssues = ISSUES.filter(i => i.sprint === "Iter 42");
  const byStatus = { backlog: [], todo: [], progress: [], review: [], done: [] };
  sprintIssues.forEach(i => byStatus[i.status]?.push(i));

  // burndown data (ideal vs actual)
  const days = 14;
  const ideal = Array.from({ length: days + 1 }, (_, i) => 34 - (34 / days) * i);
  const actual = [34, 34, 33, 31, 30, 28, 25, null, null, null, null, null, null, null, null];
  // build path
  const W = 100, H = 100;
  const toPath = (pts, prop = "actual") => pts.map((v, i) => v == null ? null : `${(i / days) * W},${H - (v / 34) * H}`).filter(Boolean).join(" ");

  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      <div className="page-header">
        <div className="page-title">
          <Icon name="sprint" size={15} style={{ color: "var(--accent)" }} />
          <span>Iteration 42</span>
          <span className="chip" style={{ color: "var(--accent)" }}><span className="d" style={{ background: "var(--accent)" }} /> active</span>
          <span className="mono muted-2" style={{ fontSize: 11 }}>Apr 14 – Apr 28 · day 6/14</span>
        </div>
        <div className="topbar-spacer" />
        <button className="btn ghost sm" onClick={() => window.openSprintReport()}><Icon name="download" size={13} /> Report</button>
        <button className="btn ghost sm" onClick={() => window.openRetro()}><Icon name="sparkle" size={13} /> Retrospective draft</button>
        <button className="btn ghost sm" onClick={() => window.openAI("Summarize Iteration 42 progress")}><Icon name="sparkle" size={13} /> AI Summary</button>
        <button className="btn sm" onClick={() => { if(confirm("Complete iteration 42? 22pts will move to backlog.")) window.toast("Iteration 42 closed"); }}>Complete iteration</button>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: 20 }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          {/* Top summary */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 16, marginBottom: 20 }}>
            {/* Burndown */}
            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 13 }}>Burndown</strong>
                <span className="chip mono" style={{ color: "var(--status-done)" }}>−22 pts</span>
              </div>
              <div style={{ position: "relative", height: 180, marginTop: 8 }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  {/* gridlines */}
                  {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border-subtle)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
                  ))}
                  {/* ideal */}
                  <polyline points={toPath(ideal)} fill="none" stroke="var(--fg-3)" strokeWidth="0.4" strokeDasharray="1 1" vectorEffect="non-scaling-stroke" />
                  {/* actual */}
                  <polyline className="burndown-actual" points={toPath(actual)} fill="none" stroke="var(--accent)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                  {/* today marker */}
                  <line x1={(6/days)*100} y1="0" x2={(6/days)*100} y2="100" stroke="var(--accent-dim)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="flex justify-between muted-2 mono" style={{ fontSize: 10, marginTop: 6 }}>
                <span>Apr 14</span>
                <span>Apr 21</span>
                <span>Apr 28</span>
              </div>
              <div className="divider" />
              <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>Remaining</div>
                  <div className="mono" style={{ fontSize: 15 }}>22<span className="muted-2" style={{ fontSize: 11 }}> pts</span></div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>Required / day</div>
                  <div className="mono" style={{ fontSize: 15 }}>2.75</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>Confidence</div>
                  <div className="mono" style={{ fontSize: 15, color: "var(--status-done)" }}>82%</div>
                </div>
              </div>
            </div>

            {/* Status breakdown + goals */}
            <div style={{ display: "grid", gridTemplateRows: "auto 1fr", gap: 16 }}>
              <div className="card" style={{ padding: 16 }}>
                <strong style={{ fontSize: 13, marginBottom: 10, display: "block" }}>By status</strong>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                  {STATUS.map(s => {
                    const items = byStatus[s] || [];
                    const klass = s === "backlog" ? "todo" : s;
                    return (
                      <div key={s}>
                        <div className={`status ${klass} flex items-center gap-6`} style={{ fontSize: 11, marginBottom: 4 }}><span className="s-dot" />{STATUS_META[s].label}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span className="stat-num" style={{ fontSize: 30 }}>{items.length}</span>
                          <span className="muted-2 mono" style={{ fontSize: 10.5 }}>issues</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 13 }}>Iteration goals</strong>
                  <span className="mono muted-2" style={{ fontSize: 11 }}>2 of 3 on track</span>
                </div>
                {[
                  { text: "Ship Aurora canvas performance rebuild to canary", progress: 62, status: "progress" },
                  { text: "Close Tessera token migration for iOS + Android", progress: 85, status: "progress" },
                  { text: "Freeze SSO infra ahead of security audit", progress: 30, status: "blocked" },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-10" style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: g.status === "blocked" ? "var(--rose)" : "var(--accent)", flexShrink: 0 }} />
                    <span className="flex-1" style={{ fontSize: 12.5 }}>{g.text}</span>
                    <div style={{ width: 90, height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${g.progress}%`, height: "100%", background: g.status === "blocked" ? "var(--rose)" : "var(--accent)" }} />
                    </div>
                    <span className="mono muted-2" style={{ fontSize: 11, width: 34, textAlign: "right" }}>{g.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scope list */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="flex items-center gap-8" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              <strong style={{ fontSize: 13 }}>Scope</strong>
              <span className="mono muted-2" style={{ fontSize: 11 }}>{sprintIssues.length} issues · 34 pts</span>
              <div style={{ flex: 1 }} />
              <button className="btn ghost sm" onClick={() => window.openFilter("iteration")}><Icon name="filter" size={13} /> Filter</button>
              <button className="btn ghost sm" onClick={() => window.openNewIssue({ sprint: "Iter 42" })}><Icon name="plus" size={13} /> Add from backlog</button>
            </div>
            <div>
              {sprintIssues.map((is) => {
                const proj = PROJECTS.find(p => p.id === is.project);
                const assignees = is.assignees.map(id => PEOPLE.find(p => p.id === id));
                const klass = is.status === "backlog" ? "todo" : is.status;
                return (
                  <button key={is.id} className="row" style={{ width: "100%", textAlign: "left" }}
                    onClick={() => { setIssueId(is.id); setView("issue"); }}>
                    <PriorityGlyph level={is.priority} />
                    <span className="mono muted-2" style={{ fontSize: 11, width: 70, flexShrink: 0 }}>{is.id}</span>
                    <span className={`status ${klass}`}><span className="s-dot" /></span>
                    <span className="flex-1 truncate">{is.title}</span>
                    <span className="chip" style={{ color: proj.color }}>
                      <span className="d" style={{ background: proj.color }} /> {proj.code}
                    </span>
                    <span className="mono muted-2" style={{ fontSize: 11, width: 30, textAlign: "right" }}>{is.estimate}</span>
                    <AvatarStack users={assignees} size="xs" />
                    <span className="muted-2 mono" style={{ fontSize: 11, width: 50, textAlign: "right" }}>{is.due || "—"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other iterations */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
            {SPRINTS.map(s => (
              <div key={s.id} className="card" style={{ padding: 12, opacity: s.active ? 1 : 0.85 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <strong style={{ fontSize: 12 }}>{s.name}</strong>
                  {s.active && <span className="chip" style={{ color: "var(--accent)" }}><span className="d" style={{ background: "var(--accent)" }} /> active</span>}
                </div>
                <div className="mono muted-2" style={{ fontSize: 10.5, marginBottom: 10 }}>{s.range}</div>
                <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: `${(s.done / s.scope) * 100}%`, height: "100%", background: s.active ? "var(--accent)" : "var(--fg-3)" }} />
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: 11 }}>
                  <span className="mono">{s.done}/{s.scope}</span>
                  <span className="muted-2 mono">v{s.velocity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==== PULL REQUESTS ====
const PRsView = () => {
  const [filter, setFilter] = React.useState("all");
  const [prs, setPrs] = React.useState(PRS);

  React.useEffect(() => {
    const load = () => window.apiFetch('GET', '/api/prs').then(setPrs).catch(() => setPrs([...PRS]));
    load();
    document.addEventListener('meridian:refresh', load);
    return () => document.removeEventListener('meridian:refresh', load);
  }, []);

  const list = prs.filter(pr => filter === "all" || pr.status === filter);
  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      <div className="page-header">
        <div className="page-title">
          <Icon name="pr" size={15} />
          <span>Pull requests</span>
          <span className="chip mono">{prs.length}</span>
        </div>
        <div className="topbar-spacer" />
        <div className="segmented">
          {[
            { id: "all", label: "All" },
            { id: "open", label: "Open" },
            { id: "review", label: "In review" },
            { id: "draft", label: "Drafts" },
            { id: "merged", label: "Merged" },
          ].map(t => (
            <button key={t.id} className={filter === t.id ? "on" : ""} onClick={() => setFilter(t.id)}>{t.label}</button>
          ))}
        </div>
        <button className="btn ghost sm" onClick={() => window.openFilter("pull requests")}><Icon name="filter" size={13} /> Filter</button>
        <button className="btn ghost sm" onClick={() => window.openAI("What's the status of open pull requests?")}><Icon name="sparkle" size={13} /> AI Summary</button>
        <button className="btn sm primary" onClick={() => window.openNewPR()}><Icon name="plus" size={13} /> New PR</button>
      </div>

      <div className="scroll-y" style={{ flex: 1 }}>
        {list.map((pr, i) => {
          const author = PEOPLE.find(p => p.id === pr.author);
          const reviewers = pr.reviewers.map(id => PEOPLE.find(p => p.id === id));
          const statusColor = { open: "var(--accent)", review: "var(--violet)", draft: "var(--fg-3)", merged: "var(--violet)" }[pr.status];
          return (
            <button key={pr.id} onClick={() => window.openPR(pr)} style={{ padding: "14px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "flex-start", gap: 12, width: "100%", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer" }}>
              <Icon name="pr" size={18} style={{ color: statusColor, marginTop: 1 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-8" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{pr.title}</span>
                  <span className="chip" style={{ color: statusColor, textTransform: "capitalize" }}>{pr.status}</span>
                  {pr.issue && <span className="chip mono">{pr.issue}</span>}
                </div>
                <div className="flex items-center gap-10 muted" style={{ fontSize: 11.5, flexWrap: "wrap" }}>
                  <span className="mono">{pr.id}</span>
                  <span>opened by <strong className="mono" style={{ color: "var(--fg-1)" }}>@{author.handle}</strong></span>
                  <span className="flex items-center gap-4"><Icon name="branch" size={11} /><span className="mono">{pr.branch}</span> → <span className="mono">{pr.base}</span></span>
                  <span>· updated {pr.updated}</span>
                </div>
              </div>
              {/* Checks */}
              <div className="flex items-center gap-6" style={{ fontSize: 11, flexShrink: 0 }}>
                {pr.checks.passed > 0 && <span className="flex items-center gap-2 mono" style={{ color: "var(--status-done)" }}><Icon name="check" size={11} strokeWidth={2.5} />{pr.checks.passed}</span>}
                {pr.checks.failed > 0 && <span className="flex items-center gap-2 mono" style={{ color: "var(--rose)" }}><Icon name="x" size={11} strokeWidth={2.5} />{pr.checks.failed}</span>}
                {pr.checks.running > 0 && <span className="flex items-center gap-2 mono" style={{ color: "var(--amber)" }}><Icon name="clock" size={11} />{pr.checks.running}</span>}
              </div>
              <div className="flex items-center gap-2 mono" style={{ fontSize: 11, flexShrink: 0, minWidth: 90, justifyContent: "flex-end" }}>
                <span style={{ color: "var(--status-done)" }}>+{pr.additions}</span>
                <span style={{ color: "var(--rose)" }}>−{pr.deletions}</span>
              </div>
              <div style={{ flexShrink: 0, width: 60, display: "flex", justifyContent: "flex-end" }}>
                <AvatarStack users={reviewers} size="xs" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==== TEAM ====
const TeamView = () => {
  const teams = [
    { name: "Platform", members: ["u5","u7","u9"], color: "oklch(0.78 0.14 220)" },
    { name: "Design systems", members: ["u1","u4"], color: "oklch(0.72 0.17 300)" },
    { name: "Canvas", members: ["u2","u3","u6"], color: "oklch(0.80 0.16 145)" },
    { name: "Security", members: ["u8","u9"], color: "oklch(0.72 0.17 20)" },
  ];

  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      <div className="page-header">
        <div className="page-title"><span>Team</span><span className="mono muted-2" style={{ fontSize: 12 }}>· Helix workspace</span></div>
        <div className="topbar-spacer" />
        <div className="search" style={{ minWidth: 220 }}>
          <Icon name="search" size={12} />
          <input placeholder="Find a teammate…" />
        </div>
        <button className="btn ghost sm" onClick={() => window.openAI("Who has the highest workload this sprint?")}><Icon name="sparkle" size={13} /> AI Summary</button>
        <button className="btn sm primary" onClick={() => window.openInvite()}><Icon name="plus" size={13} /> Invite</button>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Teams */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {teams.map(t => (
              <div key={t.name} className="card" style={{ padding: 14 }}>
                <div className="flex items-center gap-8" style={{ marginBottom: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
                  <strong style={{ fontSize: 13 }}>{t.name}</strong>
                </div>
                <div className="flex items-center gap-8">
                  <AvatarStack users={t.members.map(id => PEOPLE.find(p => p.id === id))} size="sm" max={4} />
                  <span className="muted-2 mono" style={{ fontSize: 11 }}>{t.members.length} people</span>
                </div>
              </div>
            ))}
          </div>

          {/* Directory */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="flex items-center" style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
              <span style={{ width: 240 }}>Name</span>
              <span style={{ flex: 1 }}>Role</span>
              <span style={{ width: 140 }}>Team</span>
              <span style={{ width: 90, textAlign: "right" }}>Open</span>
              <span style={{ width: 110, textAlign: "right" }}>Reviewing</span>
              <span style={{ width: 80, textAlign: "right" }}>Load</span>
            </div>
            {PEOPLE.map((u, i) => {
              const load = [62, 81, 45, 73, 58, 34, 90, 66, 51][i];
              const team = teams.find(t => t.members.includes(u.id))?.name || "—";
              const roles = ["Staff Engineer", "Sr Engineer", "Engineer", "Design Eng", "PM", "Design Lead", "SRE", "Security Eng", "Engineer"];
              const open = [5, 8, 3, 6, 4, 2, 9, 7, 4][i];
              const reviewing = [2, 4, 1, 3, 2, 1, 5, 3, 2][i];
              return (
                <button key={u.id} className="row" style={{ padding: "0 16px", width: "100%", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer" }} onClick={() => window.openTeammate(u)}>
                  <span className="flex items-center gap-10" style={{ width: 240, flexShrink: 0 }}>
                    <Avatar user={u} size="sm" />
                    <span style={{ fontSize: 12.5 }}>{u.name}</span>
                    <span className="mono muted-2" style={{ fontSize: 10.5 }}>@{u.handle}</span>
                  </span>
                  <span style={{ flex: 1, fontSize: 12 }} className="muted">{roles[i]}</span>
                  <span style={{ width: 140, fontSize: 11.5 }}>{team}</span>
                  <span style={{ width: 90, textAlign: "right" }} className="mono">{open}</span>
                  <span style={{ width: 110, textAlign: "right" }} className="mono">{reviewing}</span>
                  <span style={{ width: 80, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 40, height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${load}%`, height: "100%", background: load > 80 ? "var(--rose)" : load > 60 ? "var(--amber)" : "var(--accent)" }} />
                    </div>
                    <span className="mono muted-2" style={{ fontSize: 10.5, width: 22 }}>{load}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==== INBOX (full page) ====
const InboxView = () => {
  const [selected, setSelected] = React.useState(0);
  const n = INBOX[selected];
  const user = PEOPLE.find(p => p.id === n.from);

  return (
    <div className="flex flex-1" style={{ minWidth: 0 }}>
      <aside style={{ width: 400, flexShrink: 0, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div className="flex items-center gap-8" style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: 13 }}>Inbox</strong>
          <span className="chip mono">{INBOX.filter(n => n.unread).length}</span>
          <div style={{ flex: 1 }} />
          <div className="segmented">
            <button className="on">All</button>
            <button onClick={() => window.toast("Mentions only")}>Mentions</button>
            <button onClick={() => window.toast("Assigned only")}>Assigned</button>
          </div>
        </div>
        <div className="scroll-y" style={{ flex: 1 }}>
          {INBOX.map((n, i) => {
            const u = PEOPLE.find(p => p.id === n.from);
            return (
              <button key={n.id} onClick={() => setSelected(i)} style={{
                width: "100%", padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)",
                textAlign: "left", display: "flex", gap: 10, alignItems: "flex-start",
                background: selected === i ? "var(--bg-2)" : "transparent",
                borderLeft: selected === i ? "2px solid var(--accent)" : "2px solid transparent",
              }}>
                {n.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 6 }} />}
                {!n.unread && <span style={{ width: 6, flexShrink: 0 }} />}
                {u ? <Avatar user={u} size="sm" /> : <span className="avatar sm" style={{ background: "var(--bg-3)" }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, lineHeight: 1.35 }}>
                    {u && <strong>{u.name.split(" ")[0]} </strong>}
                    <span className="muted">{n.text} </span>
                    <span className="mono" style={{ color: "var(--accent)" }}>{n.target}</span>
                  </div>
                  <div className="truncate muted" style={{ fontSize: 11.5, marginTop: 2 }}>{n.snippet}</div>
                </div>
                <span className="mono muted-2" style={{ fontSize: 10.5, flexShrink: 0 }}>{n.time}</span>
              </button>
            );
          })}
        </div>
      </aside>
      <div className="flex col flex-1" style={{ minWidth: 0 }}>
        <div className="page-header">
          <div className="page-title">
            <span className="mono muted-2" style={{ fontSize: 11 }}>{n.target}</span>
            <span>{n.snippet}</span>
          </div>
          <div className="topbar-spacer" />
          <button className="btn ghost sm" onClick={() => window.toast("Marked done")}><Icon name="check" size={13} /> Mark done</button>
          <button className="btn ghost sm" onClick={() => window.toast("Snoozed 3h")}>Snooze</button>
          <button className="btn sm" onClick={() => window.toast(`Opening ${n.target}`)}><Icon name="arrow-right" size={13} /> Open</button>
        </div>
        <div className="scroll-y" style={{ flex: 1, padding: "32px 48px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div className="flex items-center gap-10" style={{ marginBottom: 20 }}>
              {user ? <Avatar user={user} size="lg" /> : <span className="avatar lg" style={{ background: "var(--bg-3)" }} />}
              <div>
                <div style={{ fontSize: 14 }}>{user && <strong>{user.name}</strong>} <span className="muted">{n.text}</span> <span className="mono" style={{ color: "var(--accent)" }}>{n.target}</span></div>
                <div className="muted-2 mono" style={{ fontSize: 11 }}>{n.time} ago</div>
              </div>
            </div>
            <div style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-1)", fontSize: 14, lineHeight: 1.6 }}>
              {n.snippet}
            </div>
            <div className="flex items-center gap-8" style={{ marginTop: 16 }}>
              <input id="inboxreply" placeholder="Reply…" style={{ flex: 1, padding: "8px 12px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 8, outline: "none" }} />
              <button className="btn primary sm" onClick={() => {
                const el = document.getElementById("inboxreply");
                if (!el || !el.value.trim()) { window.toast("Type a reply"); return; }
                window.toast("Reply sent"); el.value = "";
              }}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { SprintsView, PRsView, TeamView, InboxView });
