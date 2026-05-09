// AI Marketplace — Studios, Model APIs, Storage, Templates

const STUDIO_GPU_TABLE = [
  { id: "v520",  name: "V520",     speed: 18,   mem: 8,   cpus: 8,   priceHr: 0.29, spot: 0.15,  wait: 2, avail: true },
  { id: "v620",  name: "V620",     speed: 105,  mem: 32,  cpus: 8,   priceHr: 0.53, spot: 0.27,  wait: 2, avail: true },
  { id: "w7800", name: "W7800",    speed: 89,   mem: 32,  cpus: 16,  priceHr: 1.67, spot: 0.84,  wait: 2, avail: true },
  { id: "w7900", name: "W7900",    speed: 123,  mem: 48,  cpus: 48,  priceHr: 1.43, spot: 0.72,  wait: 2, avail: true },
  { id: "mi210", name: "MI210",    speed: 181,  mem: 64,  cpus: 30,  priceHr: 3.06, spot: 1.53,  wait: 2, avail: true },
  { id: "mi250x",name: "MI250X",   speed: 383,  mem: 128, cpus: 26,  priceHr: 5.17, spot: 2.59,  wait: 2, avail: true },
  { id: "mi300a",name: "MI300A",   speed: 3800, mem: 128, cpus: 16,  priceHr: 6.99, spot: null,  wait: 3, avail: false },
  { id: "mi300x",name: "MI300X",   speed: 10496,mem: 192, cpus: 224, priceHr: 35.91, spot: null, wait: 4, avail: true },
];

const STUDIO_TYPES = [
  { id: "ai-dev",   label: "AI development", icon: "code",      desc: "Jupyter + VS Code + GPU access" },
  { id: "python",   label: "Python",          icon: "sprint",    desc: "Pure compute environment" },
  { id: "comfy",    label: "ComfyUI",         icon: "component", desc: "Image & video gen workflows" },
  { id: "training", label: "Training run",    icon: "bolt",      desc: "Distributed model training" },
  { id: "inference",label: "Inference server",icon: "play",      desc: "vLLM / TGI serving endpoint" },
];

const GPU_QTY = [1, 2, 4, 8];

const LLM_MODELS = [
  { id: "nexacore-72b",     name: "NexaCore-72B",       provider: "VaultMind Labs", category: "reasoning",  ctx: "128k", inputPrice: 8.00,  outputPrice: 24.00, badge: "FLAGSHIP",  badgeC: "var(--accent)",            latency: "~2.1s",  features: ["Chain-of-thought","Code interpreter","Function calling","JSON mode"] },
  { id: "vaultmind-34b",    name: "VaultMind-34B",      provider: "VaultMind Labs", category: "general",    ctx: "64k",  inputPrice: 2.00,  outputPrice: 6.00,  badge: "POPULAR",   badgeC: "oklch(0.78 0.13 220)",    latency: "~0.8s",  features: ["Function calling","JSON mode","Streaming"] },
  { id: "arclight-7b",      name: "ArcLight-7B",        provider: "VaultMind Labs", category: "fast",       ctx: "32k",  inputPrice: 0.20,  outputPrice: 0.40,  badge: "FAST",      badgeC: "oklch(0.80 0.14 75)",     latency: "~0.15s", features: ["Ultra-low latency","High throughput"] },
  { id: "deepchroma-vis",   name: "DeepChroma Vision",  provider: "ChromaAI",       category: "multimodal", ctx: "32k",  inputPrice: 3.50,  outputPrice: 10.50, badge: "VISION",    badgeC: "oklch(0.72 0.18 300)",    latency: "~1.4s",  features: ["Image input","Document parsing","OCR","Chart analysis"] },
  { id: "sonartext-embed",  name: "SonarText Embed",    provider: "SonarAI",        category: "embedding",  ctx: "8k",   inputPrice: 0.02,  outputPrice: null,  badge: "EMBED",     badgeC: "oklch(0.78 0.13 220)",    latency: "~40ms",  features: ["1536-dim vectors","Batch API","MTEB top-5"] },
  { id: "novasynth-audio",  name: "NovaSynth Audio",    provider: "NovaSynth",      category: "audio",      ctx: "—",    inputPrice: 0.006, outputPrice: null,  badge: "AUDIO",     badgeC: "oklch(0.72 0.17 20)",     latency: "~200ms", features: ["ASR","Diarization","Translation","Timestamps"] },
];

