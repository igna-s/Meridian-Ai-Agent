// Meridian GPU Compute view

const GPUS = [
  { id: "mi300x", name: "MI300X", vram: "192 GB HBM3", tflops: "10496 FP16", gen: "CDNA 3", tier: "flagship", priceHr: 4.89 },
  { id: "mi300a", name: "MI300A", vram: "128 GB HBM3", tflops: "3800 FP16", gen: "CDNA 3", tier: "flagship", priceHr: 3.49 },
  { id: "mi250x-128", name: "MI250X 128 GB", vram: "128 GB HBM2e", tflops: "383 FP16", gen: "CDNA 2", tier: "pro", priceHr: 2.21 },
  { id: "mi210-64", name: "MI210 64 GB", vram: "64 GB HBM2e", tflops: "181 FP16", gen: "CDNA 2", tier: "pro", priceHr: 1.49 },
  { id: "v620", name: "Radeon PRO V620", vram: "32 GB GDDR6", tflops: "105 FP16", gen: "RDNA 2", tier: "pro", priceHr: 1.89 },
  { id: "w7900", name: "Radeon PRO W7900", vram: "48 GB GDDR6", tflops: "123 FP16", gen: "RDNA 3", tier: "standard", priceHr: 0.79 },
  { id: "w7800", name: "Radeon PRO W7800", vram: "32 GB GDDR6", tflops: "89 FP16", gen: "RDNA 3", tier: "standard", priceHr: 0.59 },
  { id: "v520", name: "Radeon PRO V520", vram: "8 GB HBM2", tflops: "18 FP16", gen: "RDNA", tier: "entry", priceHr: 0.29 },
];

const REGIONS = [
  { id: "us-east-1", label: "US East (N. Virginia)", ping: 12, cloud: "aws" },
  { id: "us-west-2", label: "US West (Oregon)", ping: 38, cloud: "aws" },
  { id: "eu-west-1", label: "EU West (Ireland)", ping: 91, cloud: "aws" },
  { id: "ap-southeast-1", label: "Asia Pacific (Singapore)", ping: 174, cloud: "aws" },
  { id: "core-dal", name: "Dallas TX", label: "Dallas TX", ping: 21, cloud: "coreweave" },
  { id: "core-las", label: "Las Vegas NV", ping: 44, cloud: "coreweave" },
  { id: "lambda-slc", label: "Salt Lake City UT", ping: 57, cloud: "lambda" },
  { id: "lambda-atx", label: "Austin TX", ping: 29, cloud: "lambda" },
];

const FRAMEWORKS = ["PyTorch 2.3", "JAX 0.4", "TensorFlow 2.16", "Custom image"];

const INSTANCE_SIZES = [
  { id: "1x", label: "1× GPU", multiplier: 1 },
  { id: "4x", label: "4× GPU", multiplier: 4 },
  { id: "8x", label: "8× GPU", multiplier: 8 },
  { id: "16x", label: "16× GPU", multiplier: 16 },
];

const MOCK_JOBS = [
  { id: "job-9af2", name: "llama3-finetune-v4", gpu: "MI250X 128 GB", gpuCount: 4, status: "running", started: "2h 14m", cost: 13.19, region: "US East", progress: 62 },
  { id: "job-3bc1", name: "stable-diffusion-xl-eval", gpu: "Radeon PRO W7900", gpuCount: 1, status: "running", started: "41m", cost: 0.54, region: "Dallas TX", progress: 38 },
  { id: "job-c77e", name: "embedding-batch-1M", gpu: "Radeon PRO W7800", gpuCount: 2, status: "done", started: "5h ago", cost: 5.90, region: "US West", progress: 100 },
  { id: "job-12d0", name: "whisper-large-bench", gpu: "Radeon PRO V520", gpuCount: 1, status: "queued", started: "—", cost: 0, region: "EU West", progress: 0 },
];

const TIER_COLORS = {
  flagship: "var(--accent)",
  pro: "oklch(0.72 0.18 300)",
  standard: "oklch(0.78 0.13 220)",
  entry: "var(--fg-3)",
};

