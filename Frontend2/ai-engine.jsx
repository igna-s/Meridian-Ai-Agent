// ── Meridian AI Engine ─────────────────────────────────────────────────────
// Single shared AI backed by Groq API (OpenAI-compatible, llama-3.3-70b-versatile)
// Each view passes a `role` so the system prompt is context-aware.

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL    = "llama-3.3-70b-versatile";

// Key is stored centrally in localStorage under "meridian-groq-key", or injected via Azure CI/CD
const INJECTED_KEY = "GROQ_API_KEY_PLACEHOLDER";

const getGroqKey = () => {
  const local = localStorage.getItem("meridian-groq-key");
  if (local) return local.trim();
  if (INJECTED_KEY && INJECTED_KEY !== "GROQ_API_KEY_PLACEHOLDER") return INJECTED_KEY;
  return "";
};
const setGroqKey = (k) => localStorage.setItem("meridian-groq-key", k.trim());

// ── System prompts per role ────────────────────────────────────────────────
const ROLE_PROMPTS = {
  general: `You are VaultMind AI, the intelligent assistant embedded in Meridian — a modern project management platform for engineering teams. You have awareness of the team's issues, PRs, sprints, roadmap, docs, and compute jobs. Be concise, insightful, and proactive. Respond in plain text or markdown.`,

  code: `You are the Meridian Code Agent embedded in the Code Editor. Your job is to help users create, edit, and run web files (HTML, CSS, JavaScript). When asked to create a file, output only clean, complete, functional code. Always suggest running the file after creating it. Mention the run command in terminal syntax (e.g. "open index.html" for HTML, "node app.js" for JS). Keep explanations short — the user wants working code fast.`,

  pr: `You are the Meridian PR Analyst. You analyze pull requests for engineering teams. When given PR data, evaluate:
- Merge readiness (checks, reviewers, conflicts)
- Risk level (High / Medium / Low) based on size, scope, and affected areas
- Suggested reviewers or missing context
- Potential issues: missing tests, breaking changes, security concerns
- Concrete action items for the author

Format your response with clear sections. Be direct — teams are busy.`,

  sprint: `You are the Meridian Sprint Coach. You analyze sprint health for engineering teams. When given sprint data (issues, burndown, velocity), provide:
- Sprint health score and trend
- At-risk items that may not complete
- Blocking issues and suggested unblocking actions
- Retrospective themes and talking points
- Velocity comparison with previous sprints

Be concise and actionable. Teams read this during standups.`,

  issues: `You are the Meridian Issue Triage Assistant. You help engineering teams manage their backlog. When given a list of issues, identify:
- Duplicates or related issues that should be linked
- Priority mismatches (high priority with no assignee, etc.)
- Issues blocking other issues
- Stale issues that need attention
- Recommended sprint candidates

Output a structured triage report.`,

  roadmap: `You are the Meridian Roadmap Analyst. You analyze quarterly roadmaps for engineering teams. When given roadmap items and their progress, provide:
- Delivery confidence per milestone (%)
- Items at risk of slipping to next quarter
- Dependency bottlenecks
- Suggested reprioritization
- Executive summary paragraph

Be direct. Skip the caveats.`,

  team: `You are the Meridian Team Intelligence assistant. You analyze team workload and capacity. When given team data, provide:
- Overloaded team members (load > 80%)
- Under-allocated capacity available for new work
- Suggested task reassignments for balance
- Who to pull in for specific tasks based on skills/current load
- Team health observations

Keep it practical and respectful.`,

  docs: `You are the Meridian Docs Writer. You help engineering teams write, summarize, and improve technical documentation. You can:
- Summarize long documents into bullet points
- Expand brief notes into full docs
- Improve clarity and structure of existing content
- Generate ADRs (Architecture Decision Records) from descriptions
- Write meeting notes, retrospectives, and engineering specs

Match the tone of the existing content.`,

  compute: `You are the Meridian Compute Analyst. You analyze GPU compute jobs and infrastructure usage. When given job and quota data, provide:
- Current spend efficiency analysis
- Jobs that can be optimized (region, GPU tier, duration)
- Spot instance opportunities for cost savings
- Queue wait time predictions
- Recommendations for GPU selection based on workload type

Output cost estimates where possible.`,
};

