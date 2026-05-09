// Nexus — Cloud AI Platform (Meridian identity)

const NEXUS_MODELS = [
  { id: "nexacore-72b",   name: "NexaCore-72B",        org: "VaultMind",   orgColor: "#a78bfa", badges: ["LLM","FLAGSHIP"], grad: ["#3b1f6e","#1e0e3a"], input: 8.00,  output: 24.00, ctx: "200k", new: false },
  { id: "deeprift-v3",    name: "DeepRift V3 Pro",      org: "DeepRift AI", orgColor: "#38bdf8", badges: ["LLM","HOT"],      grad: ["#0c2a3a","#0a1929"], input: 0.55,  output: 2.19,  ctx: "128k", new: false },
  { id: "luminos-flash",  name: "Luminos Flash 3.1",    org: "LuminosAI",   orgColor: "#4ade80", badges: ["LLM","FAST"],     grad: ["#0f2a1a","#071a10"], input: 0.10,  output: 0.40,  ctx: "1M",   new: false },
  { id: "opus-47",        name: "Opus 4.7",             org: "Anthropic",   orgColor: "#fb923c", badges: ["LLM"],           grad: ["#2a1500","#180d00"], input: 15.00, output: 75.00, ctx: "200k", new: false },
  { id: "gemma-4-31b",    name: "Gemma 4 31B",          org: "Google",      orgColor: "#60a5fa", badges: ["LLM","OPEN"],     grad: ["#0e1e3a","#06111f"], input: 0.14,  output: 0.40,  ctx: "128k", new: false },
  { id: "kimi-k3",        name: "Kimi K3",              org: "Moonshot",    orgColor: "#e879f9", badges: ["LLM","LONG CTX"], grad: ["#2a0a3a","#170620"], input: 2.00,  output: 6.00,  ctx: "1M",   new: true  },
  { id: "gpt-55",         name: "GPT-5.5",              org: "OpenAI",      orgColor: "#86efac", badges: ["LLM"],           grad: ["#0a1f0a","#061206"], input: 2.50,  output: 10.00, ctx: "256k", new: false },
  { id: "glm-6",          name: "GLM-6",                org: "Zhipu AI",    orgColor: "#7dd3fc", badges: ["LLM","OPEN"],     grad: ["#0a1a2a","#050e16"], input: 0.05,  output: 0.10,  ctx: "128k", new: true  },
  { id: "arclight-7b",    name: "ArcLight-7B",          org: "VaultMind",   orgColor: "#a78bfa", badges: ["LLM","FAST"],     grad: ["#1a0f3a","#0e0820"], input: 0.10,  output: 0.20,  ctx: "32k",  new: false },
  { id: "nova-super-12b", name: "NovaSynth Super 12B",  org: "NovaSynth",   orgColor: "#4ade80", badges: ["LLM"],           grad: ["#0c2a18","#06160c"], input: 0.15,  output: 0.35,  ctx: "128k", new: false },
  { id: "gemini-4-flash", name: "Gemini 4 Flash Lite",  org: "Google",      orgColor: "#60a5fa", badges: ["LLM","FAST"],     grad: ["#0e1e3a","#06111f"], input: 0.07,  output: 0.15,  ctx: "1M",   new: false },
  { id: "claude-sn-5",    name: "Claude Sonnet 5",      org: "Anthropic",   orgColor: "#fb923c", badges: ["LLM","NEW"],      grad: ["#2a1500","#180d00"], input: 3.00,  output: 15.00, ctx: "200k", new: true  },
];