const STORAGE_PLANS = [
  { id: "obj",   name: "Object Storage",   priceGb: 0.022, iops: "—",    throughput: "Up to 2 GB/s",  features: ["S3-compatible API","Multi-region replication","Lifecycle rules","Versioning"] },
  { id: "ssd",   name: "SSD Block",        priceGb: 0.08,  iops: "50k",  throughput: "Up to 8 GB/s",  features: ["NFS / iSCSI mount","Snapshots","Low latency","Resize online"] },
  { id: "nvme",  name: "NVMe Ultra",       priceGb: 0.18,  iops: "500k", throughput: "Up to 30 GB/s", features: ["Direct attach","Sub-100µs latency","Ideal for training","Non-volatile"] },
];

const TEMPLATES = [
  { id: "llm-ft",    name: "LLM Fine-tuning",       gpu: "MI210 64 GB", icon: "sprint",    tags: ["PyTorch","LoRA","HuggingFace"],  desc: "LoRA / QLoRA fine-tuning with Accelerate & Transformers." },
  { id: "rag",       name: "RAG Pipeline",           gpu: "W7800",       icon: "database",  tags: ["LangChain","pgvector","FastAPI"], desc: "Vector store + retrieval-augmented generation ready to deploy." },
  { id: "sdxl",      name: "Stable Diffusion XL",   gpu: "W7900",   icon: "star",      tags: ["Diffusers","ComfyUI","LoRA"],     desc: "SDXL inference + LoRA training environment pre-configured." },
  { id: "whisper",   name: "Whisper Transcription",  gpu: "V520",         icon: "message",   tags: ["Whisper","FastAPI","Batch"],      desc: "Large-v3 Whisper for batch audio transcription at scale." },
  { id: "vision",    name: "Vision Classifier",      gpu: "V620",         icon: "eye",       tags: ["torchvision","ViT","W&B"],        desc: "EfficientNet / ViT training with Weights & Biases logging." },
  { id: "embed-srv", name: "Embedding Server",       gpu: "V520",         icon: "component", tags: ["vLLM","FastAPI","Redis"],         desc: "Deploy your own embedding model with vLLM + FastAPI caching." },
];

