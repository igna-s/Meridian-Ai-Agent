const ReasoningSteps = ({ steps, status }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const bottomRef = React.useRef(null);
  const stepsArray = steps || [];

  React.useEffect(() => {
    if (isExpanded && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stepsArray.length, isExpanded]);

  const getLatestText = () => {
    if (stepsArray.length > 0) {
      const lastStep = stepsArray[stepsArray.length - 1];
      return typeof lastStep === 'object' ? (lastStep.content || lastStep.status || lastStep.thought) : lastStep;
    }
    return status || 'Processing...';
  };

  return (
    <div className="flex col gap-8 mb-8" style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}
         onClick={() => setIsExpanded(!isExpanded)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {status ? <Icon name="bolt" size={12} style={{ color: 'var(--accent)' }} /> : <Icon name="check" size={12} style={{ color: 'var(--status-done)' }} />}
          <span className="mono muted-2" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Reasoning Process {stepsArray.length > 0 ? `(${stepsArray.length})` : ''}
          </span>
        </div>
        {stepsArray.length > 0 && (
          <span className="mono muted-2" style={{ fontSize: 10 }}>{isExpanded ? 'Collapse' : 'Expand'}</span>
        )}
      </div>

      {isExpanded && stepsArray.length > 0 ? (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stepsArray.map((step, idx) => {
            const stepText = typeof step === 'object' ? (step.content || step.status || step.thought || JSON.stringify(step)) : step;
            return (
              <div key={idx} className="flex gap-8" style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-2)', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--fg-3)', width: 16, textAlign: 'right', flexShrink: 0 }}>{idx + 1}</span>
                <span style={{ flex: 1 }}>{stepText}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="flex gap-8" style={{ marginTop: 4, fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-2)' }}>
          <span style={{ color: 'var(--fg-3)', width: 16, textAlign: 'right' }}>{stepsArray.length > 0 ? '>' : ''}</span>
          <span className="truncate" style={{ fontStyle: 'italic' }}>{getLatestText()}</span>
        </div>
      )}
    </div>
  );
};

const ChatView = () => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [activeSession, setActiveSession] = React.useState(null);

  const scrollRef = React.useRef(null);
  const token = localStorage.getItem('meridian-token');

  // Check for initial query if coming from Command Palette
  React.useEffect(() => {
    if (window.chatInitialQuery) {
      const q = window.chatInitialQuery;
      window.chatInitialQuery = null;
      // Small delay so the view is mounted
      setTimeout(() => sendMessage(q), 50);
    }
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    if (isTyping) return;

    const userMsg = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    const typingId = Date.now() + 1;

    const thinkingMsg = { id: typingId, text: '', sender: 'ai', timestamp: new Date(), status: 'Thinking...', steps: [] };
    setMessages(prev => [...prev, thinkingMsg]);

    const liveSteps = [
      'Parsing query...', 'Searching issues and PRs...',
      'Cross-referencing sprint data...', 'Analyzing team and roadmap...', 'Composing response...',
    ];
    let stepIdx = 0;
    const stepTimer = setInterval(() => {
      if (stepIdx < liveSteps.length) {
        const step = liveSteps[stepIdx++];
        setMessages(prev => prev.map(msg =>
          msg.id === typingId ? { ...msg, steps: [...(msg.steps || []), step] } : msg
        ));
      } else { clearInterval(stepTimer); }
    }, 320);

    try {
      const key = window.getAmdUrl ? window.getAmdUrl() : '';
      if (!key) throw new Error('AMD_URL_NOT_SET');

      const history = messages.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })).filter(m => m.content);

      clearInterval(stepTimer);

      // Gather workspace context for the AI
      const workspaceData = {
        issues: window.ISSUES || [],
        prs: window.PRS || [],
        projects: window.PROJECTS || [],
        people: window.PEOPLE || []
      };
      // Keep it somewhat brief to avoid token limits, send top items
      const trimmedData = {
        issues: workspaceData.issues.slice(0, 40),
        prs: workspaceData.prs.slice(0, 20),
        projects: workspaceData.projects.slice(0, 10),
      };
      const contextBlock = `\n\n--- LIVE WORKSPACE DATA ---\n${JSON.stringify(trimmedData, null, 2)}\n--- END DATA ---`;
      const systemPrompt = 'You are VaultMind AI, the intelligent assistant for Meridian — a modern project management platform. You help engineering teams with issues, PRs, sprints, roadmap, docs, and compute jobs. Be concise, insightful, and proactive. Use markdown formatting.' + contextBlock;

      // Stream from AMD
      const res = await fetch(key, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer dummy-key` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1024,
          stream: true,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: text },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `AMD HTTP ${res.status}`);
      }

      // Read stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      setMessages(prev => prev.map(msg =>
        msg.id === typingId ? { ...msg, status: null, steps: liveSteps, text: '' } : msg
      ));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete chunk
        
        for (const line of lines) {
          const l = line.trim();
          if (l.startsWith('data: ') && l !== 'data: [DONE]') {
            try {
              const data = JSON.parse(l.slice(6));
              let delta = data.choices?.[0]?.delta?.content || '';
              if (delta) {
                // Fix tokenizer artifacts for Llama/BPE
                delta = delta.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ď/g, "'").replace(/č/g, "c");
                fullText += delta;
                setMessages(prev => prev.map(msg =>
                  msg.id === typingId ? { ...msg, text: fullText } : msg
                ));
              }
            } catch (_) {}
          }
        }
      }

      setMessages(prev => prev.map(msg =>
        msg.id === typingId ? { ...msg, text: fullText, status: null, steps: liveSteps } : msg
      ));

    } catch (error) {
      clearInterval(stepTimer);
      console.error('Chat Error:', error);
      const errText = error.message === 'AMD_URL_NOT_SET'
        ? '⚠ No hay endpoint AMD configurado. Andá a **Settings → AI & Integrations** y pegá la URL de tu instancia AMD.'
        : `⚠ ${error.message}`;
      setMessages(prev => prev.map(msg =>
        msg.id === typingId ? { ...msg, text: errText, status: null } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const renderMarkdown = (text) => {
    if (!window.marked) return { __html: text };
    return { __html: window.marked.parse(text) };
  };

  return (
    <div className="flex col flex-1" style={{ minWidth: 0, height: '100%' }}>
      <div className="page-header">
        <div className="page-title">
          <Icon name="sparkle" size={16} style={{ color: 'var(--accent)' }} />
          <span>VaultMind AI</span>
          <span className="chip mono" style={{ fontSize: 10, padding: '2px 7px', color: 'var(--amber)', borderColor: 'var(--amber)', opacity: 0.8 }}>demo</span>
        </div>
        <div className="topbar-spacer" />
        <button className="btn sm ghost" onClick={() => { setMessages([]); setActiveSession(null); }}>
          <Icon name="plus" size={12} /> New Chat
        </button>
      </div>

      <div className="scroll-y flex col flex-1" ref={scrollRef} style={{ padding: "24px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
              <Icon name="sparkle" size={32} style={{ opacity: 0.5, marginBottom: 16, color: 'var(--accent)' }} />
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--fg-0)', marginBottom: 6 }}>How can I help you today?</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 32 }}>Ask me about your projects, issues, PRs, or team.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
                {[
                  { icon: 'sprint',   text: "What's the status of Iteration 42?" },
                  { icon: 'issues',   text: "What's blocking the team right now?" },
                  { icon: 'pr',       text: "Which PRs need attention?" },
                  { icon: 'team',     text: "Who has capacity for new work?" },
                  { icon: 'roadmap',  text: "Which milestones are at risk this quarter?" },
                  { icon: 'sparkle',  text: "Give me today's standup brief" },
                ].map((p, i) => (
                  <button key={i} onClick={() => { if (!isTyping) sendMessage(p.text); }}
                    style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-1)', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--fg-1)', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-dim)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <Icon name={p.icon} size={14} style={{ color: 'var(--fg-3)', marginTop: 1, flexShrink: 0 }} />
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', gap: 16, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {msg.sender === 'user' ? <Icon name="team" size={16} style={{ color: '#000' }} /> : <Icon name="sparkle" size={16} style={{ color: 'var(--accent)' }} />}
                </div>
                <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: 12, background: msg.sender === 'user' ? 'var(--accent-dim)' : 'var(--bg-1)', border: msg.sender === 'user' ? 'none' : '1px solid var(--border)', borderTopRightRadius: msg.sender === 'user' ? 2 : 12, borderTopLeftRadius: msg.sender === 'user' ? 12 : 2 }}>

                  {(msg.steps?.length > 0 || msg.status) && (
                    <ReasoningSteps steps={msg.steps || []} status={msg.status} />
                  )}

                  {!msg.status && msg.text && (
                    <div
                      className="markdown-body"
                      style={{ fontSize: 14, lineHeight: 1.5, color: msg.sender === 'user' ? 'var(--fg-0)' : 'var(--fg-1)' }}
                      dangerouslySetInnerHTML={renderMarkdown(msg.text)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border)", background: "var(--bg-0)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", position: 'relative' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask VaultMind AI..."
              style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-1)", color: "var(--fg-0)", outline: "none", fontSize: 14 }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn primary"
              style={{ padding: "0 20px", height: 43, opacity: (!input.trim() || isTyping) ? 0.5 : 1 }}
            >
              <Icon name="arrow-up" size={16} />
            </button>
          </form>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-3)', marginTop: 8 }}>
            VaultMind AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
};

window.ChatView = ChatView;