const NEXUS_GPUS = [
  { id: "v520",    name: "Radeon PRO V520",  tflops: 14,   mem: 16,  cpus: 8,   price: 0.28,  spot: 0.14,  wait: 2, qty: [1,4],     spotOk: true  },
  { id: "w7500",   name: "Radeon PRO W7500", tflops: 29,   mem: 16,  cpus: 8,   price: 0.44,  spot: 0.22,  wait: 2, qty: [1,2,4,8], spotOk: true  },
  { id: "w7900",   name: "Radeon PRO W7900", tflops: 61,   mem: 48,  cpus: 16,  price: 1.49,  spot: 0.75,  wait: 2, qty: [1,2,4,8], spotOk: true  },
  { id: "mi210",   name: "Instinct MI210",   tflops: 181,  mem: 64,  cpus: 32,  price: 2.20,  spot: 1.10,  wait: 2, qty: [1,2,4,8], spotOk: true  },
  { id: "mi250",   name: "Instinct MI250",   tflops: 362,  mem: 128, cpus: 32,  price: 3.50,  spot: 1.75,  wait: 2, qty: [1,2,4,8], spotOk: true  },
  { id: "mi300a",  name: "Instinct MI300A",  tflops: 980,  mem: 128, cpus: 96,  price: 5.20,  spot: 2.60,  wait: 2, qty: [1,2,4,8], spotOk: true  },
  { id: "mi300x",  name: "Instinct MI300X",  tflops: 1307, mem: 192, cpus: 64,  price: 6.80,  spot: null,  wait: 3, qty: [1,8],     spotOk: false },
  { id: "mi350x",  name: "Instinct MI350X",  tflops: 2600, mem: 288, cpus: 128, price: 33.50, spot: null,  wait: 4, qty: [8],       spotOk: false },
];

const NEXUS_STUDIO_TYPES = [
  { id: "ai",       label: "AI Dev",         icon: "⬡", desc: "Jupyter + VS Code" },
  { id: "python",   label: "Python",          icon: "⬢", desc: "Pure compute" },
  { id: "comfy",    label: "ComfyUI",         icon: "✦", desc: "Image workflows" },
  { id: "training", label: "Training",        icon: "⬟", desc: "Distributed train" },
  { id: "infer",    label: "Inference",       icon: "▷", desc: "vLLM / TGI serve" },
];

const NEXUS_STUDIOS_MOCK = [
  { id: "st-01", name: "llama-finetune-v4",   type: "Training",   gpu: "MI250 × 4",  status: "running",  uptime: "2h 14m", cost: 24.43 },
  { id: "st-02", name: "rag-api-prod",         type: "AI Dev",     gpu: "W7900 × 1", status: "sleeping", uptime: "18m",    cost: 0.50  },
  { id: "st-03", name: "sdxl-comfyui-bench",   type: "ComfyUI",    gpu: "W7500 × 1", status: "sleeping", uptime: "—",      cost: 0.00  },
];

const NEXUS_FILTER_TABS = ["All", "VaultMind", "OpenAI", "Anthropic", "Google", "xAI"];

const NEXUS_CODE = (m) => `pip install litai\nfrom litai import LLM\nllm = LLM(model="${m.org.toLowerCase()}/${m.id}",\n          api_key="$NEXUS_API_KEY")\nprint(llm.chat("Hello!"))`;

