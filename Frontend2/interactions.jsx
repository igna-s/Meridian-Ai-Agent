// Global interaction helpers: toast, modal, project selection, copy link.
// Exposes window.toast(msg), window.confirmAction(msg, cb), window.openNewIssue(),
// window.openShareModal(title), and a <Toaster /> component mounted by App.

(function () {
  const listeners = new Set();
  let nextId = 1;
  const state = { toasts: [], modal: null };

  const emit = () => listeners.forEach(l => l());

  window.__ui = {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get state() { return state; },
    toast(msg, opts = {}) {
      const id = nextId++;
      state.toasts = [...state.toasts, { id, msg, kind: opts.kind || "info" }];
      emit();
      setTimeout(() => {
        state.toasts = state.toasts.filter(t => t.id !== id);
        emit();
      }, opts.duration || 2800);
    },
    openModal(modal) { state.modal = modal; emit(); },
    closeModal() { state.modal = null; emit(); },
  };

  // Convenience
  window.toast = (msg, opts) => window.__ui.toast(msg, opts);
  window.copyLink = (label) => {
    const url = `https://meridian.app/${(label || "link").toLowerCase().replace(/\s+/g, "-")}`;
    try {
      navigator.clipboard?.writeText(url);
    } catch (e) { /* noop */ }
    window.toast(`Link copied — ${url}`);
  };
  window.openNewIssue = (prefill) => window.__ui.openModal({ kind: "new-issue", prefill: prefill || {} });
  window.openNewDoc = () => window.__ui.openModal({ kind: "new-doc" });
  window.openNewPR = () => window.__ui.openModal({ kind: "new-pr" });
  window.openInvite = () => window.__ui.openModal({ kind: "invite" });
  window.openShare = (title) => window.__ui.openModal({ kind: "share", title });
  window.openPicker = (opts) => window.__ui.openModal({ kind: "picker", ...opts });
  window.openWeek = () => window.__ui.openModal({ kind: "week" });
  window.openDigest = () => window.openAI("Give me a daily digest of what happened, what I need to focus on, and any risks.", "general", { inbox: typeof INBOX !== 'undefined' ? INBOX : [], issues: typeof ISSUES !== 'undefined' ? ISSUES : [] });
  window.openFilter = (scope) => window.__ui.openModal({ kind: "filter", scope });
  window.openPR = (pr) => window.__ui.openModal({ kind: "pr-detail", pr });
  window.openProject = (project) => window.__ui.openModal({ kind: "project", project });
  window.openSprintReport = () => window.openAI("Generate a sprint report for Iteration 42. Summarize completed work, carryover, and team velocity.", "sprint", { issues: typeof ISSUES !== 'undefined' ? ISSUES : [] });
  window.openRetro = () => window.openAI("Draft a retrospective for the current sprint. Identify what went well, what didn't, and action items.", "sprint", { issues: typeof ISSUES !== 'undefined' ? ISSUES : [] });
  window.openTeammate = (user) => window.__ui.openModal({ kind: "teammate", user });
  window.openAttach = () => window.__ui.openModal({ kind: "attach" });
})();

// ---- React bits ----
function useUIState() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => window.__ui.subscribe(force), []);
  return window.__ui.state;
}

const Toaster = () => {
  const { toasts } = useUIState();
  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      display: "flex", flexDirection: "column", gap: 6, zIndex: 500, pointerEvents: "none"
    }}>
      {toasts.map(t => (
        <div key={t.id} className="mono" style={{
          background: "var(--bg-2)", border: "1px solid var(--border-strong)",
          color: "var(--fg-0)", padding: "8px 14px", borderRadius: 8, fontSize: 12,
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)", pointerEvents: "auto",
          animation: "toastIn 180ms ease",
        }}>{t.msg}</div>
      ))}
    </div>
  );
};

const ModalShell = ({ title, subtitle, onClose, children, footer, width = 480 }) => (
  <div className="overlay" onClick={onClose} style={{ alignItems: "center" }}>
    <div onClick={e => e.stopPropagation()} style={{
      width, maxWidth: "calc(100vw - 40px)", background: "var(--bg-1)",
      border: "1px solid var(--border-strong)", borderRadius: 12,
      boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)", overflow: "hidden",
      display: "flex", flexDirection: "column", maxHeight: "80vh"
    }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
          {subtitle && <div className="muted mono" style={{ fontSize: 11, marginTop: 2 }}>{subtitle}</div>}
        </div>
        <button className="icon-btn" onClick={onClose}><Icon name="x" size={14} /></button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 18 }}>{children}</div>
      {footer && <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, justifyContent: "flex-end", background: "var(--bg-0)" }}>{footer}</div>}
    </div>
  </div>
);