// ── Core call function ─────────────────────────────────────────────────────
async function groqChat({ role = "general", messages, contextData = null, onChunk = null }) {
  const key = getGroqKey();
  if (!key) throw new Error("NO_KEY");

  const systemPrompt = ROLE_PROMPTS[role] || ROLE_PROMPTS.general;
  const contextBlock = contextData
    ? `\n\n--- LIVE WORKSPACE DATA ---\n${JSON.stringify(contextData, null, 2)}\n--- END DATA ---`
    : "";

  const body = {
    model: GROQ_MODEL,
    max_tokens: 1024,
    stream: !!onChunk,
    messages: [
      { role: "system", content: systemPrompt + contextBlock },
      ...messages,
    ],
  };

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq HTTP ${res.status}`);
  }

  // Streaming
  if (onChunk) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(l => l.startsWith("data: ") && l !== "data: [DONE]");
      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          const delta = data.choices?.[0]?.delta?.content || "";
          if (delta) { fullText += delta; onChunk(delta, fullText); }
        } catch (_) {}
      }
    }
    return fullText;
  }

  // Non-streaming
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Floating AI Panel ──────────────────────────────────────────────────────
const AIPanelContext = React.createContext(null);

const AIPanelProvider = ({ children }) => {
  const [open, setOpen]         = React.useState(false);
  const [role, setRole]         = React.useState("general");
  const [ctxData, setCtxData]   = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading]   = React.useState(false);
  const [streamText, setStreamText] = React.useState("");
  const scrollRef = React.useRef(null);

  const openAI = React.useCallback((initialPrompt, aiRole = "general", data = null) => {
    setRole(aiRole);
    setCtxData(data);
    setOpen(true);
    if (initialPrompt) {
      // fire off immediately
      setTimeout(() => sendAI(initialPrompt, aiRole, data, []), 80);
    }
  }, []);

  React.useEffect(() => {
    window.openAI = openAI;
  }, [openAI]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streamText]);

  const sendAI = async (text, overrideRole, overrideData, prevMessages) => {
    const r   = overrideRole  ?? role;
    const ctx = overrideData  ?? ctxData;
    const hist = prevMessages ?? messages;
    if (!text.trim() || loading) return;
    setLoading(true);
    setStreamText("");

    const userMsg = { role: "user", content: text };
    const newHist = [...hist, userMsg];
    setMessages(newHist);

    try {
      let accumulated = "";
      await groqChat({
        role: r,
        messages: newHist,
        contextData: ctx,
        onChunk: (delta, full) => {
          accumulated = full;
          setStreamText(full);
        },
      });
      setMessages(m => [...m, { role: "assistant", content: accumulated }]);
      setStreamText("");
    } catch (e) {
      const msg = "(Hi, de api is disconected)";
      setMessages(m => [...m, { role: "assistant", content: msg }]);
      setStreamText("");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const el = document.getElementById("ai-panel-input");
    if (!el) return;
    const text = el.value.trim();
    if (!text) return;
    el.value = "";
    sendAI(text);
  };

  const ROLE_LABELS = {
    general: "VaultMind AI", code: "Code Agent", pr: "PR Analyst",
    sprint: "Sprint Coach", issues: "Issue Triage", roadmap: "Roadmap Analyst",
    team: "Team Intel", docs: "Docs Writer", compute: "Compute Analyst",
  };

  const renderMd = (text) => {
    if (!text) return "";
    // Simple markdown: bold, code, line breaks
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code style='background:var(--bg-3);padding:1px 4px;border-radius:3px;font-family:var(--font-mono);font-size:0.9em'>$1</code>")
      .replace(/\n/g, "<br>");
  };

  if (!open) return (
    <AIPanelContext.Provider value={{ openAI }}>
      {children}
    </AIPanelContext.Provider>
  );

  return (
    <AIPanelContext.Provider value={{ openAI }}>
      {children}
      {/* Backdrop */}
      <div onClick={() => setOpen(false)} style={{
        position: "fixed", inset: 0, zIndex: 299,
        background: "oklch(0 0 0 / 0.3)", backdropFilter: "blur(2px)",
      }} />
      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 440, zIndex: 300,
        background: "var(--bg-0)", borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px oklch(0 0 0 / 0.35)",
        animation: "slideInRight 200ms cubic-bezier(0.2,0.7,0.2,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 16px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          <Icon name="sparkle" size={16} style={{ color: "var(--accent)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{ROLE_LABELS[role] || "AI"}</div>
            <div style={{ fontSize: 10.5, color: "var(--fg-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{role} mode</div>
          </div>
          <button className="segmented" style={{ gap: 4, background: "transparent", border: "none" }}>
            {Object.keys(ROLE_LABELS).slice(0, 5).map(r2 => (
              <button key={r2} className={role === r2 ? "on" : ""} style={{ fontSize: 10, padding: "3px 7px", textTransform: "capitalize" }}
                onClick={() => setRole(r2)}>{r2}</button>
            ))}
          </button>
          <button className="icon-btn" onClick={() => { setMessages([]); setStreamText(""); }}>
            <Icon name="plus" size={13} style={{ transform: "rotate(45deg)" }} />
          </button>
          <button className="icon-btn" onClick={() => setOpen(false)}>
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", marginTop: 40, color: "var(--fg-3)" }}>
              <Icon name="sparkle" size={28} style={{ opacity: 0.4, marginBottom: 10, color: "var(--accent)" }} />
              <div style={{ fontSize: 13, color: "var(--fg-2)", marginBottom: 20 }}>Ask me anything about your {role === "general" ? "workspace" : role}.</div>
              {[
                role === "pr" && "Analyze all open PRs",
                role === "sprint" && "Summarize sprint 42 health",
                role === "issues" && "Which issues are blocking the sprint?",
                role === "team" && "Who has capacity for a new task?",
                role === "code" && "Create a landing page with a hero section",
                role === "compute" && "How can I reduce my compute costs?",
                role === "general" && "Give me today's standup brief",
              ].filter(Boolean).map((s, i) => (
                <button key={i} onClick={() => { sendAI(s); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", margin: "4px 0", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-1)", cursor: "pointer", fontSize: 12.5, color: "var(--fg-1)", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-dim)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                background: m.role === "user" ? "var(--accent)" : "var(--bg-2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {m.role === "user"
                  ? <Icon name="team" size={14} style={{ color: "var(--accent-fg)" }} />
                  : <Icon name="sparkle" size={14} style={{ color: "var(--accent)" }} />}
              </div>
              <div style={{
                maxWidth: "85%", padding: "10px 13px", borderRadius: 10, fontSize: 13, lineHeight: 1.55,
                background: m.role === "user" ? "var(--accent-dim)" : "var(--bg-1)",
                border: m.role === "user" ? "none" : "1px solid var(--border)",
                borderTopRightRadius: m.role === "user" ? 2 : 10,
                borderTopLeftRadius: m.role === "user" ? 10 : 2,
                color: "var(--fg-1)",
              }} dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
            </div>
          ))}
          {/* Streaming */}
          {loading && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, flexShrink: 0, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="sparkle" size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ maxWidth: "85%", padding: "10px 13px", borderRadius: 10, fontSize: 13, lineHeight: 1.55, background: "var(--bg-1)", border: "1px solid var(--border)", borderTopLeftRadius: 2, color: "var(--fg-1)" }}>
                {streamText
                  ? <span dangerouslySetInnerHTML={{ __html: renderMd(streamText) }} />
                  : <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse 1s ease-in-out infinite" }} />
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse 1s ease-in-out 0.2s infinite" }} />
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse 1s ease-in-out 0.4s infinite" }} />
                    </span>}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
            <input id="ai-panel-input" placeholder={`Ask ${ROLE_LABELS[role] || "AI"}…`}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-1)", color: "var(--fg-0)", outline: "none", fontSize: 13 }} />
            <button type="submit" disabled={loading} className="btn primary"
              style={{ padding: "0 14px", height: 40, opacity: loading ? 0.5 : 1 }}>
              <Icon name="arrow-up" size={14} />
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </AIPanelContext.Provider>
  );
};

window.groqChat  = groqChat;
window.getGroqKey = getGroqKey;
window.setGroqKey = setGroqKey;
window.AIPanelProvider = AIPanelProvider;