// ── Org logo initials ──────────────────────────────────────────────────────
const OrgBadge = ({ org, color, size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.3,
    background: `color-mix(in oklch, ${color} 25%, #111)`,
    border: `1px solid color-mix(in oklch, ${color} 40%, transparent)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, color,
    fontFamily: "var(--font-mono)", flexShrink: 0,
  }}>
    {org[0]}
  </div>
);

// ── Model Card ─────────────────────────────────────────────────────────────
const NexusModelCard = ({ m, onSelect }) => {
  const code = NEXUS_CODE(m);
  return (
    <button onClick={() => onSelect(m)}
      style={{
        background: `linear-gradient(145deg, ${m.grad[0]} 0%, ${m.grad[1]} 100%)`,
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: 0, textAlign: "left", cursor: "pointer",
        overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "border-color .15s, transform .12s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = ""; }}
    >
      {/* Card header */}
      <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <OrgBadge org={m.org} color={m.orgColor} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 3 }}>
            {m.badges.map(b => (
              <span key={b} style={{
                fontSize: 9, fontWeight: 700, letterSpacing: ".06em",
                padding: "1px 5px", borderRadius: 3,
                background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-mono)",
              }}>{b}</span>
            ))}
            {m.new && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".06em", padding: "1px 5px", borderRadius: 3, background: "oklch(0.55 0.18 145 / 0.35)", color: "oklch(0.85 0.17 145)", fontFamily: "var(--font-mono)" }}>NEW</span>}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8", lineHeight: 1.2, marginBottom: 1 }}>{m.name}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{m.org}</div>
        </div>
      </div>

      {/* Code snippet */}
      <div style={{
        margin: "0 10px 10px", borderRadius: 7,
        background: "rgba(0,0,0,0.45)", padding: "8px 10px",
        fontFamily: "var(--font-mono)", fontSize: 9.5, color: "rgba(255,255,255,0.55)",
        lineHeight: 1.6, whiteSpace: "pre", overflow: "hidden",
      }}>{code}</div>

      {/* Footer */}
      <div style={{ padding: "8px 14px 12px", display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)" }}>in</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>${m.input.toFixed(2)}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>/M</span>
        <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>out</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>${m.output !== null ? m.output.toFixed(2) : "—"}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)" }}>{m.ctx} ctx</span>
      </div>
    </button>
  );
};

// ── Model Detail Modal ─────────────────────────────────────────────────────
const ModelDetailModal = ({ m, onClose }) => {
  const [tab, setTab] = React.useState("litai");
  const tabs = ["LitAI", "OpenAI Python", "Python", "TypeScript", "cURL"];
  const code = {
    LitAI: `pip install litai\nfrom litai import LLM\nllm = LLM(model="${m.org.toLowerCase()}/${m.id}",\n          api_key="sk-nexus-...")\nprint(llm.chat("Hello, world!"))`,
    "OpenAI Python": `from openai import OpenAI\nclient = OpenAI(\n  base_url="https://api.nexus.ai/v1",\n  api_key="sk-nexus-..."\n)\nres = client.chat.completions.create(\n  model="${m.id}",\n  messages=[{"role":"user","content":"Hello"}]\n)\nprint(res.choices[0].message.content)`,
    Python: `import requests\nres = requests.post("https://api.nexus.ai/v1/messages",\n  headers={"x-api-key": "sk-nexus-..."},\n  json={"model": "${m.id}", "messages": [{"role":"user","content":"Hi"}]}\n)\nprint(res.json()["content"][0]["text"])`,
    TypeScript: `import Nexus from "@nexusai/sdk";\nconst client = new Nexus({ apiKey: "sk-nexus-..." });\nconst msg = await client.messages.create({\n  model: "${m.id}",\n  messages: [{ role: "user", content: "Hello!" }]\n});\nconsole.log(msg.content);`,
    cURL: `curl -X POST https://api.nexus.ai/v1/messages \\\n  -H "x-api-key: sk-nexus-..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"${m.id}","messages":[{"role":"user","content":"Hi"}]}'`,
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, maxWidth: "95vw", maxHeight: "80vh", overflow: "auto",
        background: "var(--bg-1)", border: "1px solid var(--border)",
        borderRadius: 14, display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <OrgBadge org={m.org} color={m.orgColor} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{m.org} · {m.ctx} context</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "12px 18px 0", display: "flex", gap: 0, borderBottom: "1px solid var(--border)" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 12px", fontSize: 11.5, fontWeight: 500, background: "none", border: "none",
              cursor: "pointer", color: tab === t ? "var(--fg-0)" : "var(--fg-3)",
              borderBottom: `2px solid ${tab === t ? "var(--accent)" : "transparent"}`,
              transition: "color .15s", whiteSpace: "nowrap",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ margin: 18, background: "var(--bg-0)", borderRadius: 8, padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.7, color: "var(--fg-2)", whiteSpace: "pre-wrap" }}>
          {code[tab]}
        </div>

        <div style={{ padding: "12px 18px 18px", display: "flex", gap: 24 }}>
          {[["Input", `$${m.input}/M tok`], ["Output", m.output ? `$${m.output}/M tok` : "—"], ["Context", m.ctx]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10, color: "var(--fg-3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: ".07em" }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{v}</div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={() => { window.toast(`API key copiada para ${m.name}`); onClose(); }}>Get API Key</button>
        </div>
      </div>
    </div>
  );
};