const NewIssueModal = ({ prefill, onClose }) => {
  const [title, setTitle] = React.useState(prefill.title || "");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState(prefill.priority || "med");
  const [project, setProject] = React.useState(prefill.project || PROJECTS[0].id);
  const submit = async () => {
    if (!title.trim()) { window.toast("Add a title first"); return; }
    const proj = PROJECTS.find(p => p.id === project);
    try {
      await window.apiFetch('POST', '/api/issues', { title: title.trim(), description: description.trim(), priority, project, status: prefill.status || 'backlog' });
      window.meridianRefresh();
      window.toast(`Created issue in ${proj.code}`);
      onClose();
    } catch (e) {
      window.toast("Failed to create issue");
    }
  };
  return (
    <ModalShell title="New issue" subtitle="⌘↵ to create · ESC to dismiss" onClose={onClose} width={560}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm primary" onClick={submit}>Create issue</button>
      </>}>
      <input autoFocus placeholder="Issue title" value={title} onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
        style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 18, padding: "4px 2px", color: "var(--fg-0)", marginBottom: 10 }} />
      <textarea placeholder="Add description… (optional)" rows={4} value={description} onChange={e => setDescription(e.target.value)} style={{
        width: "100%", background: "var(--bg-0)", border: "1px solid var(--border)",
        outline: "none", borderRadius: 8, padding: 10, fontSize: 13, color: "var(--fg-0)",
        fontFamily: "inherit", resize: "vertical", marginBottom: 14
      }} />
      <div className="flex items-center gap-8" style={{ flexWrap: "wrap" }}>
        <select value={project} onChange={e => setProject(e.target.value)} className="btn ghost sm">
          {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className="btn ghost sm">
          {[["urgent","Urgent"],["high","High"],["med","Medium"],["low","Low"],["none","None"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button className="btn ghost sm"><Icon name="at" size={12} /> Assignee</button>
        <button className="btn ghost sm"><Icon name="calendar" size={12} /> Due date</button>
      </div>
    </ModalShell>
  );
};

const NewDocModal = ({ onClose }) => {
  const [title, setTitle] = React.useState("");
  const submit = async () => {
    if (!title.trim()) { window.toast("Add a title"); return; }
    try {
      await window.apiFetch('POST', '/api/docs', { title: title.trim() });
      window.meridianRefresh();
      window.toast(`Draft created · ${title}`);
      onClose();
    } catch (e) {
      window.toast("Failed to create doc");
    }
  };
  return (
    <ModalShell title="New document" onClose={onClose} width={520}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm primary" onClick={submit}>Create</button>
      </>}>
      <input autoFocus placeholder="Untitled document" value={title} onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 20, padding: "4px 2px", color: "var(--fg-0)", fontFamily: "var(--font-editorial, inherit)" }} />
      <div className="muted" style={{ fontSize: 12, marginTop: 16 }}>A private draft will appear in Docs → Drafts. You can move or share it later.</div>
    </ModalShell>
  );
};

const NewPRModal = ({ onClose }) => {
  const [title, setTitle] = React.useState("");
  const [branch, setBranch] = React.useState("");
  const submit = async () => {
    if (!title || !branch) { window.toast("Title and branch required"); return; }
    try {
      await window.apiFetch('POST', '/api/prs', { title, branch, base: 'main', status: 'open' });
      window.meridianRefresh();
      window.toast(`Opened PR · ${branch} → main`);
      onClose();
    } catch (e) {
      window.toast("Failed to open PR");
    }
  };
  return (
    <ModalShell title="Open pull request" onClose={onClose} width={560}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm primary" onClick={submit}>Open PR</button>
      </>}>
      <input autoFocus placeholder="PR title" value={title} onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", background: "var(--bg-0)", border: "1px solid var(--border)", outline: "none", fontSize: 14, padding: "8px 10px", borderRadius: 8, color: "var(--fg-0)", marginBottom: 10 }} />
      <div className="flex items-center gap-8">
        <input placeholder="feature/branch-name" value={branch} onChange={e => setBranch(e.target.value)} className="mono"
          style={{ flex: 1, background: "var(--bg-0)", border: "1px solid var(--border)", outline: "none", fontSize: 13, padding: "8px 10px", borderRadius: 8, color: "var(--fg-0)" }} />
        <span className="mono muted-2">→</span>
        <div className="mono" style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-0)", fontSize: 13 }}>main</div>
      </div>
    </ModalShell>
  );
};