const CLOUD_BADGE = { aws: "AWS", coreweave: "CoreWeave", lambda: "Lambda" };
const CLOUD_COLOR = { aws: "oklch(0.80 0.14 75)", coreweave: "oklch(0.78 0.13 220)", lambda: "oklch(0.72 0.18 300)" };

const COMPUTE_STATUS_META = {
  queued: { label: "Queued", color: "var(--fg-3)" },
  running: { label: "Running", color: "var(--accent)" },
  done: { label: "Completed", color: "var(--status-done)" },
  failed: { label: "Failed", color: "var(--rose)" },
  canceled: { label: "Canceled", color: "var(--fg-3)" }
};

const ComputeView = () => {
  const [tab, setTab] = React.useState("launch");
  const [selectedGpu, setSelectedGpu]         = React.useState("mi250x-128");
  const [selectedRegion, setSelectedRegion]   = React.useState("us-east-1");
  const [selectedSize, setSelectedSize]       = React.useState("1x");
  const [selectedFw, setSelectedFw]           = React.useState(FRAMEWORKS[0]);
  const [gpuFilter, setGpuFilter]             = React.useState("all");
  const [jobName, setJobName]                 = React.useState("my-training-run");
  const [hours, setHours]                     = React.useState(4);
  const [launching, setLaunching]             = React.useState(false);
  const [jobs, setJobs]                       = React.useState(MOCK_JOBS);

  const gpu    = GPUS.find(g => g.id === selectedGpu) || GPUS[2];
  const size   = INSTANCE_SIZES.find(s => s.id === selectedSize);
  const region = REGIONS.find(r => r.id === selectedRegion);
  const totalHr = gpu.priceHr * size.multiplier;
  const estCost = (totalHr * hours).toFixed(2);

  const filteredGpus = gpuFilter === "all" ? GPUS : GPUS.filter(g => g.tier === gpuFilter);

  const launch = () => {
    if (!jobName.trim()) { window.toast("Give the job a name"); return; }
    setLaunching(true);
    setTimeout(() => {
      const newJob = {
        id: "job-" + Math.random().toString(36).slice(2, 6),
        name: jobName,
        gpu: gpu.name,
        gpuCount: size.multiplier,
        status: "running",
        started: "just now",
        cost: 0,
        region: region?.label?.split("(")[0].trim() || "US East",
        progress: 0,
      };
      setJobs(j => [newJob, ...j]);
      setLaunching(false);
      setTab("jobs");
      window.toast(`Instance "${jobName}" launched on ${gpu.name} ×${size.multiplier}`);
    }, 1800);
  };

  return (
    <div className="flex col flex-1" style={{ minWidth: 0 }}>
      {/* Page header */}
      <div className="page-header">
        <div className="page-title">
          <Icon name="code" size={15} style={{ color: "var(--accent)" }} />
          <span>Compute</span>
          <span className="chip mono" style={{ color: "var(--accent)" }}>Meridian Compute</span>
        </div>
        <div className="topbar-spacer" />
        <div className="segmented">
          {[
            { id: "launch", label: "Launch" },
            { id: "jobs",   label: `Jobs (${jobs.filter(j => j.status === "running").length} active)` },
            { id: "quota",  label: "Quota" },
          ].map(t => (
            <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <button className="btn ghost sm" onClick={() => window.toast("Docs opened")}><Icon name="docs" size={13} /> Docs</button>
        <button className="btn ghost sm" style={{ color: "var(--accent)" }}
          onClick={() => window.openAI(
            `Analyze my compute usage. ${jobs.filter(j=>j.status==='running').length} jobs running.`,
            "compute",
            { jobs, quota: QUOTA_DATA }
          )}>
          <Icon name="sparkle" size={13} /> AI Analysis
        </button>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* ===== LAUNCH TAB ===== */}
          {tab === "launch" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
              {/* Left column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* GPU Picker */}
                <div className="card" style={{ padding: 16 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <strong style={{ fontSize: 13 }}>Select GPU</strong>
                    <div className="segmented">
                      {["all", "flagship", "pro", "standard", "entry"].map(f => (
                        <button key={f} className={gpuFilter === f ? "on" : ""} onClick={() => setGpuFilter(f)} style={{ textTransform: "capitalize" }}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {filteredGpus.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGpu(g.id)}
                        style={{
                          padding: "12px 10px",
                          border: `1.5px solid ${selectedGpu === g.id ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 10,
                          background: selectedGpu === g.id ? "var(--accent-soft)" : "var(--bg-1)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "border-color .15s, background .15s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{g.name}</span>
                          <span style={{
                            fontSize: 10, padding: "1px 5px", borderRadius: 4,
                            background: TIER_COLORS[g.tier] + "22",
                            color: TIER_COLORS[g.tier],
                            fontFamily: "var(--font-mono)", fontWeight: 500,
                          }}>{g.tier}</span>
                        </div>
                        <div className="muted" style={{ fontSize: 10.5, marginBottom: 2 }}>{g.vram}</div>
                        <div className="muted-2 mono" style={{ fontSize: 10 }}>{g.tflops}</div>
                        <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
                          ${g.priceHr.toFixed(2)}<span className="muted-2 mono" style={{ fontSize: 10, fontWeight: 400 }}>/hr</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPU count + instance size */}
                <div className="card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>Instance size</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {INSTANCE_SIZES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.id)}
                        style={{
                          padding: "10px 12px",
                          border: `1.5px solid ${selectedSize === s.id ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 8,
                          background: selectedSize === s.id ? "var(--accent-soft)" : "var(--bg-1)",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                        <div className="mono muted-2" style={{ fontSize: 10.5, marginTop: 3 }}>
                          ${(gpu.priceHr * s.multiplier).toFixed(2)}/hr
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div className="card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>Region &amp; cloud provider</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {REGIONS.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRegion(r.id)}
                        style={{
                          padding: "10px 12px",
                          border: `1.5px solid ${selectedRegion === r.id ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 8,
                          background: selectedRegion === r.id ? "var(--accent-soft)" : "var(--bg-1)",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{
                          fontSize: 9.5, padding: "1px 5px", borderRadius: 4, flexShrink: 0,
                          background: CLOUD_COLOR[r.cloud] + "22",
                          color: CLOUD_COLOR[r.cloud],
                          fontFamily: "var(--font-mono)", fontWeight: 600, textTransform: "uppercase",
                        }}>{CLOUD_BADGE[r.cloud]}</span>
                        <span style={{ flex: 1, fontSize: 12 }} className="truncate">{r.label}</span>
                        <span className="mono muted-2" style={{ fontSize: 10.5 }}>{r.ping}ms</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Framework */}
                <div className="card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>Runtime environment</strong>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {FRAMEWORKS.map(fw => (
                      <button
                        key={fw}
                        onClick={() => setSelectedFw(fw)}
                        style={{
                          padding: "7px 14px",
                          border: `1.5px solid ${selectedFw === fw ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 20,
                          background: selectedFw === fw ? "var(--accent-soft)" : "var(--bg-1)",
                          cursor: "pointer",
                          fontSize: 12.5,
                          color: selectedFw === fw ? "var(--accent)" : "var(--fg-1)",
                        }}
                      >{fw}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column — cost summary + launch */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Job name */}
                <div className="card" style={{ padding: 16 }}>
                  <label style={{ fontSize: 12, color: "var(--fg-2)", display: "block", marginBottom: 6 }}>Job name</label>
                  <input
                    value={jobName}
                    onChange={e => setJobName(e.target.value)}
                    placeholder="my-training-run"
                    style={{
                      width: "100%", padding: "8px 10px", background: "var(--bg-0)",
                      border: "1px solid var(--border)", borderRadius: 7, outline: "none",
                      fontSize: 13, boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Cost estimate */}
                <div className="card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Estimated cost</strong>

                  <div className="divider" />

                  <div className="flex items-center justify-between" style={{ fontSize: 12.5, padding: "6px 0" }}>
                    <span className="muted">GPU</span>
                    <span className="mono">{gpu.name} ×{size.multiplier}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ fontSize: 12.5, padding: "6px 0" }}>
                    <span className="muted">Rate</span>
                    <span className="mono">${totalHr.toFixed(2)}/hr</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ fontSize: 12.5, padding: "6px 0" }}>
                    <span className="muted">Region</span>
                    <span className="mono">{region?.label?.split(" (")[0]}</span>
                  </div>

                  <div className="divider" />

                  <label style={{ fontSize: 11.5, color: "var(--fg-2)", display: "block", marginBottom: 6 }}>
                    Max duration: <strong className="mono">{hours}h</strong>
                  </label>
                  <input
                    type="range" min="1" max="72" value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent)", marginBottom: 12 }}
                  />

                  <div className="divider" />

                  <div className="flex items-center justify-between" style={{ padding: "8px 0" }}>
                    <span style={{ fontSize: 13 }}>Estimated total</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                      ${estCost}
                    </span>
                  </div>
                  <div className="muted-2 mono" style={{ fontSize: 10.5 }}>Billed per second. Stops at ${estCost} unless extended.</div>
                </div>

                {/* Launch button */}
                <button
                  className="btn primary"
                  style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 600, opacity: launching ? 0.6 : 1 }}
                  onClick={launch}
                  disabled={launching}
                >
                  {launching
                    ? <><Icon name="clock" size={14} /> Provisioning…</>
                    : <><Icon name="sprint" size={14} /> Launch instance</>
                  }
                </button>

                {/* Quick stats */}
                <div className="card" style={{ padding: 14 }}>
                  <div className="muted-2 mono" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Cluster availability</div>
                  {[
                    { label: "MI300X", avail: 2 },
                    { label: "MI250X 128G", avail: 8 },
                    { label: "W7900", avail: 14 },
                  ].map(a => (
                    <div key={a.label} className="flex items-center justify-between" style={{ fontSize: 12, padding: "4px 0" }}>
                      <span className="mono">{a.label}</span>
                      <span style={{ color: a.avail > 5 ? "var(--accent)" : a.avail > 0 ? "oklch(0.80 0.14 75)" : "oklch(0.72 0.17 20)" }}>
                        {a.avail} nodes free
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== JOBS TAB ===== */}
          {tab === "jobs" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Running", value: jobs.filter(j => j.status === "running").length, color: "var(--accent)" },
                  { label: "Total today", value: jobs.length, color: "var(--fg-1)" },
                  { label: "Spend today", value: "$" + jobs.reduce((s, j) => s + j.cost, 0).toFixed(2), color: "oklch(0.72 0.18 300)" },
                ].map(s => (
                  <div key={s.label} className="card" style={{ padding: 14 }}>
                    <div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "var(--font-mono)" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="flex items-center" style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>
                  <span style={{ width: 130 }}>Job</span>
                  <span style={{ flex: 1 }}>Name</span>
                  <span style={{ width: 160 }}>GPU</span>
                  <span style={{ width: 100 }}>Region</span>
                  <span style={{ width: 80, textAlign: "right" }}>Runtime</span>
                  <span style={{ width: 80, textAlign: "right" }}>Cost</span>
                  <span style={{ width: 110 }}>Progress</span>
                  <span style={{ width: 70 }}></span>
                </div>
                {jobs.map(j => {
                  const sm = COMPUTE_STATUS_META[j.status] || COMPUTE_STATUS_META.queued;
                  return (
                    <div key={j.id} className="row" style={{ display: "flex", alignItems: "center" }}>
                      <span className="mono muted-2" style={{ fontSize: 11, width: 130, flexShrink: 0 }}>{j.id}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }} className="truncate">{j.name}</span>
                      <span style={{ width: 160, fontSize: 12 }} className="muted">{j.gpu} ×{j.gpuCount}</span>
                      <span style={{ width: 100, fontSize: 11.5 }} className="muted">{j.region}</span>
                      <span className="mono" style={{ width: 80, fontSize: 11.5, textAlign: "right", flexShrink: 0 }}>{j.started}</span>
                      <span className="mono" style={{ width: 80, fontSize: 11.5, textAlign: "right", flexShrink: 0, color: j.cost > 0 ? "var(--fg-0)" : "var(--fg-3)" }}>
                        {j.cost > 0 ? "$" + j.cost.toFixed(2) : "—"}
                      </span>
                      <span style={{ width: 110, flexShrink: 0, padding: "0 8px" }}>
                        <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${j.progress}%`, height: "100%", background: sm.color, transition: "width .3s" }} />
                        </div>
                        <span className="mono muted-2" style={{ fontSize: 10 }}>{j.progress}%</span>
                      </span>
                      <span style={{ width: 70, flexShrink: 0 }}>
                        <span className="chip" style={{ color: sm.color, fontSize: 10.5 }}>
                          <span className="d" style={{ background: sm.color }} />{sm.label}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== QUOTA TAB ===== */}
          {tab === "quota" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card" style={{ padding: 16 }}>
                <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>GPU quota</strong>
                {[
                  { label: "MI300X", used: 0, total: 8 },
                  { label: "MI300A", used: 0, total: 8 },
                  { label: "MI250X 128 GB", used: 4, total: 16 },
                  { label: "MI210 64 GB", used: 0, total: 16 },
                  { label: "Radeon PRO V620", used: 0, total: 16 },
                  { label: "Radeon PRO W7900", used: 1, total: 32 },
                  { label: "Radeon PRO W7800", used: 2, total: 32 },
                  { label: "Radeon PRO V520", used: 0, total: 64 },
                ].map(q => (
                  <div key={q.label} style={{ padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5 }}>{q.label}</span>
                      <span className="mono" style={{ fontSize: 11 }}>{q.used}/{q.total}</span>
                    </div>
                    <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${(q.used / q.total) * 100}%`, height: "100%", background: q.used / q.total > 0.8 ? "oklch(0.72 0.17 20)" : "var(--accent)" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Spending limits</strong>
                  {[
                    { label: "Daily limit", used: 14.63, total: 200 },
                    { label: "Monthly limit", used: 89.21, total: 2000 },
                  ].map(s => (
                    <div key={s.label} style={{ marginBottom: 14 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 12.5 }}>{s.label}</span>
                        <span className="mono" style={{ fontSize: 11 }}>${s.used.toFixed(2)} / ${s.total}</span>
                      </div>
                      <div style={{ height: 5, background: "var(--bg-3)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(s.used / s.total) * 100}%`, height: "100%", background: "var(--accent)" }} />
                      </div>
                    </div>
                  ))}
                  <button className="btn ghost sm" style={{ marginTop: 4 }} onClick={() => window.toast("Limit editor opened")}><Icon name="settings" size={13} /> Edit limits</button>
                </div>

                <div className="card" style={{ padding: 16 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Plan</strong>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>⚡</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Meridian Pro</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>Renews Jun 1, 2026</div>
                    </div>
                    <div style={{ flex: 1 }} />
                    <span className="chip" style={{ color: "var(--accent)" }}>Active</span>
                  </div>
                  <div className="divider" />
                  {[
                    "Priority queue access",
                    "Up to 8× MI300X per job",
                    "Spot instance discounts",
                    "24/7 cluster support",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-8" style={{ padding: "5px 0", fontSize: 12.5 }}>
                      <Icon name="check" size={13} style={{ color: "var(--accent)", flexShrink: 0 }} strokeWidth={2.5} />
                      <span>{f}</span>
                    </div>
                  ))}
                  <button className="btn sm primary" style={{ width: "100%", marginTop: 12 }} onClick={() => window.toast("Upgrade flow opened")}>Upgrade to Enterprise</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.ComputeView = ComputeView;