// ── Inference tab ──────────────────────────────────────────────────────────
const NexusInferenceTab = () => {
  const [filter, setFilter] = React.useState("All");
  const [selected, setSelected] = React.useState(null);
  const [search, setSearch]   = React.useState("");

  const visible = NEXUS_MODELS.filter(m => {
    const byFilter = filter === "All" || m.org.toLowerCase().includes(filter.toLowerCase()) || (filter === "VaultMind" && m.org === "VaultMind");
    const bySearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.org.toLowerCase().includes(search.toLowerCase());
    return byFilter && bySearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      {/* Hero */}
      <div style={{ padding: "36px 28px 24px", background: "linear-gradient(180deg, var(--bg-0) 0%, transparent 100%)" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, letterSpacing: "-.02em" }}>Access any model. One API.</h2>
        <p style={{ margin: "0 0 18px", fontSize: 13.5, color: "var(--fg-3)", maxWidth: 480 }}>
          All major open and closed models — single endpoint, per-token billing. 30M free tokens on signup.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn primary" onClick={() => window.toast("API key generada: sk-nexus-demo-xxx")}>Get API Key</button>
          <button className="btn" onClick={() => window.toast("Redirigiendo a docs...")}>Explore Docs</button>
        </div>
      </div>

      {/* Filter + search bar */}
      <div style={{ padding: "0 28px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {NEXUS_FILTER_TABS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 11.5, fontWeight: 500,
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
              background: filter === f ? "var(--accent-soft)" : "transparent",
              color: filter === f ? "var(--accent)" : "var(--fg-2)",
              cursor: "pointer", transition: "all .15s",
            }}>{f}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search models…"
          style={{
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 8,
            color: "var(--fg-0)", padding: "5px 12px", fontSize: 12, outline: "none", width: 180,
          }}
        />
        <div style={{ display: "flex", gap: 2 }}>
          <button className="icon-btn" title="Grid"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="8" y="0" width="6" height="6" rx="1"/><rect x="0" y="8" width="6" height="6" rx="1"/><rect x="8" y="8" width="6" height="6" rx="1"/></svg></button>
          <button className="icon-btn" title="List"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2" rx="1"/><rect x="0" y="6" width="14" height="2" rx="1"/><rect x="0" y="11" width="14" height="2" rx="1"/></svg></button>
        </div>
      </div>

      {/* Model grid */}
      <div className="scroll-y" style={{ flex: 1, padding: "0 28px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {visible.map(m => <NexusModelCard key={m.id} m={m} onSelect={setSelected} />)}
        </div>
        {visible.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "var(--fg-3)", fontSize: 13 }}>No models match "{search}"</div>
        )}
      </div>

      {selected && <ModelDetailModal m={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

// ── New Studio Modal ───────────────────────────────────────────────────────
const NewStudioModal = ({ onClose }) => {
  const [studioType, setStudioType] = React.useState("ai");
  const [selectedGpu, setSelectedGpu] = React.useState("l40s");
  const [qty, setQty] = React.useState(1);
  const [interruptible, setInterruptible] = React.useState(true);
  const [launching, setLaunching] = React.useState(false);

  const gpu = NEXUS_GPUS.find(g => g.id === selectedGpu);
  const effectivePrice = interruptible && gpu.spot ? gpu.spot : gpu.price;
  const total = (effectivePrice * qty).toFixed(2);

  const launch = () => {
    if (!gpu.spotOk && interruptible) { window.toast("Este GPU no soporta modo interruptible"); return; }
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      onClose();
      window.toast(`Studio lanzado — ${qty}× ${gpu.name} · $${total}/hr`);
    }, 1600);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, maxWidth: "95vw", maxHeight: "88vh", overflow: "auto",
        background: "var(--bg-1)", border: "1px solid var(--border)",
        borderRadius: 16, display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>New Studio</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {/* Studio type */}
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>Studio type</div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {NEXUS_STUDIO_TYPES.map(t => (
              <button key={t.id} onClick={() => setStudioType(t.id)} style={{
                flexShrink: 0, padding: "10px 14px", borderRadius: 10, minWidth: 96,
                border: `1.5px solid ${studioType === t.id ? "var(--accent)" : "var(--border)"}`,
                background: studioType === t.id ? "var(--accent-soft)" : "var(--bg-0)",
                cursor: "pointer", textAlign: "center", transition: "border-color .15s",
              }}>
                <div style={{ fontSize: 18, marginBottom: 5 }}>{t.icon}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: studioType === t.id ? "var(--accent)" : "var(--fg-1)" }}>{t.label}</div>
                <div style={{ fontSize: 9.5, color: "var(--fg-3)", marginTop: 2 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Teamspace */}
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 8 }}>Teamspace</div>
          <select style={{
            width: "100%", background: "var(--bg-0)", border: "1px solid var(--border)",
            borderRadius: 7, color: "var(--fg-1)", padding: "7px 10px", fontSize: 12.5, outline: "none",
          }}>
            <option>helix · enterprise</option>
            <option>personal</option>
          </select>
        </div>

        {/* GPU table */}
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", flex: 1 }}>Machine</div>
            <span style={{ fontSize: 11, color: "var(--fg-2)" }}>Interruptible</span>
            <button onClick={() => setInterruptible(v => !v)} style={{
              width: 32, height: 18, borderRadius: 9, border: "none", cursor: "pointer",
              background: interruptible ? "var(--accent)" : "var(--bg-3)", position: "relative", transition: "background .2s",
            }}>
              <span style={{ position: "absolute", top: 2, left: interruptible ? 16 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left .2s", display: "block" }} />
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px 80px 60px 110px 80px", padding: "5px 10px", fontSize: 9.5, color: "var(--fg-3)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: "1px solid var(--border-subtle)" }}>
            <div>Quantity</div><div>Model</div><div>TFLOPs</div><div>Mem (GB)</div><div>CPUs</div><div>Cost/hr</div><div>Wait</div>
          </div>

          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {NEXUS_GPUS.map(g => {
              const active = selectedGpu === g.id;
              const effP = interruptible && g.spot ? g.spot : g.price;
              const availQty = g.qty;
              return (
                <div key={g.id} onClick={() => { setSelectedGpu(g.id); setQty(availQty[0]); }} style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 80px 80px 60px 110px 80px",
                  padding: "7px 10px", cursor: "pointer", alignItems: "center",
                  background: active ? "var(--accent-soft)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                  borderBottom: "1px solid var(--border-subtle)", transition: "background .1s",
                }}>
                  {/* Qty buttons */}
                  <div style={{ display: "flex", gap: 3 }}>
                    {availQty.map(q => (
                      <button key={q} onClick={e => { e.stopPropagation(); setSelectedGpu(g.id); setQty(q); }} style={{
                        width: 20, height: 20, borderRadius: 4, border: `1px solid ${active && qty === q ? "var(--accent)" : "var(--border)"}`,
                        background: active && qty === q ? "var(--accent)" : "var(--bg-2)",
                        color: active && qty === q ? "var(--accent-fg)" : "var(--fg-2)",
                        cursor: "pointer", fontSize: 10, fontWeight: 600, padding: 0,
                      }}>{q}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: active ? 600 : 400, color: active ? "var(--fg-0)" : "var(--fg-1)" }}>{g.name}</div>
                  <div style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-2)" }}>{g.tflops}</div>
                  <div style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-2)" }}>{g.mem}</div>
                  <div style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-2)" }}>{g.cpus}</div>
                  <div style={{ fontSize: 11.5 }}>
                    {interruptible && g.spot
                      ? <><span style={{ textDecoration: "line-through", color: "var(--fg-3)", marginRight: 4 }}>${g.price.toFixed(2)}</span><span style={{ color: "oklch(0.78 0.14 145)", fontWeight: 600 }}>${g.spot.toFixed(2)}</span></>
                      : <span style={{ fontWeight: 600 }}>${g.price.toFixed(2)}</span>
                    }
                    {!g.spotOk && interruptible && <span style={{ fontSize: 9.5, color: "var(--amber)", marginLeft: 4 }}>⚠</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{g.wait} min</span>
                    <span style={{ fontSize: 10, color: "var(--fg-3)" }}>▾</span>
                  </div>
                </div>
              );
            })}
          </div>

          {interruptible && <div style={{ fontSize: 10.5, color: "var(--amber)", padding: "8px 0 0", display: "flex", alignItems: "center", gap: 5 }}>⚠ Interruptible machines are 50–80% cheaper but may experience data loss</div>}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--fg-3)", marginBottom: 2 }}>Estimated cost</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-mono)" }}>${total}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--fg-3)" }}>/hr</span></div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={launch} disabled={launching}>
            {launching ? "Launching…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Studios tab ────────────────────────────────────────────────────────────
const NexusStudiosTab = () => {
  const [showNew, setShowNew] = React.useState(false);

  const statusColor = { running: "var(--status-progress)", sleeping: "var(--fg-3)", stopped: "var(--rose)" };

  return (
    <div style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Studios</h3>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--fg-3)" }}>Cloud development environments with GPU access</p>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn primary" onClick={() => setShowNew(true)}>+ New Studio</button>
      </div>

      {/* Active studios */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {NEXUS_STUDIOS_MOCK.map(s => (
          <div key={s.id} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[s.status], flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{s.type} · {s.gpu}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "var(--fg-3)" }}>
              <div className="mono">{s.uptime}</div>
              <div style={{ color: s.cost > 0 ? "var(--fg-1)" : "var(--fg-3)" }} className="mono">${s.cost.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn ghost sm" onClick={() => window.toast(`Abriendo ${s.name}…`)}>Open</button>
              <button className="btn ghost sm" onClick={() => window.toast(`${s.name} detenido`)} style={{ color: "var(--rose)" }}>Stop</button>
            </div>
          </div>
        ))}
      </div>

      {/* GPU pricing table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ fontSize: 13 }}>Available GPUs</strong>
          <span className="chip" style={{ color: "oklch(0.78 0.14 145)" }}>Interruptible prices shown</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["GPU","TFLOPs","VRAM","CPUs","On-demand","Interruptible","Availability"].map(h => (
                  <th key={h} style={{ padding: "7px 14px", textAlign: "left", fontSize: 10, color: "var(--fg-3)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEXUS_GPUS.map(g => (
                <tr key={g.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "9px 14px", fontWeight: 600 }}>{g.name}</td>
                  <td style={{ padding: "9px 14px", fontFamily: "var(--font-mono)" }}>{g.tflops}</td>
                  <td style={{ padding: "9px 14px", fontFamily: "var(--font-mono)" }}>{g.mem} GB</td>
                  <td style={{ padding: "9px 14px", fontFamily: "var(--font-mono)" }}>{g.cpus}</td>
                  <td style={{ padding: "9px 14px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>${g.price.toFixed(2)}/hr</td>
                  <td style={{ padding: "9px 14px" }}>
                    {g.spot ? <span style={{ color: "oklch(0.78 0.14 145)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>${g.spot.toFixed(2)}/hr</span>
                             : <span style={{ color: "var(--fg-3)", fontSize: 11 }}>N/A</span>}
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    {g.spotOk
                      ? <span style={{ color: "oklch(0.78 0.14 145)", fontSize: 11 }}>● Available</span>
                      : <span style={{ color: "var(--amber)", fontSize: 11 }}>⚠ Limited</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <NewStudioModal onClose={() => setShowNew(false)} />}
    </div>
  );
};

// ── Platform tab ───────────────────────────────────────────────────────────
const NexusPlatformTab = () => {
  const [keyVisible, setKeyVisible] = React.useState(false);
  const apiKey = "sk-nexus-4f8a2b...c93e";
  const usage = [
    { model: "NexaCore-72B", tokens: "1.24M", cost: 9.92 },
    { model: "ArcLight-7B",  tokens: "4.80M", cost: 0.48 },
    { model: "Luminos Flash",tokens: "2.10M", cost: 0.21 },
  ];
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* API Keys */}
        <div className="card" style={{ padding: 18 }}>
          <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>API Keys</strong>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg-0)", borderRadius: 7, border: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, flex: 1, color: "var(--fg-2)" }}>
              {keyVisible ? "sk-nexus-4f8a2b-demo-xxxc93e" : apiKey}
            </span>
            <button className="btn ghost sm" onClick={() => setKeyVisible(v => !v)}>{keyVisible ? "Hide" : "Show"}</button>
            <button className="btn ghost sm" onClick={() => window.toast("Key copiada")}>Copy</button>
          </div>
          <button className="btn sm" style={{ marginTop: 10, width: "100%" }} onClick={() => window.toast("Nueva API key generada")}>+ Generate new key</button>
        </div>

        {/* Billing */}
        <div className="card" style={{ padding: 18 }}>
          <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Billing — May 2026</strong>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono)" }}>$10.61</span>
            <span style={{ fontSize: 12, color: "var(--fg-3)" }}>/ $50.00 limit</span>
          </div>
          <div style={{ height: 6, background: "var(--bg-3)", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ width: "21%", height: "100%", background: "var(--accent)", borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)" }}>30M free tokens remaining · Renews Jun 1</div>
        </div>
      </div>

      {/* Usage table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: 13 }}>Usage this month</strong>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Model","Tokens","Cost"].map(h => (
                <th key={h} style={{ padding: "7px 16px", textAlign: "left", fontSize: 10, color: "var(--fg-3)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usage.map(u => (
              <tr key={u.model} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 500 }}>{u.model}</td>
                <td style={{ padding: "9px 16px", fontFamily: "var(--font-mono)" }}>{u.tokens}</td>
                <td style={{ padding: "9px 16px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>${u.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Main Nexus view ────────────────────────────────────────────────────────
const NexusView = () => {
  const [tab, setTab] = React.useState("inference");

  const tabs = [
    { id: "inference", label: "Inference" },
    { id: "studios",   label: "Studios"   },
    { id: "platform",  label: "Platform"  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
      {/* Internal top nav */}
      <div style={{
        height: 44, display: "flex", alignItems: "center", gap: 2,
        padding: "0 28px", borderBottom: "1px solid var(--border)",
        background: "var(--bg-1)", flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginRight: 20, letterSpacing: "-.01em" }}>Nexus</div>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 14px", fontSize: 13, fontWeight: 500, background: "none", border: "none",
            cursor: "pointer", borderRadius: 6,
            color: tab === t.id ? "var(--fg-0)" : "var(--fg-3)",
            background: tab === t.id ? "var(--bg-2)" : "transparent",
            transition: "color .15s, background .15s",
          }}>{t.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn ghost sm" onClick={() => window.openAI("What are the best models available in Nexus for fast inference?", "compute", { models: NEXUS_MODELS })}>
          <Icon name="sparkle" size={13} /> AI Summary
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {tab === "inference" && <NexusInferenceTab />}
        {tab === "studios"   && <div className="scroll-y" style={{ flex: 1 }}><NexusStudiosTab /></div>}
        {tab === "platform"  && <div className="scroll-y" style={{ flex: 1 }}><NexusPlatformTab /></div>}
      </div>
    </div>
  );
};

window.NexusView = NexusView;
