// Shell: sidebar + topbar + inbox panel + command palette

const Sidebar = ({ view, setView, collapsed }) => {
  const nav = [
    { id: "home",     label: "Home",       icon: "home" },
    { id: "inbox",    label: "Inbox",      icon: "inbox", badge: 4 },
    { id: "issues",   label: "Issues",     icon: "issues" },
    { id: "sprints",  label: "Sprints",    icon: "sprint" },
    { id: "roadmap",  label: "Roadmap",    icon: "roadmap" },
    { id: "docs",     label: "Docs",       icon: "docs" },
    { id: "chat",     label: "VaultMind AI", icon: "sparkle" },
    { id: "code",     label: "Code Editor",  icon: "code" },
    { id: "compute",  label: "Compute",      icon: "sprint" },
    { id: "aimarket", label: "AI Infrastructure", icon: "bolt" },
    { id: "prs",      label: "Pull requests", icon: "pr" },
    { id: "team",     label: "Team",       icon: "team" },
    { id: "settings", label: "Settings",   icon: "settings" },
  ];

  return (
    <nav className="sidebar">
      <div className="sb-brand">
        <span className="sb-logo" aria-hidden />
        <div style={{ lineHeight: 1.15 }}>
          <div className="name">Meridian</div>
          <div className="ws mono">helix · enterprise</div>
        </div>
        <span style={{ marginLeft: "auto" }} className="mono muted-2" title="workspace shortcut">⌘</span>
      </div>

      <div className="sb-section">
        {nav.map(n => (
          <button key={n.id} className={`sb-item ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
            <span className="sb-ind" />
            <Icon name={n.icon} className="sb-icon" />
            <span>{n.label}</span>
            {n.badge && <span className="sb-badge">{n.badge}</span>}
          </button>
        ))}
      </div>

      <div className="sb-section">
        <div className="sb-label"><span>Projects</span><span className="count">{PROJECTS.length}</span></div>
        {PROJECTS.map(p => (
          <button key={p.id} className="sb-proj" onClick={() => window.openProject(p)}>
            <span className="dot" style={{ background: p.color }} />
            <span className="truncate">{p.name}</span>
            <span className="sb-badge mono">{p.code}</span>
          </button>
        ))}
      </div>

      <div className="sb-section">
        <div className="sb-label"><span>Views</span><Icon name="plus" size={12} /></div>
        {[
          { id: "assigned", label: "Assigned to me", count: 7 },
          { id: "review",   label: "Needs review", count: 3 },
          { id: "urgent",   label: "Urgent", count: 2 },
          { id: "recent",   label: "Recently updated", count: 12 },
        ].map(v => (
          <button key={v.id} className="sb-proj" onClick={() => { setView("issues"); window.openFilter(v.label); }}>
            <Icon name="filter" size={14} style={{ color: "var(--fg-3)" }} />
            <span className="truncate">{v.label}</span>
            <span className="sb-badge mono">{v.count}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <div className="sb-foot">
        <Avatar user={PEOPLE[0]} size="sm" />
        <div className="who" style={{ lineHeight: 1.2, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500 }}>{PEOPLE[0].name}</div>
          <div className="mono muted-2" style={{ fontSize: 10.5 }}>online · EU</div>
        </div>
        <button className="icon-btn" title="Account menu" onClick={() => window.openTeammate(PEOPLE[0])}><Icon name="more" size={14} /></button>
      </div>
    </nav>
  );
};

const Topbar = ({ view, onToggleSidebar, onOpenPalette, onOpenInbox, onOpenTweaks, theme, setTheme }) => {
  const crumb = {
    home: ["Home"],
    inbox: ["Inbox", "All activity"],
    issues: ["Projects", "Aurora", "Issues"],
    sprints: ["Sprints", "Iteration 42"],
    roadmap: ["Roadmap", "Q2 — Q3 2026"],
    docs: ["Docs", "Engineering handbook", "ADR 041 — Canvas rendering pipeline"],
    prs: ["Code", "Pull requests"],
    team: ["Team", "Members"],
    issue: ["Projects", "Aurora", "AUR-412"],
    chat: ["VaultMind AI", "Chat"],
    compute:  ["Compute", "GPU Instances"],
    aimarket: ["AI Infrastructure", "Studios & Models"],
    settings: ["Settings", "Workspace"],
  }[view] || ["Home"];

  return (
    <header className="topbar">
      <button className="icon-btn" onClick={onToggleSidebar} title="Toggle sidebar"><Icon name="sidebar" size={16} /></button>
      <div className="breadcrumbs">
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumb.length - 1 ? "current" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-spacer" />
      <button className="search" onClick={onOpenPalette} style={{ cursor: "pointer" }}>
        <Icon name="search" size={13} />
        <span style={{ flex: 1, textAlign: "left", color: "var(--fg-3)" }}>Search, jump to, or ask…</span>
        <span className="kbd-hint mono">⌘K</span>
      </button>
      <div className="topbar-actions">
        <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
          <Icon name={theme === "dark" ? "sun" : "moon"} size={15} />
        </button>
        <button className="icon-btn" title="Notifications" onClick={onOpenInbox}>
          <Icon name="bell" size={15} /><span className="dot" />
        </button>
        <button className="btn sm" onClick={() => window.openPicker({
          title: "Create",
          options: [
            { value: "issue", label: "New issue", icon: "issues", hint: "C" },
            { value: "doc", label: "New document", icon: "docs", hint: "⌘⇧D" },
            { value: "pr", label: "Open pull request", icon: "pr" },
            { value: "invite", label: "Invite teammate", icon: "team" },
          ],
          onChoose: (o) => {
            if (o.value === "issue") window.openNewIssue();
            else if (o.value === "doc") window.openNewDoc();
            else if (o.value === "pr") window.openNewPR();
            else if (o.value === "invite") window.openInvite();
          },
        })}>
          <Icon name="plus" size={13} /> New
        </button>
      </div>
    </header>
  );
};

// ---- Command palette ----
const PALETTE_ITEMS = [
  { group: "Jump to", items: [
    { id: "p-home", label: "Home", icon: "home", kbd: "G H", action: (setView) => setView("home") },
    { id: "p-inbox", label: "Inbox", icon: "inbox", kbd: "G I", action: (setView) => setView("inbox") },
    { id: "p-issues", label: "Issues", icon: "issues", kbd: "G S", action: (setView) => setView("issues") },
    { id: "p-docs", label: "Docs", icon: "docs", kbd: "G D", action: (setView) => setView("docs") },
    { id: "p-roadmap", label: "Roadmap", icon: "roadmap", kbd: "G R", action: (setView) => setView("roadmap") },
    { id: "p-prs", label: "Pull requests", icon: "pr", kbd: "G P", action: (setView) => setView("prs") },
    { id: "p-sprints", label: "Sprints", icon: "sprint", action: (setView) => setView("sprints") },
  ]},
  { group: "Create", items: [
    { id: "c-issue", label: "Create new issue…", icon: "plus", kbd: "C", action: () => window.openNewIssue() },
    { id: "c-doc", label: "Create new document…", icon: "doc-add", kbd: "⌘⇧D", action: () => window.openNewDoc() },
    { id: "c-pr", label: "Open pull request…", icon: "pr", action: () => window.openNewPR() },
  ]},
  { group: "Recent", items: [
    { id: "r-1", label: "AUR-412 — Rebuild canvas-rendering pipeline", icon: "issues", action: (setView) => setView("issue") },
    { id: "r-2", label: "Aurora collaborative canvas PRD", icon: "docs", action: (setView) => setView("docs") },
    { id: "r-3", label: "#2341 perf(canvas): tile-based rendering", icon: "pr", action: (setView) => setView("prs") },
    { id: "r-4", label: "Iteration 42 — Apr 14 – Apr 28", icon: "sprint", action: (setView) => setView("sprints") },
  ]},
  { group: "Ask Meridian AI", items: [
    { id: "ai-1", label: "Summarize Iteration 42 progress", icon: "sparkle", action: (setView) => { window.chatInitialQuery = "Summarize Iteration 42 progress"; setView("chat"); } },
    { id: "ai-2", label: "What's blocking Aurora?", icon: "sparkle", action: (setView) => { window.chatInitialQuery = "What's blocking Aurora?"; setView("chat"); } },
    { id: "ai-3", label: "Draft release notes for last sprint", icon: "sparkle", action: (setView) => { window.chatInitialQuery = "Draft release notes for last sprint"; setView("chat"); } },
  ]},
];

const CommandPalette = ({ open, onClose, setView }) => {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);

  React.useEffect(() => {
    if (!open) { setQ(""); setSel(0); }
  }, [open]);

  const all = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return PALETTE_ITEMS.map(g => ({
      ...g,
      items: g.items.filter(it => !query || it.label.toLowerCase().includes(query))
    })).filter(g => g.items.length);
  }, [q]);

  const flat = all.flatMap(g => g.items);

  const go = (it) => {
    if (it.action) it.action(setView);
    onClose();
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { const it = flat[sel]; if (it) go(it); }
    else if (e.key === "Escape") onClose();
  };

  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="palette" onClick={e => e.stopPropagation()}>
        <div className="palette-input">
          <Icon name="search" size={16} style={{ color: "var(--fg-2)" }} />
          <input
            autoFocus
            placeholder="Search, jump to, ask…"
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
          />
          <span className="kbd-hint mono">ESC</span>
        </div>
        <div className="palette-list">
          {all.map((g, gi) => (
            <div key={gi}>
              <div className="palette-group">{g.group}</div>
              {g.items.map((it) => {
                const idx = flat.indexOf(it);
                return (
                  <button
                    key={it.id}
                    className={`palette-item ${idx === sel ? "sel" : ""}`}
                    onMouseEnter={() => setSel(idx)}
                    onClick={() => go(it)}
                  >
                    <Icon name={it.icon} size={15} style={{ color: "var(--fg-2)" }} />
                    <span className="truncate">{it.label}</span>
                    {it.kbd && <span className="k mono">{it.kbd}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Inbox panel ----
const InboxPanel = ({ open, onClose }) => {
  const [filter, setFilter] = React.useState("all");
  const list = INBOX.filter(n => filter === "all" || (filter === "unread" && n.unread));
  const kindIcon = { issue: "issues", pr: "pr", doc: "docs" };

  return (
    <aside className={`inbox-panel ${open ? "open" : ""}`}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="inbox" size={15} />
        <strong style={{ fontSize: 13.5 }}>Inbox</strong>
        <span className="mono muted-2" style={{ fontSize: 11 }}>{INBOX.filter(n => n.unread).length} unread</span>
        <div style={{ flex: 1 }} />
        <div className="segmented">
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "unread" ? "on" : ""} onClick={() => setFilter("unread")}>Unread</button>
        </div>
        <button className="icon-btn" onClick={onClose}><Icon name="x" size={14} /></button>
      </div>
      <div className="scroll-y" style={{ flex: 1 }}>
        {list.map(n => {
          const user = PEOPLE.find(p => p.id === n.from);
          return (
            <button key={n.id} onClick={() => { window.toast(`Opening ${n.target}`); onClose(); }} className="flex items-center gap-12" style={{
              width: "100%", padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)",
              textAlign: "left", background: n.unread ? "transparent" : "var(--bg-0)", opacity: n.unread ? 1 : 0.75
            }}>
              {n.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
              {!n.unread && <span style={{ width: 6, flexShrink: 0 }} />}
              {user ? <Avatar user={user} size="sm" /> : <span className="avatar sm" style={{ background: "var(--bg-3)" }}><Icon name={kindIcon[n.kind]} size={10} /></span>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--fg-0)", lineHeight: 1.35 }}>
                  {user && <strong style={{ fontWeight: 600 }}>{user.name.split(" ")[0]} </strong>}
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
  );
};

// ---- Tweaks panel ----
const TweaksPanel = ({ open, onClose, settings, setSettings }) => {
  const accents = [
    { id: "lime", value: "oklch(0.85 0.17 145)" },
    { id: "cyan", value: "oklch(0.78 0.13 220)" },
    { id: "violet", value: "oklch(0.72 0.18 300)" },
    { id: "amber", value: "oklch(0.80 0.14 75)" },
    { id: "rose", value: "oklch(0.72 0.17 20)" },
  ];

  return (
    <div className={`tweaks ${open ? "open" : ""}`}>
      <div className="flex items-center justify-between">
        <h4>Tweaks</h4>
        <button className="icon-btn" onClick={onClose}><Icon name="x" size={12} /></button>
      </div>

      <div className="tweak-row">
        <label>Accent</label>
        <div className="swatches">
          {accents.map(a => (
            <button
              key={a.id}
              className={`swatch ${settings.accent === a.id ? "sel" : ""}`}
              style={{ background: a.value }}
              onClick={() => setSettings(s => ({ ...s, accent: a.id }))}
            />
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Theme</label>
        <div className="segmented">
          {["dark","light"].map(t => (
            <button key={t} className={settings.theme === t ? "on" : ""} onClick={() => setSettings(s => ({...s, theme: t}))}>{t}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Density</label>
        <div className="segmented">
          {["compact","default","relaxed"].map(d => (
            <button key={d} className={settings.density === d ? "on" : ""} onClick={() => setSettings(s => ({...s, density: d}))}>{d}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Sidebar</label>
        <div className="segmented">
          {["expanded","collapsed"].map(d => (
            <button key={d} className={settings.sidebar === d ? "on" : ""} onClick={() => setSettings(s => ({...s, sidebar: d}))}>{d}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Card style</label>
        <div className="segmented">
          {["detailed","minimal"].map(d => (
            <button key={d} className={settings.cardStyle === d ? "on" : ""} onClick={() => setSettings(s => ({...s, cardStyle: d}))}>{d}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HintBar = ({ onOpenPalette }) => (
  <div className="hint-bar">
    <span><kbd>⌘K</kbd> search</span>
    <span><kbd>C</kbd> new issue</span>
    <span><kbd>G</kbd>+<kbd>I</kbd> inbox</span>
    <span><kbd>?</kbd> help</span>
  </div>
);

Object.assign(window, { Sidebar, Topbar, CommandPalette, InboxPanel, TweaksPanel, HintBar });