// ---- Studios Tab ----
const StudiosTab = () => {
  const [studioType, setStudioType]   = React.useState("ai-dev");
  const [selectedGpu, setSelectedGpu] = React.useState("w7800");
  const [qty, setQty]                 = React.useState(1);
  const [interruptible, setInterruptible] = React.useState(true);
  const [mode, setMode]               = React.useState("gpu");
  const [launching, setLaunching]     = React.useState(false);

  const gpu = STUDIO_GPU_TABLE.find(g => g.id === selectedGpu) || STUDIO_GPU_TABLE[2];
  const effectivePrice = interruptible && gpu.spot ? gpu.spot : gpu.priceHr;
  const totalHr = (effectivePrice * qty).toFixed(2);

  const launch = () => {
    if (!gpu.avail) { window.toast("GPU unavailable as interruptible"); return; }
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      window.toast(`Studio launched — ${qty}× ${gpu.name} · $${totalHr}/hr`);
    }, 1600);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Studio type */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 12 }}>Studio type</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            {STUDIO_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setStudioType(t.id)}
                style={{
                  flexShrink: 0, padding: "12px 16px", borderRadius: 10,
                  border: `1.5px solid ${studioType === t.id ? "var(--accent)" : "var(--border)"}`,
                  background: studioType === t.id ? "var(--accent-soft)" : "var(--bg-1)",
                  cursor: "pointer", textAlign: "center", minWidth: 120,
                  transition: "border-color .15s, background .15s",
                }}
              >
                <Icon name={t.icon} size={18} style={{ color: studioType === t.id ? "var(--accent)" : "var(--fg-2)", marginBottom: 6, display: "block", margin: "0 auto 8px" }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: studioType === t.id ? "var(--fg-0)" : "var(--fg-1)" }}>{t.label}</div>
                <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 3 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Machine grid */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", flex: 1 }}>Machine</div>
            <div className="segmented">
              <button className={mode === "cpu" ? "on" : ""} onClick={() => setMode("cpu")}>CPU</button>
              <button className={mode === "gpu" ? "on" : ""} onClick={() => setMode("gpu")}>GPU</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11.5, color: "var(--fg-2)" }}>Interruptible</span>
              <button
                onClick={() => setInterruptible(v => !v)}
                style={{
                  width: 32, height: 18, borderRadius: 9, border: "none", cursor: "pointer",
                  background: interruptible ? "var(--accent)" : "var(--bg-3)",
                  position: "relative", transition: "background .2s", flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute", top: 2, left: interruptible ? 16 : 2,
                  width: 14, height: 14, borderRadius: "50%", background: "#fff",
                  transition: "left .2s", display: "block",
                }} />
              </button>
            </div>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 90px 70px 130px 80px", padding: "6px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: 10.5, color: "var(--fg-3)", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>
            <span>Qty</span><span>Model</span><span>Speed (TFLOPs)</span><span>Memory (GB)</span><span>CPUs</span><span>Cost (/hour)</span><span>Wait (min)</span>
          </div>

          {STUDIO_GPU_TABLE.map(g => {
            const sel = selectedGpu === g.id;
            const effectiveP = interruptible && g.spot ? g.spot : g.priceHr;
            return (
              <div
                key={g.id}
                onClick={() => { if (!(!g.avail && interruptible)) setSelectedGpu(g.id); }}
                style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 100px 90px 70px 130px 80px",
                  padding: "9px 16px", borderBottom: "1px solid var(--border-subtle)",
                  background: sel ? "var(--accent-soft)" : "transparent",
                  cursor: (!g.avail && interruptible) ? "not-allowed" : "pointer",
                  opacity: (!g.avail && interruptible) ? 0.45 : 1,
                  transition: "background .12s",
                  alignItems: "center",
                }}
              >
                {/* Qty buttons */}
                <div style={{ display: "flex", gap: 3 }}>
                  {GPU_QTY.map(n => (
                    <button
                      key={n}
                      onClick={e => { e.stopPropagation(); setSelectedGpu(g.id); setQty(n); }}
                      style={{
                        width: 16, height: 16, fontSize: 9, borderRadius: 3, border: "none",
                        background: sel && qty === n ? "var(--accent)" : "var(--bg-3)",
                        color: sel && qty === n ? "var(--accent-fg)" : "var(--fg-2)",
                        cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >{n}</button>
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? "var(--fg-0)" : "var(--fg-1)" }}>{g.name}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{g.speed.toLocaleString()}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{g.mem}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{g.cpus}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {interruptible && g.spot && (
                    <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)", textDecoration: "line-through" }}>${g.priceHr.toFixed(2)}</span>
                  )}
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: sel ? "var(--accent)" : "var(--fg-0)" }}>
                    ${(effectiveP * qty).toFixed(2)}
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {!g.avail && interruptible
                    ? <span style={{ fontSize: 10.5, color: "oklch(0.80 0.14 75)" }}>⚠ Unavailable</span>
                    : <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{g.wait} min</span>
                  }
                </span>
              </div>
            );
          })}

          <div style={{ padding: "8px 16px", fontSize: 10.5, color: "var(--fg-3)" }}>
            ⚡ Interruptible machines are 40–60% cheaper but may experience data loss on preemption.
          </div>
        </div>
      </div>

      {/* Right — summary + launch */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 14 }}>Teamspace</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "var(--bg-0)", border: "1px solid var(--border)", borderRadius: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, flex: 1 }}>model-performance-assessment-project</span>
            <Icon name="chevron-down" size={13} style={{ color: "var(--fg-3)" }} />
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Summary</strong>
          <div className="divider" />
          {[
            { label: "Studio type", value: STUDIO_TYPES.find(t => t.id === studioType)?.label },
            { label: "Machine",     value: `${qty}× ${gpu.name}` },
            { label: "Memory",      value: `${gpu.mem * qty} GB` },
            { label: "CPUs",        value: gpu.cpus * qty },
            { label: "Mode",        value: interruptible && gpu.spot ? "Interruptible" : "On-demand" },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between" style={{ padding: "5px 0", fontSize: 12.5 }}>
              <span className="muted">{r.label}</span>
              <span className="mono" style={{ fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="flex items-center justify-between" style={{ padding: "6px 0" }}>
            <span style={{ fontSize: 13 }}>Rate</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              ${totalHr}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--fg-3)" }}>/hr</span>
            </span>
          </div>
          {interruptible && gpu.spot && (
            <div className="mono muted-2" style={{ fontSize: 10.5, marginTop: 2 }}>
              Saved ${((gpu.priceHr - gpu.spot) * qty).toFixed(2)}/hr vs on-demand
            </div>
          )}
        </div>

        <button
          className="btn primary"
          style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 600, opacity: launching ? 0.6 : 1 }}
          onClick={launch}
          disabled={launching}
        >
          {launching
            ? <><Icon name="clock" size={14} /> Starting studio…</>
            : <><Icon name="bolt" size={14} /> Launch studio</>
          }
        </button>

        <div className="card" style={{ padding: 14 }}>
          <div className="muted-2 mono" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Live availability</div>
          {[
            { label: "MI300X",  slots: 2 },
            { label: "MI250X",  slots: 8 },
            { label: "W7800",      slots: 11 },
            { label: "W7900",  slots: 5 },
            { label: "V520",        slots: 24 },
          ].map(a => (
            <div key={a.label} className="flex items-center justify-between" style={{ fontSize: 11.5, padding: "3px 0" }}>
              <span className="mono">{a.label}</span>
              <span style={{ color: a.slots > 8 ? "var(--accent)" : a.slots > 2 ? "oklch(0.80 0.14 75)" : "oklch(0.72 0.17 20)" }}>
                {a.slots} free
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Model APIs Tab ----
const ModelAPIsTab = () => {
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [activeModel, setActiveModel]       = React.useState(null);
  const [testInput, setTestInput]           = React.useState("Explain transformer attention in 2 sentences.");
  const [testRunning, setTestRunning]       = React.useState(false);
  const [testOutput, setTestOutput]         = React.useState("");

  const categories = ["all", "reasoning", "general", "fast", "multimodal", "embedding", "audio"];
  const filtered = categoryFilter === "all" ? LLM_MODELS : LLM_MODELS.filter(m => m.category === categoryFilter);

  const runTest = () => {
    if (!testInput.trim()) return;
    setTestRunning(true);
    setTestOutput("");
    const responses = [
      "Transformer attention computes a weighted sum over all input tokens, where weights are derived from dot-product similarity between query and key vectors. This allows the model to dynamically focus on the most relevant parts of the sequence regardless of distance.",
      "Attention mechanisms let each token in a sequence selectively attend to all other tokens by computing compatibility scores scaled by the square root of the key dimension. The result is a context-aware representation that enables long-range dependency modeling.",
    ];
    const resp = responses[Math.floor(Math.random() * responses.length)];
    let i = 0;
    const iv = setInterval(() => {
      setTestOutput(resp.slice(0, i));
      i += 3;
      if (i > resp.length) { clearInterval(iv); setTestRunning(false); }
    }, 18);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Category filter */}
        <div className="flex items-center gap-8" style={{ flexWrap: "wrap" }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: `1.5px solid ${categoryFilter === c ? "var(--accent)" : "var(--border)"}`,
                background: categoryFilter === c ? "var(--accent-soft)" : "var(--bg-1)",
                color: categoryFilter === c ? "var(--accent)" : "var(--fg-1)",
                cursor: "pointer", textTransform: "capitalize",
              }}
            >{c}</button>
          ))}
        </div>

        {/* Model cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {filtered.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModel(activeModel?.id === m.id ? null : m)}
              style={{
                textAlign: "left", padding: 16, borderRadius: 12,
                border: `1.5px solid ${activeModel?.id === m.id ? "var(--accent)" : "var(--border)"}`,
                background: activeModel?.id === m.id ? "var(--accent-soft)" : "var(--bg-1)",
                cursor: "pointer", transition: "border-color .15s, background .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 1 }}>{m.provider}</div>
                </div>
                <span style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-mono)", fontWeight: 700,
                  background: m.badgeC + "22", color: m.badgeC,
                }}>{m.badge}</span>
              </div>

              <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginBottom: 10, lineHeight: 1.5 }}>{m.desc}</div>

              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                {m.features.map(f => (
                  <span key={f} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--bg-3)", color: "var(--fg-2)" }}>{f}</span>
                ))}
              </div>

              <div className="divider" style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5 }}>
                <div>
                  <span className="mono" style={{ fontWeight: 600, color: "var(--fg-0)" }}>${m.inputPrice.toFixed(3)}</span>
                  <span className="muted-2"> in</span>
                  {m.outputPrice && <>
                    <span className="muted-2"> · </span>
                    <span className="mono" style={{ fontWeight: 600, color: "var(--fg-0)" }}>${m.outputPrice.toFixed(2)}</span>
                    <span className="muted-2"> out</span>
                  </>}
                  <span className="muted-2"> /1M tokens</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span className="mono muted-2" style={{ fontSize: 10 }}>ctx {m.ctx}</span>
                  <span className="mono muted-2" style={{ fontSize: 10 }}>{m.latency}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right — test panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activeModel ? (
          <>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-mono)", fontWeight: 700, background: activeModel.badgeC + "22", color: activeModel.badgeC }}>{activeModel.badge}</span>
                <strong style={{ fontSize: 13 }}>{activeModel.name}</strong>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.6, marginBottom: 12 }}>{activeModel.desc}</div>
              <div className="divider" />
              {[
                { label: "Context", value: activeModel.ctx },
                { label: "Input",   value: `$${activeModel.inputPrice.toFixed(3)} /1M tokens` },
                { label: "Output",  value: activeModel.outputPrice ? `$${activeModel.outputPrice.toFixed(2)} /1M tokens` : "N/A" },
                { label: "Latency", value: activeModel.latency },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between" style={{ padding: "4px 0", fontSize: 12 }}>
                  <span className="muted">{r.label}</span>
                  <span className="mono">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 16 }}>
              <strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>Quick test</strong>
              <textarea
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                rows={3}
                style={{
                  width: "100%", resize: "vertical", padding: "8px 10px",
                  background: "var(--bg-0)", border: "1px solid var(--border)",
                  borderRadius: 7, fontSize: 12, outline: "none", boxSizing: "border-box",
                  fontFamily: "var(--font-mono)", color: "var(--fg-0)",
                }}
              />
              <button
                className="btn primary sm"
                style={{ width: "100%", marginTop: 8, opacity: testRunning ? 0.6 : 1 }}
                onClick={runTest}
                disabled={testRunning}
              >
                {testRunning ? <><Icon name="clock" size={12} /> Generating…</> : <><Icon name="play" size={12} /> Run</>}
              </button>
              {(testOutput || testRunning) && (
                <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--bg-0)", border: "1px solid var(--border-subtle)", borderRadius: 7, fontSize: 11.5, lineHeight: 1.65, minHeight: 60, fontFamily: "var(--font-mono)", color: "var(--fg-1)", whiteSpace: "pre-wrap" }}>
                  {testOutput || <span className="muted-2">…</span>}
                  {testRunning && <span style={{ animation: "pulse 1s infinite", color: "var(--accent)" }}>▍</span>}
                </div>
              )}
            </div>

            <button className="btn primary" style={{ width: "100%" }} onClick={() => window.toast(`API key created for ${activeModel.name}`)}>
              <Icon name="plus" size={13} /> Create API key
            </button>
          </>
        ) : (
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <Icon name="sparkle" size={28} style={{ color: "var(--fg-3)", marginBottom: 12 }} />
            <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>Select a model</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>Pick any model from the list to see pricing details and run a quick test.</div>
          </div>
        )}

        <div className="card" style={{ padding: 14 }}>
          <div className="muted-2 mono" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>API usage this month</div>
          {[
            { model: "VaultMind-34B", tokens: "2.4M", cost: "$4.80" },
            { model: "ArcLight-7B",   tokens: "18.1M", cost: "$3.62" },
            { model: "SonarText",     tokens: "44.2M", cost: "$0.88" },
          ].map(u => (
            <div key={u.model} className="flex items-center justify-between" style={{ fontSize: 11.5, padding: "3px 0" }}>
              <span className="truncate" style={{ flex: 1 }}>{u.model}</span>
              <span className="mono muted-2" style={{ marginRight: 8 }}>{u.tokens}</span>
              <span className="mono" style={{ color: "var(--fg-0)" }}>{u.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Storage Tab ----
const StorageTab = () => {
  const [selectedPlan, setSelectedPlan] = React.useState("obj");
  const [sizeGb, setSizeGb]             = React.useState(500);
  const plan = STORAGE_PLANS.find(p => p.id === selectedPlan);
  const monthlyCost = (plan.priceGb * sizeGb).toFixed(2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {STORAGE_PLANS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              style={{
                textAlign: "left", padding: 16, borderRadius: 12,
                border: `1.5px solid ${selectedPlan === p.id ? "var(--accent)" : "var(--border)"}`,
                background: selectedPlan === p.id ? "var(--accent-soft)" : "var(--bg-1)",
                cursor: "pointer", transition: "border-color .15s, background .15s",
              }}
            >
              <Icon name="database" size={18} style={{ color: selectedPlan === p.id ? "var(--accent)" : "var(--fg-3)", marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
                ${p.priceGb.toFixed(3)}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--fg-3)" }}>/GB/mo</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 10 }}>{p.throughput}</div>
              <div className="divider" />
              {p.features.map(f => (
                <div key={f} className="flex items-center gap-6" style={{ padding: "3px 0", fontSize: 11.5 }}>
                  <Icon name="check" size={11} style={{ color: "var(--accent)", flexShrink: 0 }} strokeWidth={2.5} />
                  <span className="muted">{f}</span>
                </div>
              ))}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 16 }}>
          <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Configure volume</strong>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 11.5, color: "var(--fg-2)", display: "block", marginBottom: 6 }}>Volume name</label>
              <input
                defaultValue="training-data-vol-1"
                style={{ width: "100%", padding: "8px 10px", background: "var(--bg-0)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 12.5, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11.5, color: "var(--fg-2)", display: "block", marginBottom: 6 }}>Region</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg-0)", border: "1px solid var(--border)", borderRadius: 7 }}>
                <span style={{ fontSize: 12.5, flex: 1 }}>US East (N. Virginia)</span>
                <Icon name="chevron-down" size={13} style={{ color: "var(--fg-3)" }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 11.5, color: "var(--fg-2)", display: "block", marginBottom: 6 }}>
              Size: <strong className="mono">{sizeGb >= 1024 ? (sizeGb / 1024).toFixed(1) + " TB" : sizeGb + " GB"}</strong>
            </label>
            <input
              type="range" min="10" max="10240" step="10" value={sizeGb}
              onChange={e => setSizeGb(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg-3)", marginTop: 2 }}>
              <span>10 GB</span><span>1 TB</span><span>10 TB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 16 }}>
          <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Estimate</strong>
          <div className="divider" />
          {[
            { label: "Plan",       value: plan.name },
            { label: "Size",       value: sizeGb >= 1024 ? (sizeGb / 1024).toFixed(1) + " TB" : sizeGb + " GB" },
            { label: "IOPS",       value: plan.iops },
            { label: "Throughput", value: plan.throughput },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between" style={{ padding: "5px 0", fontSize: 12 }}>
              <span className="muted">{r.label}</span>
              <span className="mono">{r.value}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="flex items-center justify-between" style={{ padding: "6px 0" }}>
            <span style={{ fontSize: 13 }}>Monthly cost</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>${monthlyCost}</span>
          </div>
        </div>
        <button className="btn primary" style={{ width: "100%" }} onClick={() => window.toast("Volume provisioning started")}>
          <Icon name="database" size={13} /> Create volume
        </button>
        <div className="card" style={{ padding: 14 }}>
          <div className="muted-2 mono" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Existing volumes</div>
          {[
            { name: "datasets-main",   size: "2 TB",   type: "Object",  used: 68 },
            { name: "checkpoints-v3",  size: "500 GB", type: "SSD",     used: 42 },
          ].map(v => (
            <div key={v.name} style={{ padding: "7px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{v.name}</span>
                <span className="mono muted-2" style={{ fontSize: 10 }}>{v.size} · {v.type}</span>
              </div>
              <div style={{ height: 3, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${v.used}%`, height: "100%", background: v.used > 80 ? "oklch(0.72 0.17 20)" : "var(--accent)" }} />
              </div>
              <span className="mono muted-2" style={{ fontSize: 10 }}>{v.used}% used</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Templates Tab ----
const TemplatesTab = () => {
  const [deploying, setDeploying] = React.useState(null);

  const deploy = (t) => {
    setDeploying(t.id);
    setTimeout(() => {
      setDeploying(null);
      window.toast(`Template "${t.name}" cloned — studio launching on ${t.gpu}`);
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 13, color: "var(--fg-2)" }}>
        One-click environments — pre-configured with the right GPU, framework, and starter code.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {TEMPLATES.map(t => (
          <div
            key={t.id}
            className="card"
            style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "var(--accent-soft)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon name={t.icon} size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div className="mono muted-2" style={{ fontSize: 10.5 }}>{t.gpu}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.55, flex: 1 }}>{t.desc}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {t.tags.map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "var(--bg-3)", color: "var(--fg-2)", fontFamily: "var(--font-mono)" }}>{tag}</span>
              ))}
            </div>
            <button
              className="btn sm"
              style={{ width: "100%", marginTop: 4, opacity: deploying === t.id ? 0.6 : 1 }}
              onClick={() => deploy(t)}
              disabled={deploying === t.id}
            >
              {deploying === t.id
                ? <><Icon name="clock" size={12} /> Cloning…</>
                : <><Icon name="play" size={12} /> Use template</>
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Main view ----
const AIMarketplaceView = () => {
  const [tab, setTab] = React.useState("studios");

  const TABS = [
    { id: "studios",   label: "Studios",    icon: "bolt" },
    { id: "models",    label: "Model APIs", icon: "sparkle" },
    { id: "storage",   label: "Storage",    icon: "database" },
    { id: "templates", label: "Templates",  icon: "component" },
  ];

  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      <div className="page-header">
        <div className="page-title">
          <Icon name="bolt" size={15} style={{ color: "var(--accent)" }} />
          <span>AI Infrastructure</span>
          <span className="chip mono" style={{ color: "var(--accent)" }}>Meridian</span>
        </div>
        <div className="topbar-spacer" />
        <div className="segmented">
          {TABS.map(t => (
            <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={12} style={{ marginRight: 4 }} />
              {t.label}
            </button>
          ))}
        </div>
        <button className="btn ghost sm" onClick={() => window.toast("Docs opened")}>
          <Icon name="docs" size={13} /> Docs
        </button>
        <button className="btn ghost sm" style={{ color: "var(--accent)" }}
          onClick={() => window.openAI(
            `I'm browsing the AI Infrastructure marketplace. Help me choose the right GPU and model for my use case.`,
            "compute",
            { gpus: STUDIO_GPU_TABLE, models: LLM_MODELS.map(m=>({id:m.id,name:m.name,category:m.category,inputPrice:m.inputPrice,outputPrice:m.outputPrice})) }
          )}>
          <Icon name="sparkle" size={13} /> Ask AI
        </button>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {tab === "studios"   && <StudiosTab />}
          {tab === "models"    && <ModelAPIsTab />}
          {tab === "storage"   && <StorageTab />}
          {tab === "templates" && <TemplatesTab />}
        </div>
      </div>
    </div>
  );
};

window.AIMarketplaceView = AIMarketplaceView;
