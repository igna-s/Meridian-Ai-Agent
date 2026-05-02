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
      setInput(window.chatInitialQuery);
      window.chatInitialQuery = null;
    }
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const typingId = Date.now() + 1;

    try {
      const response = await fetch('https://banking-rag-auth-api.azurewebsites.net/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          query: userMsg.text,
          session_id: activeSession
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMsg = { id: typingId, text: '', sender: 'ai', timestamp: new Date(), status: 'Starting...', steps: [] };
      setMessages(prev => [...prev, aiMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            if (data.type === 'status') {
              setMessages(prev => prev.map(msg => {
                if (msg.id === typingId) {
                  const newSteps = [...(msg.steps || []), data.content];
                  return { ...msg, status: data.content, steps: newSteps };
                }
                return msg;
              }));
            } else if (data.type === 'answer') {
              setMessages(prev => prev.map(msg =>
                msg.id === typingId ? {
                  ...msg,
                  text: data.response,
                  status: null,
                  steps: data.reasoning_data?.steps || msg.steps || []
                } : msg
              ));
              if (!activeSession && data.session_id) {
                setActiveSession(data.session_id);
              }
            } else if (data.type === 'error') {
              const safeError = 'Hubo un problema al procesar tu solicitud.';
              setMessages(prev => prev.map(msg =>
                msg.id === typingId ? { ...msg, text: safeError, status: null } : msg
              ));
            }
          } catch (e) {
            console.error("JSON Parse Error", e);
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = {
        id: Date.now() + 2,
        text: 'Lo siento, hubo un error de conexión.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setMessages(prev => prev.map(msg =>
        msg.id === typingId && msg.status ? { ...msg, status: null } : msg
      ));
    }
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
        </div>
        <div className="topbar-spacer" />
        <button className="btn sm ghost" onClick={() => { setMessages([]); setActiveSession(null); }}>
          <Icon name="plus" size={12} /> New Chat
        </button>
      </div>

      <div className="scroll-y flex col flex-1" ref={scrollRef} style={{ padding: "24px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 100, color: 'var(--fg-3)' }}>
              <Icon name="sparkle" size={32} style={{ opacity: 0.5, marginBottom: 16, display: 'inline-block' }} />
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--fg-1)' }}>How can I help you today?</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Ask me about your projects, issues, or code.</div>
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
