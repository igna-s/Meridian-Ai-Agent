// Rich detail modals — real content, not empty toasts.
// Each export is a component that renders inside ModalShell.

const WeekModal = ({ onClose }) => {
  const days = [
    { day: "Mon", date: "Apr 20", items: [
      { time: "09:30", title: "Aurora canvas perf sync", kind: "meeting", people: ["u1","u2","u3"] },
      { time: "11:00", title: "AUR-412 due", kind: "due", priority: "urgent" },
      { time: "14:00", title: "1:1 with Rohan", kind: "meeting", people: ["u1","u2"] },
    ]},
    { day: "Tue", date: "Apr 21", items: [
      { time: "10:00", title: "Iteration 42 mid-point review", kind: "meeting", people: ["u1","u2","u5","u7"] },
      { time: "16:30", title: "Tessera token migration demo", kind: "demo" },
    ]},
    { day: "Wed", date: "Apr 22", items: [
      { time: "09:00", title: "Design systems working group", kind: "meeting", people: ["u1","u4"] },
      { time: "15:00", title: "TSR-88 due", kind: "due", priority: "high" },
    ]},
    { day: "Thu", date: "Apr 23", items: [
      { time: "all day", title: "Focus day — no meetings", kind: "focus" },
    ]},
    { day: "Fri", date: "Apr 24", items: [
      { time: "10:30", title: "Sprint retro Iter 42", kind: "meeting", people: ["u1","u2","u5","u7","u9"] },
      { time: "14:00", title: "Release cut", kind: "milestone" },
    ]},
  ];
  const kindColor = { meeting: "var(--violet)", due: "var(--rose)", demo: "var(--amber)", focus: "var(--accent)", milestone: "var(--cyan)" };
  return (
    <ModalShell title="This week" subtitle="Apr 20 – Apr 26 · 7 meetings · 2 due dates" onClose={onClose} width={620}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {days.map((d, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < days.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
            <div className="flex items-center gap-10" style={{ marginBottom: 6 }}>
              <div style={{ width: 56 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{d.day}</div>
                <div className="mono" style={{ fontSize: 13, color: i === 0 ? "var(--accent)" : "var(--fg-1)" }}>{d.date}</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                {d.items.map((it, j) => (
                  <div key={j} className="flex items-center gap-10" style={{ fontSize: 12.5, padding: "4px 0" }}>
                    <span className="mono muted-2" style={{ fontSize: 11, width: 52 }}>{it.time}</span>
                    <span style={{ width: 4, height: 14, background: kindColor[it.kind], borderRadius: 2 }} />
                    <span style={{ flex: 1 }}>{it.title}</span>
                    {it.people && <AvatarStack users={it.people.map(id => PEOPLE.find(p => p.id === id))} size="xs" />}
                    {it.priority && <span className="tag" style={{ color: "var(--rose)" }}>{it.priority}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

const DigestModal = ({ onClose }) => (
  <ModalShell title="Daily digest" subtitle="Monday · 20 April 2026 · auto-generated 07:30" onClose={onClose} width={620}
    footer={<>
      <button className="btn ghost sm" onClick={onClose}>Close</button>
      <button className="btn sm" onClick={() => { window.toast("Digest sent to #team-platform"); onClose(); }}><Icon name="sparkle" size={12} /> Send to Slack</button>
    </>}>
    <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--fg-1)" }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>At a glance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <div className="card" style={{ padding: 10 }}>
            <div className="muted" style={{ fontSize: 11 }}>Iteration progress</div>
            <div className="mono" style={{ fontSize: 18, marginTop: 2 }}>12<span className="muted-2" style={{ fontSize: 11 }}>/34 pts</span></div>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <div className="muted" style={{ fontSize: 11 }}>Your review queue</div>
            <div className="mono" style={{ fontSize: 18, marginTop: 2, color: "var(--amber)" }}>3 <span className="muted-2" style={{ fontSize: 11 }}>PRs waiting</span></div>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <div className="muted" style={{ fontSize: 11 }}>Blocked</div>
            <div className="mono" style={{ fontSize: 18, marginTop: 2, color: "var(--rose)" }}>1 <span className="muted-2" style={{ fontSize: 11 }}>SSO audit</span></div>
          </div>
        </div>
      </div>

      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>What changed overnight</div>
      <ul style={{ paddingLeft: 18, marginBottom: 18 }}>
        <li>Kenji pushed 4 commits to <span className="mono">perf/canvas-pipeline</span>; checks green.</li>
        <li>Priya closed <span className="mono">TSR-88</span> (token migration — Android).</li>
        <li>Security audit freeze pushed to Apr 29 — unblocks <span className="mono">SEC-12</span>.</li>
        <li>Sara asked for your review on <span className="mono">#2341</span> 12m ago.</li>
      </ul>

      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Suggested focus today</div>
      <ol style={{ paddingLeft: 18 }}>
        <li>Review <span className="mono">#2341</span> — on Iteration 42 critical path.</li>
        <li>Decide tile-size heuristic (Kenji's question on AUR-412).</li>
        <li>30m to unblock SSO audit freeze before standup.</li>
      </ol>
    </div>
  </ModalShell>
);

const FilterModal = ({ scope, onClose }) => {
  const [status, setStatus] = React.useState(new Set());
  const [priority, setPriority] = React.useState(new Set());
  const [assignee, setAssignee] = React.useState(new Set());
  const [labelSet, setLabelSet] = React.useState(new Set());
  const toggle = (setFn, v) => setFn(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n; });
  const count = status.size + priority.size + assignee.size + labelSet.size;

  const Chip = ({ on, onClick, children, color }) => (
    <button onClick={onClick} className="chip" style={{
      background: on ? "var(--accent-soft)" : "transparent",
      borderColor: on ? "var(--accent-dim)" : "var(--border)",
      color: on ? "var(--fg-0)" : (color || "var(--fg-1)"),
      cursor: "pointer"
    }}>{on && <Icon name="check" size={10} strokeWidth={2.5} />} {children}</button>
  );

  return (
    <ModalShell title={`Filter ${scope || "issues"}`} subtitle={`${count} filter${count === 1 ? "" : "s"} active`} onClose={onClose} width={520}
      footer={<>
        <button className="btn ghost sm" onClick={() => { setStatus(new Set()); setPriority(new Set()); setAssignee(new Set()); setLabelSet(new Set()); }}>Clear</button>
        <button className="btn sm primary" onClick={() => { window.toast(count ? `${count} filters applied` : "No filters"); onClose(); }}>Apply</button>
      </>}>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Status</div>
      <div className="flex items-center gap-6" style={{ flexWrap: "wrap", marginBottom: 14 }}>
        {["backlog","todo","progress","review","done"].map(s => (
          <Chip key={s} on={status.has(s)} onClick={() => toggle(setStatus, s)}>{s}</Chip>
        ))}
      </div>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Priority</div>
      <div className="flex items-center gap-6" style={{ flexWrap: "wrap", marginBottom: 14 }}>
        {["urgent","high","medium","low"].map(p => (
          <Chip key={p} on={priority.has(p)} onClick={() => toggle(setPriority, p)}>{p}</Chip>
        ))}
      </div>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Assignee</div>
      <div className="flex items-center gap-6" style={{ flexWrap: "wrap", marginBottom: 14 }}>
        {PEOPLE.slice(0, 6).map(u => (
          <button key={u.id} onClick={() => toggle(setAssignee, u.id)} className="chip" style={{
            background: assignee.has(u.id) ? "var(--accent-soft)" : "transparent",
            borderColor: assignee.has(u.id) ? "var(--accent-dim)" : "var(--border)",
            cursor: "pointer", gap: 6
          }}>
            <Avatar user={u} size="xs" /> {u.name.split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Labels</div>
      <div className="flex items-center gap-6" style={{ flexWrap: "wrap" }}>
        {LABELS.slice(0, 8).map(l => (
          <Chip key={l.id} on={labelSet.has(l.id)} onClick={() => toggle(setLabelSet, l.id)} color={l.color}>#{l.name}</Chip>
        ))}
      </div>
    </ModalShell>
  );
};

const PRDetailModal = ({ pr, onClose }) => {
  const author = PEOPLE.find(p => p.id === pr.author);
  const reviewers = pr.reviewers.map(id => PEOPLE.find(p => p.id === id));
  const files = [
    { path: "src/renderer/tile.ts", add: 142, del: 18 },
    { path: "src/renderer/composite.ts", add: 88, del: 34 },
    { path: "src/hit-test/rtree.ts", add: 214, del: 0 },
    { path: "test/renderer.bench.ts", add: 96, del: 12 },
  ];
  const commits = [
    { sha: "a3f21e", msg: "refactor: extract tile from renderer", by: author, time: "6h" },
    { sha: "b7c044", msg: "perf: adaptive tile sizing (256/128 split)", by: author, time: "4h" },
    { sha: "e9d881", msg: "test: scene benchmarks at 1k/5k/10k", by: author, time: "2h" },
  ];
  return (
    <ModalShell title={pr.title} subtitle={`${pr.id} · ${pr.branch} → ${pr.base}`} onClose={onClose} width={720}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Close</button>
        <button className="btn ghost sm" onClick={() => { window.toast("Requested changes"); onClose(); }}>Request changes</button>
        <button className="btn sm primary" onClick={() => { window.toast(`Approved ${pr.id}`); onClose(); }}><Icon name="check" size={12} /> Approve</button>
      </>}>
      <div className="flex items-center gap-10" style={{ marginBottom: 14 }}>
        <Avatar user={author} size="sm" />
        <div>
          <div style={{ fontSize: 13 }}><strong>{author.name}</strong> <span className="muted">opened this PR · {pr.updated}</span></div>
          <div className="muted-2 mono" style={{ fontSize: 11 }}>@{author.handle} · {pr.base}</div>
        </div>
        <div style={{ flex: 1 }} />
        <span className="chip" style={{ color: "var(--accent)", textTransform: "capitalize" }}>{pr.status}</span>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 14 }}>
        <div className="flex items-center gap-10" style={{ fontSize: 12 }}>
          <div>
            <div className="muted-2 mono" style={{ fontSize: 10 }}>CHECKS</div>
            <div className="flex items-center gap-6 mono" style={{ marginTop: 2 }}>
              {pr.checks.passed > 0 && <span style={{ color: "var(--status-done)" }}><Icon name="check" size={11} /> {pr.checks.passed}</span>}
              {pr.checks.failed > 0 && <span style={{ color: "var(--rose)" }}><Icon name="x" size={11} /> {pr.checks.failed}</span>}
              {pr.checks.running > 0 && <span style={{ color: "var(--amber)" }}><Icon name="clock" size={11} /> {pr.checks.running}</span>}
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: "var(--border)" }} />
          <div>
            <div className="muted-2 mono" style={{ fontSize: 10 }}>DIFF</div>
            <div className="mono" style={{ marginTop: 2 }}><span style={{ color: "var(--status-done)" }}>+{pr.additions}</span> <span style={{ color: "var(--rose)" }}>−{pr.deletions}</span></div>
          </div>
          <div style={{ width: 1, height: 30, background: "var(--border)" }} />
          <div>
            <div className="muted-2 mono" style={{ fontSize: 10 }}>REVIEWERS</div>
            <div style={{ marginTop: 2 }}><AvatarStack users={reviewers} size="xs" /></div>
          </div>
          {pr.issue && <>
            <div style={{ width: 1, height: 30, background: "var(--border)" }} />
            <div>
              <div className="muted-2 mono" style={{ fontSize: 10 }}>LINKED</div>
              <div className="mono" style={{ marginTop: 2 }}>{pr.issue}</div>
            </div>
          </>}
        </div>
      </div>

      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Files changed</div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-10" style={{ padding: "8px 12px", borderBottom: i < files.length - 1 ? "1px solid var(--border-subtle)" : "none", fontSize: 12 }}>
            <Icon name="hash" size={11} style={{ color: "var(--fg-3)" }} />
            <span className="mono flex-1 truncate">{f.path}</span>
            <span className="mono" style={{ color: "var(--status-done)" }}>+{f.add}</span>
            <span className="mono" style={{ color: "var(--rose)" }}>−{f.del}</span>
          </div>
        ))}
      </div>

      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Commits</div>
      <div>
        {commits.map((c, i) => (
          <div key={i} className="flex items-center gap-10" style={{ padding: "6px 0", borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none", fontSize: 12 }}>
            <Avatar user={c.by} size="xs" />
            <span className="mono muted-2" style={{ fontSize: 10.5, width: 56 }}>{c.sha}</span>
            <span className="flex-1">{c.msg}</span>
            <span className="muted-2 mono" style={{ fontSize: 11 }}>{c.time} ago</span>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

const ProjectDetailModal = ({ project, onClose }) => {
  const issues = ISSUES.filter(i => i.project === project.id);
  const roadmap = ROADMAP.filter(r => r.project === project.id);
  const byStatus = { backlog: 0, todo: 0, progress: 0, review: 0, done: 0 };
  issues.forEach(i => { byStatus[i.status] = (byStatus[i.status] || 0) + 1; });
  const team = [...new Set(issues.flatMap(i => i.assignees))].map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);
  const total = issues.length || 1;

  return (
    <ModalShell
      title={<span className="flex items-center gap-8"><span style={{ width: 10, height: 10, borderRadius: 3, background: project.color }} />{project.name}</span>}
      subtitle={`${project.code} · ${issues.length} issues · ${team.length} contributors`}
      onClose={onClose} width={680}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Close</button>
        <button className="btn sm primary" onClick={() => { onClose(); window.__goIssues && window.__goIssues(); }}>Open project →</button>
      </>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div className="card" style={{ padding: 12 }}>
          <div className="muted mono" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Issue breakdown</div>
          <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: "var(--bg-3)", marginBottom: 8 }}>
            <div style={{ flex: byStatus.done, background: "var(--status-done)" }} />
            <div style={{ flex: byStatus.review, background: "var(--status-review)" }} />
            <div style={{ flex: byStatus.progress, background: "var(--status-progress)" }} />
            <div style={{ flex: byStatus.todo + byStatus.backlog, background: "var(--fg-3)" }} />
          </div>
          {[
            { k: "done", l: "Done", c: "var(--status-done)" },
            { k: "review", l: "In review", c: "var(--status-review)" },
            { k: "progress", l: "In progress", c: "var(--status-progress)" },
            { k: "todo", l: "Todo", c: "var(--fg-3)" },
          ].map(r => (
            <div key={r.k} className="flex items-center gap-6" style={{ fontSize: 11.5, padding: "2px 0" }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: r.c }} />
              <span style={{ flex: 1 }}>{r.l}</span>
              <span className="mono muted-2">{byStatus[r.k]} · {Math.round((byStatus[r.k] / total) * 100)}%</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 12 }}>
          <div className="muted mono" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Contributors</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {team.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-8" style={{ fontSize: 12 }}>
                <Avatar user={u} size="xs" />
                <span>{u.name}</span>
                <span className="mono muted-2" style={{ marginLeft: "auto", fontSize: 11 }}>{issues.filter(i => i.assignees.includes(u.id)).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {roadmap.length > 0 && <>
        <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Roadmap</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          {roadmap.map(r => (
            <div key={r.id} className="flex items-center gap-8" style={{ fontSize: 12.5, padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <Icon name="bolt" size={11} style={{ color: project.color }} />
              <span style={{ flex: 1 }}>{r.title}</span>
              <div style={{ width: 60, height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${r.progress}%`, height: "100%", background: project.color }} />
              </div>
              <span className="mono muted-2" style={{ fontSize: 11 }}>{r.progress}%</span>
            </div>
          ))}
        </div>
      </>}

      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Recent issues</div>
      <div>
        {issues.slice(0, 5).map(is => (
          <div key={is.id} className="flex items-center gap-8" style={{ padding: "6px 0", fontSize: 12, borderBottom: "1px solid var(--border-subtle)" }}>
            <PriorityGlyph level={is.priority} />
            <span className="mono muted-2" style={{ fontSize: 11, width: 64 }}>{is.id}</span>
            <span className="flex-1 truncate">{is.title}</span>
            <AvatarStack users={is.assignees.map(id => PEOPLE.find(p => p.id === id))} size="xs" />
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

const SprintReportModal = ({ onClose }) => (
  <ModalShell title="Iteration 42 — Report" subtitle="Apr 14 – Apr 28 · day 6 of 14" onClose={onClose} width={620}
    footer={<>
      <button className="btn ghost sm" onClick={onClose}>Close</button>
      <button className="btn sm" onClick={() => { window.toast("Report exported to PDF"); onClose(); }}><Icon name="download" size={12} /> Export PDF</button>
    </>}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
      {[
        { l: "Scope", v: "34 pts" },
        { l: "Completed", v: "12 pts", c: "var(--status-done)" },
        { l: "Remaining", v: "22 pts" },
        { l: "Confidence", v: "82%", c: "var(--status-done)" },
      ].map((s, i) => (
        <div key={i} className="card" style={{ padding: 10 }}>
          <div className="muted mono" style={{ fontSize: 10.5 }}>{s.l}</div>
          <div className="mono" style={{ fontSize: 18, color: s.c || "var(--fg-0)", marginTop: 2 }}>{s.v}</div>
        </div>
      ))}
    </div>
    <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Highlights</div>
    <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: "var(--fg-1)", marginBottom: 14 }}>
      <li>Canvas tile-based pipeline on track — p95 paint down from 18ms → 9ms.</li>
      <li>Token migration closed for iOS + Android (TSR-88).</li>
      <li>SSO audit blocked by Infra review — est. +3d slip.</li>
    </ul>
    <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Risks</div>
    <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: "var(--fg-1)" }}>
      <li><span style={{ color: "var(--rose)" }}>High</span> · SSO audit freeze — coordination with Security eng.</li>
      <li><span style={{ color: "var(--amber)" }}>Medium</span> · Plugin shim timing — needs decision by day 10.</li>
    </ul>
  </ModalShell>
);

const RetroModal = ({ onClose }) => (
  <ModalShell title="Retrospective draft" subtitle="Auto-generated by Meridian AI from Iteration 42 activity" onClose={onClose} width={620}
    footer={<>
      <button className="btn ghost sm" onClick={onClose}>Close</button>
      <button className="btn sm" onClick={() => { window.toast("Retro saved to Docs → Retros"); onClose(); }}>Save to docs</button>
    </>}>
    <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--fg-1)" }}>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>What went well</div>
      <ul style={{ paddingLeft: 18, marginBottom: 14 }}>
        <li>Tile-based pipeline PR landed with zero rework — good prior spec.</li>
        <li>Kenji + Sara's pairing on hit-test rtree halved original estimate.</li>
      </ul>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>What didn't</div>
      <ul style={{ paddingLeft: 18, marginBottom: 14 }}>
        <li>SSO audit blockers discovered day 4, not day 0 — slipped scope.</li>
        <li>Design review for token migration queued behind launch prep.</li>
      </ul>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Action items</div>
      <ul style={{ paddingLeft: 18 }}>
        <li>Add dependency mapping to kickoff template (owner: Amara).</li>
        <li>Reserve 2 design review slots per week (owner: Priya).</li>
      </ul>
    </div>
  </ModalShell>
);

const AIAnswerModal = ({ question, onClose }) => {
  const answers = {
    "Summarize Iteration 42 progress": {
      tldr: "On track — 12/34 pts done at day 6/14, 82% confidence to close by Apr 26.",
      body: [
        "Canvas rebuild (AUR-412) is the iteration's critical path and it's shipping under budget. Kenji's pairing with Sara compressed the hit-test rtree work from 8pts to 5pts.",
        "Token migration (TSR-88) closed yesterday. Design systems team now unblocked on cascading work.",
        "SSO infra freeze (SEC-12) is the one red flag — blocked waiting on Security eng review. Audit deadline is firm; consider escalating.",
      ],
      sources: ["AUR-412", "TSR-88", "SEC-12", "Iter 42 board"],
    },
    "What's blocking Aurora?": {
      tldr: "One live blocker: tile-size heuristic decision on AUR-412. Kenji is waiting on a call.",
      body: [
        "Kenji's question (12m ago): 'Are we going 256px tiles or adaptive? Worried about memory on large documents.'",
        "Sara's prototype in the branch uses adaptive — base 256, halves if point count > 2k. Working well in benchmarks (9ms p95 at 10k nodes).",
        "Recommend: approve adaptive approach, park the fixed-tile alternative for post-ship measurement.",
      ],
      sources: ["AUR-412", "#2341", "Kenji comment"],
    },
    "Draft release notes for last sprint": {
      tldr: "Iteration 41 shipped 3 user-facing changes + 2 infra improvements.",
      body: [
        "**Canvas performance** — multi-select drag is now smooth up to 10k nodes (was ~2k).",
        "**Tokens** — iOS and Android token libraries now regenerate nightly from the single source.",
        "**Infra** — CI perf budget guard (fails builds that regress p95 paint > 8ms).",
      ],
      sources: ["Iter 41 board", "#2298", "#2312"],
    },
    "What are the top blocking issues right now?": {
      tldr: "3 active blockers across Aurora and Tessera. SEC-12 is highest severity — audit deadline is firm.",
      body: [
        "**SEC-12** (Blocker) — SSO infra freeze pending Security eng review. Audit deadline Jun 1 is immovable. Escalation recommended today.",
        "**AUR-401** (High) — Canvas hit-test regression under 10k nodes. Kenji identified root cause; fix in review. ETA: tomorrow.",
        "**TSR-92** (Medium) — Tessera token sync failing on Windows CI. Intermittent; likely a path separator bug. Assigned to Priya.",
      ],
      sources: ["SEC-12", "AUR-401", "TSR-92", "Iter 42 board"],
    },
    "What's the status of open pull requests?": {
      tldr: "7 open PRs: 2 ready to merge, 3 in review, 2 drafts. Oldest is 4 days stale.",
      body: [
        "**Ready to merge**: #2341 (token sync fix) and #2338 (CI timeout bump) — both approved, checks green.",
        "**In review**: #2345 (canvas resize), #2347 (SSO middleware), #2349 (notifier service) — all awaiting 1 more approval.",
        "**Drafts**: #2350 (Tessera dark mode), #2352 (perf dashboard) — not ready for review.",
        "Recommend merging #2341 first — it unblocks Tessera iOS and Android nightly builds.",
      ],
      sources: ["#2341", "#2338", "#2345", "PR board"],
    },
    "Who has the highest workload this sprint?": {
      tldr: "Kenji is over-allocated at 18pts assigned vs 12pt sprint capacity. Sara and Priya are on track.",
      body: [
        "**Kenji** (18pts / 12pt cap) — carrying AUR-412 canvas rebuild solo since Diego moved to security audit. Recommend pulling TSR-92 off his plate.",
        "**Sara** (11pts) — on track. Leading design systems token migration; pairing with Kenji 2h/day this week.",
        "**Priya** (9pts) — slightly under-allocated. Available to absorb TSR-92 (3pts) if Kenji needs relief.",
        "**Diego** (8pts) — pulled into SEC-12 mid-sprint. His original 6pts of canvas work is now unassigned.",
      ],
      sources: ["Iter 42 board", "Team capacity", "AUR-412", "SEC-12"],
    },
    "What milestones are at risk this quarter?": {
      tldr: "Aurora launch (Jun 12) is amber. SSO audit (Jul 1) is red. Tessera 2.0 (Aug 22) is green.",
      body: [
        "**Aurora launch Jun 12** (Amber) — canvas rebuild on track, but SEC-12 SSO blocker creates a 5-day slip risk if not resolved by May 15. Mitigation: ship without SSO, add in hotfix.",
        "**SSO audit Jul 1** (Red) — Security eng review not started. Requires 3-week turnaround minimum. Must begin by Jun 9 to hit deadline. Escalate to VP Eng.",
        "**Tessera 2.0 Aug 22** (Green) — token migration complete, dark mode in progress. 6-week buffer remaining.",
      ],
      sources: ["Roadmap Q2–Q3", "SEC-12", "AUR-412", "TSR-88"],
    },
  };
  const a = answers[question] || { tldr: "Meridian AI is thinking…", body: [], sources: [] };
  return (
    <ModalShell
      title={<span className="flex items-center gap-8"><Icon name="sparkle" size={14} style={{ color: "var(--accent)" }} />{question}</span>}
      subtitle="Meridian AI · drawing from issues, PRs, and recent activity"
      onClose={onClose} width={600}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Close</button>
        <button className="btn sm" onClick={() => { window.toast("Answer copied"); onClose(); }}><Icon name="link" size={12} /> Copy answer</button>
      </>}>
      <div className="card" style={{ padding: 12, marginBottom: 14, borderColor: "var(--accent-dim)", background: "var(--accent-soft)" }}>
        <div className="mono muted-2" style={{ fontSize: 10.5, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>TL;DR</div>
        <div style={{ fontSize: 13.5 }}>{a.tldr}</div>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--fg-1)", marginBottom: 14 }}>
        {a.body.map((p, i) => <p key={i} style={{ marginBottom: 8 }}>{p}</p>)}
      </div>
      {a.sources.length > 0 && (
        <div>
          <div className="mono muted-2" style={{ fontSize: 10.5, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Sources</div>
          <div className="flex items-center gap-6" style={{ flexWrap: "wrap" }}>
            {a.sources.map((s, i) => <span key={i} className="chip mono">{s}</span>)}
          </div>
        </div>
      )}
    </ModalShell>
  );
};

const TeammateModal = ({ user, onClose }) => {
  const assigned = ISSUES.filter(i => i.assignees.includes(user.id));
  const authored = PRS.filter(p => p.author === user.id);
  return (
    <ModalShell
      title={<span className="flex items-center gap-10"><Avatar user={user} size="sm" />{user.name}</span>}
      subtitle={`@${user.handle} · Helix workspace`}
      onClose={onClose} width={560}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Close</button>
        <button className="btn sm" onClick={() => { window.toast(`Messaged ${user.name.split(" ")[0]}`); onClose(); }}><Icon name="message" size={12} /> Message</button>
      </>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
        <div className="card" style={{ padding: 10 }}>
          <div className="muted mono" style={{ fontSize: 10.5 }}>Open issues</div>
          <div className="mono" style={{ fontSize: 20, marginTop: 2 }}>{assigned.length}</div>
        </div>
        <div className="card" style={{ padding: 10 }}>
          <div className="muted mono" style={{ fontSize: 10.5 }}>PRs authored</div>
          <div className="mono" style={{ fontSize: 20, marginTop: 2 }}>{authored.length}</div>
        </div>
        <div className="card" style={{ padding: 10 }}>
          <div className="muted mono" style={{ fontSize: 10.5 }}>Timezone</div>
          <div className="mono" style={{ fontSize: 13, marginTop: 4 }}>Europe/Berlin</div>
        </div>
      </div>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Currently working on</div>
      {assigned.slice(0, 4).map(is => (
        <div key={is.id} className="flex items-center gap-8" style={{ padding: "6px 0", fontSize: 12, borderBottom: "1px solid var(--border-subtle)" }}>
          <PriorityGlyph level={is.priority} />
          <span className="mono muted-2" style={{ fontSize: 11, width: 64 }}>{is.id}</span>
          <span className="flex-1 truncate">{is.title}</span>
          <span className={`status ${is.status === "backlog" ? "todo" : is.status}`}><span className="s-dot" /></span>
        </div>
      ))}
    </ModalShell>
  );
};

const AttachModal = ({ onClose }) => {
  const [stage, setStage] = React.useState("picker");
  const files = [
    { name: "paint-trace-apr18.json", size: "842 KB", icon: "hash" },
    { name: "benchmark-10k.pdf", size: "1.2 MB", icon: "docs" },
    { name: "tile-size-sketch.png", size: "210 KB", icon: "image" },
  ];
  return (
    <ModalShell title="Attach" onClose={onClose} width={480}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
      </>}>
      <div className="card" style={{ padding: 18, textAlign: "center", border: "2px dashed var(--border-strong)", marginBottom: 14, cursor: "pointer" }}
        onClick={() => { window.toast("File picker opened (demo)"); }}>
        <Icon name="attach" size={22} style={{ color: "var(--fg-3)" }} />
        <div style={{ fontSize: 13, marginTop: 8, fontWeight: 500 }}>Drop files or click to browse</div>
        <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>Up to 100 MB per file</div>
      </div>
      <div className="mono muted-2" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Recent in this workspace</div>
      <div>
        {files.map((f, i) => (
          <button key={i} className="flex items-center gap-10" style={{ width: "100%", padding: "8px 6px", textAlign: "left", borderRadius: 6, borderBottom: i < files.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
            onClick={() => { window.toast(`Attached ${f.name}`); onClose(); }}>
            <Icon name={f.icon} size={14} style={{ color: "var(--fg-3)" }} />
            <span style={{ flex: 1, fontSize: 12.5 }}>{f.name}</span>
            <span className="muted-2 mono" style={{ fontSize: 11 }}>{f.size}</span>
          </button>
        ))}
      </div>
    </ModalShell>
  );
};

Object.assign(window, { WeekModal, DigestModal, FilterModal, PRDetailModal, ProjectDetailModal, SprintReportModal, RetroModal, AIAnswerModal, TeammateModal, AttachModal });
