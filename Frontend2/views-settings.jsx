// Settings view — workspace configuration + appearance (tweaks integrated)

const SettingsView = ({ settings, setSettings }) => {
  const [section, setSection] = React.useState("appearance");

  const sections = [
    { group: "Workspace", items: [
      { id: "general", label: "General", icon: "settings" },
      { id: "members", label: "Members & roles", icon: "team" },
      { id: "billing", label: "Billing", icon: "database" },
      { id: "security", label: "Security & SSO", icon: "lock" },
    ]},
    { group: "Preferences", items: [
      { id: "appearance", label: "Appearance", icon: "sparkle" },
      { id: "notifications", label: "Notifications", icon: "bell" },
      { id: "keyboard", label: "Keyboard shortcuts", icon: "hash" },
      { id: "account", label: "My account", icon: "at" },
    ]},
    { group: "Integrations", items: [
      { id: "integrations", label: "Connected apps", icon: "link" },
      { id: "api", label: "API & webhooks", icon: "globe" },
      { id: "ai", label: "AI & Integrations", icon: "sparkle" },
      { id: "import", label: "Import / export", icon: "download" },
    ]},
  ];

  return (
    <div className="flex flex-1" style={{ minWidth: 0 }}>
      <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--bg-1)", overflow: "auto", padding: "14px 8px" }}>
        <div style={{ padding: "4px 10px 10px", fontSize: 12.5, fontWeight: 600 }}>Settings</div>
        {sections.map(g => (
          <div key={g.group} className="sb-section" style={{ padding: "4px 0" }}>
            <div className="sb-label" style={{ padding: "6px 10px" }}>{g.group}</div>
            {g.items.map(it => (
              <button key={it.id} className={`sb-item ${section === it.id ? "active" : ""}`} onClick={() => setSection(it.id)}>
                <span className="sb-ind" />
                <Icon name={it.icon} className="sb-icon" />
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        ))}
      </aside>
      <div className="flex col flex-1" style={{ minWidth: 0 }}>
        <div className="page-header">
          <div className="page-title">
            <span className="eyebrow">SETTINGS</span>
            <Icon name="chevron-right" size={12} style={{ color: "var(--fg-3)" }} />
            <span style={{ textTransform: "capitalize" }}>{sections.flatMap(g => g.items).find(i => i.id === section)?.label}</span>
          </div>
        </div>
        <div className="scroll-y" style={{ flex: 1, padding: "32px 48px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {section === "appearance" && <AppearanceSection settings={settings} setSettings={setSettings} />}
            {section === "general" && <GeneralSection />}
            {section === "notifications" && <NotificationsSection />}
            {section === "keyboard" && <KeyboardSection />}
            {section === "members" && <MembersPlaceholder />}
            {section === "security" && <PlaceholderSection title="Security & SSO" desc="SAML, SCIM, audit logs, IP allowlist." />}
            {section === "billing" && <PlaceholderSection title="Billing" desc="Plan, seats, invoices, tax information." />}
            {section === "account" && <PlaceholderSection title="My account" desc="Profile, email, password, two-factor." />}
            {section === "integrations" && <IntegrationsSection />}
            {section === "api" && <PlaceholderSection title="API & webhooks" desc="Personal access tokens, OAuth apps, webhook endpoints." />}
            {section === "ai" && <AISection />}
            {section === "import" && <PlaceholderSection title="Import / export" desc="Migrate from Jira, Linear, GitHub Issues, Asana. Bulk export as CSV or JSON." />}
          </div>
        </div>
      </div>
    </div>
  );
};

const SetRow = ({ title, desc, children }) => (
  <div className="flex" style={{ padding: "18px 0", borderTop: "1px solid var(--border-subtle)", gap: 24, alignItems: "flex-start" }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--fg-0)" }}>{title}</div>
      {desc && <div className="muted" style={{ fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const SetGroup = ({ title, desc, children }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 className="editorial" style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", margin: "0 0 4px" }}>{title}</h2>
    {desc && <p className="muted" style={{ fontSize: 13, margin: "0 0 12px", maxWidth: 620 }}>{desc}</p>}
    <div>{children}</div>
  </section>
);

const AppearanceSection = ({ settings, setSettings }) => {
  const accents = [
    { id: "lime", name: "Lime", value: "oklch(0.85 0.17 145)" },
    { id: "cyan", name: "Cyan", value: "oklch(0.78 0.13 220)" },
    { id: "violet", name: "Violet", value: "oklch(0.72 0.18 300)" },
    { id: "amber", name: "Amber", value: "oklch(0.80 0.14 75)" },
    { id: "rose", name: "Rose", value: "oklch(0.72 0.17 20)" },
  ];

  const themes = [
    { id: "dark",  label: "Dark",  bg: "oklch(0.18 0.008 250)", fg: "oklch(0.97 0.005 250)" },
    { id: "light", label: "Light", bg: "oklch(0.985 0.003 250)", fg: "oklch(0.18 0.015 250)" },
  ];

  return (
    <div>
      <SetGroup title="Appearance" desc="Customize how Meridian looks for you. Changes apply across all your devices signed in as @amara.">
        <SetRow title="Theme" desc="Dark reduces eye strain in long sessions. Light is better in bright environments.">
          <div style={{ display: "flex", gap: 8 }}>
            {themes.map(t => (
              <button key={t.id}
                onClick={() => setSettings(s => ({ ...s, theme: t.id }))}
                style={{
                  width: 88, padding: 6, borderRadius: 8,
                  border: `2px solid ${settings.theme === t.id ? "var(--accent)" : "var(--border)"}`,
                  background: "var(--bg-1)", textAlign: "left",
                  transition: "border-color 140ms"
                }}>
                <div style={{ height: 44, borderRadius: 4, background: t.bg, display: "flex", alignItems: "center", padding: "0 6px", gap: 4, marginBottom: 4, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
                  <span style={{ flex: 1, height: 2, background: `color-mix(in oklch, ${t.fg} 50%, transparent)`, borderRadius: 1 }} />
                </div>
                <div style={{ fontSize: 11.5, color: "var(--fg-1)" }}>{t.label}</div>
              </button>
            ))}
          </div>
        </SetRow>

        <SetRow title="Accent color" desc="Used for active states, primary actions, the aurora backdrop, and data highlights.">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 280 }}>
            {accents.map(a => (
              <button key={a.id}
                onClick={() => setSettings(s => ({ ...s, accent: a.id }))}
                title={a.name}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: a.value,
                  border: `2px solid ${settings.accent === a.id ? "var(--fg-0)" : "transparent"}`,
                  boxShadow: `0 0 0 1px var(--border-strong), 0 0 14px -2px ${a.value}`,
                  cursor: "pointer", transition: "transform 140ms, border-color 140ms",
                  transform: settings.accent === a.id ? "scale(1.05)" : "scale(1)"
                }} />
            ))}
          </div>
        </SetRow>

        <SetRow title="Density" desc="Controls row heights and spacing throughout lists and tables.">
          <div className="segmented">
            {["compact","default","relaxed"].map(d => (
              <button key={d} className={settings.density === d ? "on" : ""} onClick={() => setSettings(s => ({ ...s, density: d }))} style={{ textTransform: "capitalize" }}>{d}</button>
            ))}
          </div>
        </SetRow>

        <SetRow title="Sidebar" desc="Collapsed shows icons only, maximizing canvas room.">
          <div className="segmented">
            {["expanded","collapsed"].map(d => (
              <button key={d} className={settings.sidebar === d ? "on" : ""} onClick={() => setSettings(s => ({ ...s, sidebar: d }))} style={{ textTransform: "capitalize" }}>{d}</button>
            ))}
          </div>
        </SetRow>

        <SetRow title="Kanban card" desc="Detailed shows labels, branch, comments, dates. Minimal shows title and priority only.">
          <div className="segmented">
            {["detailed","minimal"].map(d => (
              <button key={d} className={settings.cardStyle === d ? "on" : ""} onClick={() => setSettings(s => ({ ...s, cardStyle: d }))} style={{ textTransform: "capitalize" }}>{d}</button>
            ))}
          </div>
        </SetRow>

        <SetRow title="Reduce motion" desc="Disables the aurora backdrop animation, gradient shimmer, and page transitions.">
          <Toggle on={settings.reduceMotion} onChange={v => setSettings(s => ({ ...s, reduceMotion: v }))} />
        </SetRow>
      </SetGroup>

      <SetGroup title="Preview">
        <div className="card" style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div className="muted-2 mono" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Primary action</div>
            <button className="btn primary" onClick={() => window.openNewIssue()}>
              <Icon name="plus" size={13} /> Create issue
            </button>
          </div>
          <div>
            <div className="muted-2 mono" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Status set</div>
            <div className="flex items-center gap-12" style={{ flexWrap: "wrap" }}>
              <span className="status todo"><span className="s-dot" /> Todo</span>
              <span className="status progress"><span className="s-dot" /> Doing</span>
              <span className="status review"><span className="s-dot" /> Review</span>
              <span className="status done"><span className="s-dot" /> Done</span>
            </div>
          </div>
        </div>
      </SetGroup>
    </div>
  );
};

const Toggle = ({ on, onChange }) => (
  <button onClick={() => onChange(!on)} style={{
    width: 36, height: 20, borderRadius: 999,
    background: on ? "var(--accent)" : "var(--bg-3)",
    border: "1px solid var(--border)",
    position: "relative", transition: "background 160ms",
    cursor: "pointer"
  }}>
    <span style={{
      position: "absolute", top: 1, left: on ? 17 : 1,
      width: 16, height: 16, borderRadius: "50%",
      background: on ? "var(--accent-fg)" : "var(--fg-1)",
      transition: "left 160ms",
      boxShadow: "0 1px 2px oklch(0 0 0 / 0.25)"
    }} />
  </button>
);

const GeneralSection = () => (
  <div>
    <SetGroup title="Workspace" desc="Shared across everyone in Helix Enterprise.">
      <SetRow title="Workspace name">
        <input defaultValue="Helix Enterprise" style={inputStyle} />
      </SetRow>
      <SetRow title="URL slug" desc="meridian.app/helix">
        <input defaultValue="helix" style={inputStyle} />
      </SetRow>
      <SetRow title="Default project" desc="New issues are created in this project when none is specified.">
        <select defaultValue="aurora" style={inputStyle}>
          {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </SetRow>
      <SetRow title="Start of week" desc="Used in roadmap, sprints, and calendars.">
        <div className="segmented">
          <button className="on">Monday</button>
          <button>Sunday</button>
        </div>
      </SetRow>
      <SetRow title="Time zone">
        <select defaultValue="UTC+0" style={inputStyle}>
          <option>UTC+0 — London</option>
          <option>UTC+1 — Madrid</option>
          <option>UTC-5 — New York</option>
          <option>UTC-8 — San Francisco</option>
        </select>
      </SetRow>
    </SetGroup>
    <SetGroup title="Danger zone">
      <SetRow title="Archive workspace" desc="Prevents writes. Data remains readable for 90 days.">
        <button className="btn" onClick={() => window.toast("Workspace archived (demo)")}>Archive</button>
      </SetRow>
      <SetRow title="Delete workspace" desc="Irreversible. Removes all issues, docs, and integrations.">
        <button className="btn" style={{ color: "var(--rose)", borderColor: "color-mix(in oklch, var(--rose) 40%, var(--border))" }} onClick={() => window.toast("Type ‘DELETE’ to confirm (demo)")}>Delete…</button>
      </SetRow>
    </SetGroup>
  </div>
);

const NotificationsSection = () => {
  const [prefs, setPrefs] = React.useState({
    mentions: { inbox: true, email: true, push: true },
    assigned: { inbox: true, email: true, push: false },
    reviewRequested: { inbox: true, email: false, push: true },
    statusChange: { inbox: true, email: false, push: false },
    newIssue: { inbox: false, email: false, push: false },
    docUpdate: { inbox: true, email: false, push: false },
  });

  const types = [
    { id: "mentions", label: "@mentions", desc: "Someone mentions you in a comment, doc, or review." },
    { id: "assigned", label: "Assigned to you", desc: "An issue or review is assigned to you." },
    { id: "reviewRequested", label: "Review requested", desc: "A pull request needs your review." },
    { id: "statusChange", label: "Status changed", desc: "Your issues move across the board." },
    { id: "newIssue", label: "New issues in projects you watch", desc: "Someone opens an issue in a subscribed project." },
    { id: "docUpdate", label: "Doc updates", desc: "A document you've subscribed to is edited." },
  ];

  const channels = [
    { id: "inbox", label: "Inbox" },
    { id: "email", label: "Email" },
    { id: "push", label: "Push" },
  ];

  return (
    <SetGroup title="Notifications" desc="Route each event to the channels where you want to hear about it.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: 0, borderTop: "1px solid var(--border-subtle)" }}>
        <div />
        {channels.map(c => <div key={c.id} className="mono muted-2" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", padding: "12px 0", textAlign: "center" }}>{c.label}</div>)}
        {types.map(t => (
          <React.Fragment key={t.id}>
            <div style={{ padding: "14px 12px 14px 0", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>{t.desc}</div>
            </div>
            {channels.map(c => (
              <div key={c.id} style={{ padding: "14px 0", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Toggle on={prefs[t.id][c.id]} onChange={v => setPrefs(p => ({ ...p, [t.id]: { ...p[t.id], [c.id]: v } }))} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </SetGroup>
  );
};

const KeyboardSection = () => {
  const groups = [
    { title: "Navigation", items: [
      ["Open command palette", "⌘ K"],
      ["Go to Home", "G H"],
      ["Go to Inbox", "G I"],
      ["Go to Issues", "G S"],
      ["Go to Docs", "G D"],
      ["Go to Roadmap", "G R"],
      ["Go to Pull requests", "G P"],
    ]},
    { title: "Actions", items: [
      ["Create issue", "C"],
      ["Create document", "⌘ ⇧ D"],
      ["Assign to me", "I"],
      ["Change priority", "⇧ P"],
      ["Change status", "⇧ S"],
      ["Add label", "L"],
      ["Add to sprint", "⇧ M"],
    ]},
    { title: "Editing", items: [
      ["Submit comment", "⌘ ↵"],
      ["Mention user", "@"],
      ["Insert link", "⌘ K"],
      ["Toggle bold", "⌘ B"],
      ["Insert code block", "⌘ ⇧ C"],
    ]},
  ];
  return (
    <SetGroup title="Keyboard shortcuts" desc="Meridian is keyboard-first. Press ? anywhere for this list.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {groups.map(g => (
          <div key={g.title}>
            <div className="mono muted-2" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{g.title}</div>
            <div>
              {g.items.map(([label, kbd]) => (
                <div key={label} className="flex items-center justify-between" style={{ padding: "8px 0", borderTop: "1px solid var(--border-subtle)", fontSize: 12.5 }}>
                  <span>{label}</span>
                  <span className="kbd-hint mono">{kbd}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SetGroup>
  );
};

const MembersPlaceholder = () => (
  <SetGroup title="Members & roles" desc="9 members in Helix Enterprise. Invite new teammates or adjust permissions.">
    <div className="card" style={{ overflow: "hidden" }}>
      {PEOPLE.slice(0, 6).map((u, i) => (
        <div key={u.id} className="flex items-center" style={{ padding: "10px 14px", borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none", gap: 10 }}>
          <Avatar user={u} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5 }}>{u.name}</div>
            <div className="muted mono" style={{ fontSize: 10.5 }}>@{u.handle} · {u.handle}@helix.com</div>
          </div>
          <select defaultValue={i === 0 ? "admin" : i < 3 ? "member" : "guest"} style={{ ...inputStyle, minWidth: 110 }}>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="guest">Guest</option>
          </select>
          <button className="btn ghost sm" onClick={() => window.openPicker({ title: "Member", options: [
            { value: "change-role", label: "Change role" },
            { value: "transfer", label: "Transfer admin" },
            { value: "remove", label: "Remove from workspace" },
          ], onChoose: (o) => window.toast(o.label) })}><Icon name="more" size={13} /></button>
        </div>
      ))}
    </div>
  </SetGroup>
);

const IntegrationsSection = () => {
  const apps = [
    { name: "GitHub", desc: "Link PRs, sync commits, auto-close issues.", connected: true, kind: "git" },
    { name: "Slack", desc: "Notifications in channels, slash-commands.", connected: true, kind: "message" },
    { name: "Figma", desc: "Embed frames in issues and docs.", connected: true, kind: "component" },
    { name: "Jira", desc: "Two-way sync for enterprise migration.", connected: true, kind: "issues" },
    { name: "Sentry", desc: "Auto-create issues from new errors.", connected: true, kind: "flag" },
    { name: "GitLab", desc: "Sync merge requests and pipelines.", connected: true, kind: "git" },
    { name: "Datadog", desc: "Attach monitor alerts to incidents.", connected: true, kind: "chart" },
    { name: "Zoom", desc: "Create meeting links in issues automatically.", connected: true, kind: "video" },
    { name: "Linear", desc: "One-way migration of issues.", connected: false, kind: "issues" },
    { name: "Notion", desc: "Import pages as Meridian docs.", connected: false, kind: "docs" },
  ];
  return (
    <SetGroup title="Connected apps" desc="Meridian plays well with the rest of your stack.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {apps.map(a => (
          <div key={a.name} className="card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--fg-1)", flexShrink: 0 }}>
              <Icon name={a.kind} size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                <strong style={{ fontSize: 13 }}>{a.name}</strong>
                {a.connected && <span className="chip" style={{ color: "var(--status-done)" }}><span className="d" style={{ background: "var(--status-done)" }} /> connected</span>}
              </div>
              <div className="muted" style={{ fontSize: 11.5, lineHeight: 1.4 }}>{a.desc}</div>
              <div style={{ marginTop: 10 }}>
                <button className={`btn sm ${a.connected ? "" : "primary"}`}>{a.connected ? "Configure" : "Connect"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SetGroup>
  );
};

const PlaceholderSection = ({ title, desc }) => (
  <SetGroup title={title} desc={desc}>
    <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--fg-3)" }}>
      <Icon name="settings" size={28} style={{ opacity: 0.5, marginBottom: 8 }} />
      <div style={{ fontSize: 12.5 }}>Section mock — not wired up in this prototype.</div>
    </div>
  </SetGroup>
);

const AISection = () => {
  const [url, setUrl] = React.useState(() => (window.getAmdUrl ? window.getAmdUrl() : '') || '');
  const [saved, setSaved] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null); // null | 'ok' | string(error)

  const save = () => {
    if (window.setAmdUrl) window.setAmdUrl(url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const test = async () => {
    const u = url.trim();
    if (!u) { window.toast('Ingresá la URL del endpoint primero'); return; }
    // Auto-save before testing
    if (window.setAmdUrl) window.setAmdUrl(u);
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch(u, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer dummy-key' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', max_tokens: 5,
          messages: [{ role: 'user', content: 'Reply: ok' }]
        })
      });
      if (res.ok) { setTestResult('ok'); }
      else { const e = await res.json().catch(() => ({})); setTestResult(e.error?.message || `HTTP ${res.status}`); }
    } catch (e) { setTestResult(e.message); }
    setTesting(false);
  };

  return (
    <SetGroup title="AI & Integrations" desc="Configurá el proveedor AI usado en todas las vistas de Meridian — Code Editor, PR Analyst, Sprint Coach, y más.">
      <SetRow
        title="AMD Endpoint URL"
        desc={<>Obtené la URL al correr <strong>deploy_amd_endpoint.sh</strong> en AMD Developer Cloud. Guardada en el navegador, nunca se envía a ningún servidor externo.</>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 340 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="amd-endpoint-input"
              type="text"
              value={url}
              onChange={e => { setUrl(e.target.value); setTestResult(null); }}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="http://<IP>:8000/v1/chat/completions"
              style={{
                ...inputStyle, flex: 1,
                fontFamily: 'var(--font-mono)', fontSize: 11.5,
                letterSpacing: url ? '0.04em' : 0,
              }}
            />
            <button
              className="btn sm"
              onClick={save}
              style={{ minWidth: 52, background: saved ? 'var(--status-done)' : undefined, color: saved ? '#fff' : undefined }}
            >
              {saved ? '✓' : 'Save'}
            </button>
          </div>
          <button
            onClick={test}
            disabled={testing}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: testing ? 'var(--fg-3)' : 'var(--accent)',
              fontSize: 12, cursor: testing ? 'default' : 'pointer',
              textAlign: 'left', width: 'fit-content',
              textDecoration: 'underline', textDecorationStyle: 'dotted',
            }}
          >
            {testing ? 'Probando conexión…' : '⚡ Test connection'}
          </button>
          {testResult === 'ok' && (
            <span style={{ fontSize: 11.5, color: 'var(--status-done)', display: 'flex', alignItems: 'center', gap: 4 }}>
              ✓ Conexión exitosa — endpoint AMD activo
            </span>
          )}
          {testResult && testResult !== 'ok' && (
            <span style={{ fontSize: 11.5, color: 'var(--rose)' }}>✗ {testResult}</span>
          )}
        </div>
      </SetRow>

      <SetRow title="AI Model" desc="Modelo usado por todos los asistentes con contexto.">
        <div style={{ ...inputStyle, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon name="sparkle" size={13} style={{ color: 'var(--accent)' }} />
          llama-3.3-70b-versatile
        </div>
      </SetRow>

      <SetRow title="Code Editor Agent" desc="El AI dentro del Code Editor usa el mismo endpoint y puede crear, editar y correr archivos HTML/CSS/JS.">
        <span className="chip" style={{ color: 'var(--status-done)' }}><span className="d" style={{ background: 'var(--status-done)' }} /> enabled</span>
      </SetRow>

      <SetRow title="Contextual AI Panels" desc="Each view (PRs, Sprints, Issues, Team, Compute) has a role-specific AI that understands what's on screen.">
        <span className="chip" style={{ color: 'var(--status-done)' }}><span className="d" style={{ background: 'var(--status-done)' }} /> enabled</span>
      </SetRow>
    </SetGroup>
  );
};

const inputStyle = {
  background: "var(--bg-1)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "6px 10px",
  color: "var(--fg-0)",
  fontSize: 12.5,
  outline: "none",
  minWidth: 180,
  fontFamily: "inherit",
};

Object.assign(window, { SettingsView });