const InviteModal = ({ onClose }) => {
  const [email, setEmail] = React.useState("");
  const submit = () => {
    if (!email.includes("@")) { window.toast("Enter a valid email"); return; }
    window.toast(`Invite sent to ${email}`);
    onClose();
  };
  return (
    <ModalShell title="Invite to workspace" subtitle="Helix · enterprise" onClose={onClose} width={480}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm primary" onClick={submit}>Send invite</button>
      </>}>
      <input autoFocus placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{ width: "100%", background: "var(--bg-0)", border: "1px solid var(--border)", outline: "none", fontSize: 14, padding: "10px 12px", borderRadius: 8, color: "var(--fg-0)" }} />
      <div className="muted" style={{ fontSize: 11.5, marginTop: 10 }}>They'll receive an email with a workspace join link valid for 7 days.</div>
    </ModalShell>
  );
};

const ShareModal = ({ title, onClose }) => {
  const url = `https://meridian.app/docs/${(title || "doc").toLowerCase().replace(/\s+/g, "-")}`;
  const copy = () => {
    try { navigator.clipboard?.writeText(url); } catch {}
    window.toast("Link copied");
    onClose();
  };
  return (
    <ModalShell title="Share" subtitle={title} onClose={onClose} width={480}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Done</button>
        <button className="btn sm primary" onClick={copy}><Icon name="link" size={12} /> Copy link</button>
      </>}>
      <div className="mono" style={{ padding: "10px 12px", background: "var(--bg-0)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--fg-1)", marginBottom: 14, wordBreak: "break-all" }}>{url}</div>
      <div style={{ fontSize: 12.5, marginBottom: 6, fontWeight: 500 }}>People with access</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {PEOPLE.slice(0, 3).map(u => (
          <div key={u.id} className="flex items-center gap-8" style={{ fontSize: 12.5 }}>
            <Avatar user={u} size="xs" />
            <span>{u.name}</span>
            <span className="mono muted-2" style={{ marginLeft: "auto", fontSize: 11 }}>Editor</span>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

const PickerModal = ({ title, options, onChoose, onClose }) => (
  <ModalShell title={title} onClose={onClose} width={400}>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {options.map(o => (
        <button key={o.value} className="palette-item" onClick={() => { onChoose(o); onClose(); }}>
          {o.icon && <Icon name={o.icon} size={14} style={{ color: o.color || "var(--fg-2)" }} />}
          {o.swatch && <span style={{ width: 10, height: 10, borderRadius: 3, background: o.swatch, flexShrink: 0 }} />}
          <span style={{ flex: 1, textAlign: "left" }}>{o.label}</span>
          {o.hint && <span className="mono muted-2" style={{ fontSize: 11 }}>{o.hint}</span>}
        </button>
      ))}
    </div>
  </ModalShell>
);

const ModalHost = () => {
  const { modal } = useUIState();
  if (!modal) return null;
  const close = () => window.__ui.closeModal();
  switch (modal.kind) {
    case "new-issue": return <NewIssueModal prefill={modal.prefill} onClose={close} />;
    case "new-doc":   return <NewDocModal onClose={close} />;
    case "new-pr":    return <NewPRModal onClose={close} />;
    case "invite":    return <InviteModal onClose={close} />;
    case "share":     return <ShareModal title={modal.title} onClose={close} />;
    case "picker":    return <PickerModal title={modal.title} options={modal.options} onChoose={modal.onChoose} onClose={close} />;
    case "week":      return <WeekModal onClose={close} />;
    case "digest":    return <DigestModal onClose={close} />;
    case "filter":    return <FilterModal scope={modal.scope} onClose={close} />;
    case "pr-detail": return <PRDetailModal pr={modal.pr} onClose={close} />;
    case "project":   return <ProjectDetailModal project={modal.project} onClose={close} />;
    case "sprint-report": return <SprintReportModal onClose={close} />;
    case "retro":     return <RetroModal onClose={close} />;
    case "ai":        return <AIAnswerModal question={modal.question} onClose={close} />;
    case "teammate":  return <TeammateModal user={modal.user} onClose={close} />;
    case "attach":    return <AttachModal onClose={close} />;
    default: return null;
  }
};

Object.assign(window, { Toaster, ModalHost });
