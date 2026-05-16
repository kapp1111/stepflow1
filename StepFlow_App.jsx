import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "#0A0B0F",
    surface: "#12141A",
    card: "#1A1D27",
    cardHover: "#1F2330",
    border: "#252836",
    accent: "#4EFFA0",
    accentSoft: "#4EFFA015",
    accentMid: "#4EFFA030",
    accentGlow: "#4EFFA060",
    gold: "#FFD166",
    blue: "#4EA8FF",
    purple: "#A78BFA",
    red: "#FF6B6B",
    textPrimary: "#F0F2FF",
    textSecondary: "#8B90A8",
    textMuted: "#4A4F66",
    gradient: "linear-gradient(135deg, #0A0B0F 0%, #0D1117 100%)",
  },
  light: {
    bg: "#F4F6FF",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#F8F9FF",
    border: "#E4E8F5",
    accent: "#10B554",
    accentSoft: "#10B55415",
    accentMid: "#10B55430",
    accentGlow: "#10B55460",
    gold: "#F59E0B",
    blue: "#3B82F6",
    purple: "#8B5CF6",
    red: "#EF4444",
    textPrimary: "#0F1117",
    textSecondary: "#5B6282",
    textMuted: "#9CA3C2",
    gradient: "linear-gradient(135deg, #F4F6FF 0%, #EEF2FF 100%)",
  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 1, icon: "🥾", name: "Primeiro Passo", desc: "Complete sua primeira caminhada", unlocked: true, xp: 50 },
  { id: 2, icon: "🔥", name: "Sequência de 7 dias", desc: "Caminhe 7 dias seguidos", unlocked: true, xp: 200 },
  { id: 3, icon: "🏔️", name: "Explorador", desc: "Visite 5 locais diferentes", unlocked: true, xp: 150 },
  { id: 4, icon: "⚡", name: "10k Steps", desc: "Alcance 10.000 passos em um dia", unlocked: false, xp: 300 },
  { id: 5, icon: "🌟", name: "Maratonista", desc: "Acumule 100km caminhados", unlocked: false, xp: 500 },
  { id: 6, icon: "🦅", name: "Madrugador", desc: "Caminhe antes das 7h por 5 dias", unlocked: false, xp: 250 },
];

const PLACES = [
  { id: 1, name: "Parque Portugal (Lagoa do Taquaral)", dist: "1.2 km", rating: 4.8, diff: "Fácil", light: "Boa", safe: "Alta", type: "Parque", emoji: "🌳", color: "#4EFFA0" },
  { id: 2, name: "Bosque dos Jequitibás", dist: "2.4 km", rating: 4.7, diff: "Fácil", light: "Boa", safe: "Alta", type: "Bosque", emoji: "🌲", color: "#4EA8FF" },
  { id: 3, name: "Parque Ecológico de Campinas", dist: "3.8 km", rating: 4.6, diff: "Moderado", light: "Parcial", safe: "Média", type: "Trilha", emoji: "🏞️", color: "#A78BFA" },
  { id: 4, name: "Parque da Juventude", dist: "4.1 km", rating: 4.5, diff: "Fácil", light: "Excelente", safe: "Alta", type: "Parque", emoji: "🌿", color: "#FFD166" },
  { id: 5, name: "Praça Arautos da Paz", dist: "0.6 km", rating: 4.3, diff: "Fácil", light: "Boa", safe: "Alta", type: "Praça", emoji: "🏛️", color: "#FF6B6B" },
];

const WEEKLY_DATA = [
  { day: "Seg", steps: 7200, goal: 8000 },
  { day: "Ter", steps: 9800, goal: 8000 },
  { day: "Qua", steps: 6100, goal: 8000 },
  { day: "Qui", steps: 11200, goal: 8000 },
  { day: "Sex", steps: 8900, goal: 8000 },
  { day: "Sáb", steps: 4300, goal: 8000 },
  { day: "Dom", steps: 7650, goal: 8000 },
];

const FRIENDS = [
  { rank: 1, name: "Ana Costa", steps: 12450, avatar: "👩", badge: "🥇" },
  { rank: 2, name: "Marcos Lima", steps: 10890, avatar: "👨", badge: "🥈" },
  { rank: 3, name: "Você", steps: 9234, avatar: "🧑", badge: "🥉", isUser: true },
  { rank: 4, name: "Julia Ferr.", steps: 8100, avatar: "👱‍♀️", badge: null },
  { rank: 5, name: "Pedro Alv.", steps: 6700, avatar: "🧔", badge: null },
];

// ─── Utility Components ───────────────────────────────────────────────────────
const CircularProgress = ({ value, max, size = 140, stroke = 10, theme }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circ - pct * circ;
  const t = themes[theme];

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 12px ${t.accentGlow})` }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={t.border} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={t.accent} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
};

const ProgressBar = ({ value, max, color, theme, animated = true }) => {
  const t = themes[theme];
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: t.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: 99,
        background: color || t.accent,
        transition: animated ? "width 1s ease" : "none",
        boxShadow: `0 0 8px ${color || t.accent}80`,
      }} />
    </div>
  );
};

const Badge = ({ children, color, theme }) => {
  const t = themes[theme];
  return (
    <span style={{
      background: `${color || t.accent}18`, color: color || t.accent,
      borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
      border: `1px solid ${color || t.accent}30`, letterSpacing: "0.04em"
    }}>{children}</span>
  );
};

const Card = ({ children, theme, style = {}, onClick }) => {
  const t = themes[theme];
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? t.cardHover : t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 20, padding: 20,
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        transform: hov && onClick ? "translateY(-2px)" : "none",
        boxShadow: hov && onClick ? `0 8px 32px ${t.accent}15` : "none",
        ...style
      }}
    >{children}</div>
  );
};

// ─── SCREEN: HOME ─────────────────────────────────────────────────────────────
const HomeScreen = ({ theme, steps, goal, streak, onToggleWalk, walking }) => {
  const t = themes[theme];
  const pct = Math.round((steps / goal) * 100);
  const km = (steps * 0.00076).toFixed(2);
  const kcal = Math.round(steps * 0.04);
  const mins = Math.round(steps / 100);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Hero Card */}
      <Card theme={theme} style={{ marginBottom: 16, background: `linear-gradient(135deg, ${t.accentSoft}, ${t.card})`, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: t.accentSoft, filter: "blur(40px)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ color: t.textSecondary, fontSize: 12, fontWeight: 600, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Hoje, {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}</p>
            <h2 style={{ color: t.textPrimary, fontSize: 26, fontWeight: 800, margin: "4px 0 0", lineHeight: 1 }}>Seus Passos</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: t.accentSoft, border: `1px solid ${t.accentMid}`, borderRadius: 20, padding: "6px 12px" }}>
            <span>🔥</span>
            <span style={{ color: t.accent, fontWeight: 800, fontSize: 14 }}>{streak} dias</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress value={steps} max={goal} theme={theme} />
            <div style={{ position: "absolute", textAlign: "center" }}>
              <p style={{ color: t.accent, fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1 }}>{steps.toLocaleString()}</p>
              <p style={{ color: t.textMuted, fontSize: 10, margin: 0, fontWeight: 600 }}>/ {goal.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: t.textPrimary, fontSize: 28, fontWeight: 900, margin: "0 0 2px", lineHeight: 1 }}>{pct}%</p>
            <p style={{ color: t.textSecondary, fontSize: 13, margin: "0 0 16px" }}>da meta diária</p>
            <ProgressBar value={steps} max={goal} theme={theme} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
              {[["⚡", `${kcal}`, "kcal"], ["📍", `${km}`, "km"], ["⏱️", `${mins}`, "min"]].map(([icon, val, unit]) => (
                <div key={unit} style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 16 }}>{icon}</p>
                  <p style={{ color: t.textPrimary, fontWeight: 800, fontSize: 14, margin: "2px 0 0" }}>{val}</p>
                  <p style={{ color: t.textMuted, fontSize: 10, margin: 0 }}>{unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Start Button */}
      <button
        onClick={onToggleWalk}
        style={{
          width: "100%", border: "none", borderRadius: 16, padding: "18px 0",
          background: walking
            ? `linear-gradient(135deg, ${t.red}, #FF8E53)`
            : `linear-gradient(135deg, ${t.accent}, #00C9B1)`,
          color: "#0A0B0F", fontWeight: 900, fontSize: 17, cursor: "pointer",
          boxShadow: walking ? `0 6px 32px ${t.red}50` : `0 6px 32px ${t.accentGlow}`,
          transition: "all 0.3s ease", letterSpacing: "0.02em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transform: "none", marginBottom: 16,
        }}
      >
        {walking ? "⏹ Pausar Caminhada" : "▶ Iniciar Caminhada"}
      </button>

      {/* Weekly Chart */}
      <Card theme={theme} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: t.textPrimary, margin: 0, fontWeight: 800, fontSize: 16 }}>Esta Semana</h3>
          <Badge theme={theme}>{WEEKLY_DATA.reduce((a, d) => a + d.steps, 0).toLocaleString()} passos</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {WEEKLY_DATA.map((d, i) => {
            const h = (d.steps / 12000) * 100;
            const isToday = i === 6;
            return (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", height: `${h}%`,
                  background: isToday ? t.accent : d.steps >= d.goal ? t.accentMid : t.border,
                  borderRadius: "6px 6px 0 0",
                  transition: "height 0.8s ease",
                  boxShadow: isToday ? `0 0 10px ${t.accentGlow}` : "none",
                }} />
                <p style={{ color: isToday ? t.accent : t.textMuted, fontSize: 10, margin: 0, fontWeight: isToday ? 800 : 400 }}>{d.day}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { icon: "🏆", label: "Melhor dia", val: "11.200", sub: "passos", color: t.gold },
          { icon: "📈", label: "Média semanal", val: "7.878", sub: "passos/dia", color: t.blue },
          { icon: "🗺️", label: "Total km", val: "42.8", sub: "km percorridos", color: t.purple },
          { icon: "⚡", label: "Calorias", val: "2.840", sub: "kcal esta semana", color: t.red },
        ].map(s => (
          <Card key={s.label} theme={theme}>
            <p style={{ fontSize: 22, margin: "0 0 6px" }}>{s.icon}</p>
            <p style={{ color: t.textSecondary, fontSize: 11, margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 900, margin: "0 0 2px" }}>{s.val}</p>
            <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>{s.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: GOALS ────────────────────────────────────────────────────────────
const GoalsScreen = ({ theme }) => {
  const t = themes[theme];
  const [goals] = useState([
    { id: 1, title: "Caminhada Diária", type: "Diária", target: 8000, current: 7650, unit: "passos", icon: "👟", color: t.accent, period: "Hoje" },
    { id: 2, title: "Passos Semanais", type: "Semanal", target: 56000, current: 55150, unit: "passos", icon: "📅", color: t.blue, period: "Esta semana" },
    { id: 3, title: "Distância Mensal", type: "Mensal", target: 100, current: 68.4, unit: "km", icon: "🗺️", color: t.purple, period: "Maio 2026" },
    { id: 4, title: "Calorias Semanais", type: "Semanal", target: 3000, current: 2840, unit: "kcal", icon: "🔥", color: t.gold, period: "Esta semana" },
  ]);

  const [activeGoal, setActiveGoal] = useState(null);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: t.textPrimary, margin: 0, fontWeight: 900, fontSize: 24 }}>Minhas Metas</h2>
        <button style={{
          background: t.accentSoft, border: `1px solid ${t.accentMid}`,
          color: t.accent, borderRadius: 12, padding: "8px 16px",
          fontWeight: 700, fontSize: 13, cursor: "pointer"
        }}>+ Nova Meta</button>
      </div>

      {goals.map(g => {
        const pct = Math.min((g.current / g.target) * 100, 100);
        const done = g.current >= g.target;
        return (
          <Card key={g.id} theme={theme} style={{ marginBottom: 12 }} onClick={() => setActiveGoal(activeGoal === g.id ? null : g.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22,
                background: `${g.color}18`, border: `1px solid ${g.color}30`
              }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: t.textPrimary, fontWeight: 800, fontSize: 15, margin: 0 }}>{g.title}</p>
                  <Badge color={done ? t.accent : g.color} theme={theme}>{done ? "✓ Completa" : g.type}</Badge>
                </div>
                <p style={{ color: t.textSecondary, fontSize: 12, margin: "2px 0 0" }}>{g.period}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: g.color, fontWeight: 900, fontSize: 18 }}>
                {typeof g.current === "number" && g.current < 100 ? g.current.toFixed(1) : g.current.toLocaleString()} {g.unit}
              </span>
              <span style={{ color: t.textMuted, fontSize: 13 }}>
                / {g.target < 100 ? g.target : g.target.toLocaleString()} {g.unit}
              </span>
            </div>
            <ProgressBar value={g.current} max={g.target} color={g.color} theme={theme} />
            <p style={{ color: t.textMuted, fontSize: 12, margin: "8px 0 0", textAlign: "right" }}>{pct.toFixed(0)}% concluído</p>

            {activeGoal === g.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: t.surface, borderRadius: 12, padding: 12 }}>
                    <p style={{ color: t.textMuted, fontSize: 11, margin: "0 0 4px" }}>FALTAM</p>
                    <p style={{ color: t.textPrimary, fontWeight: 800, fontSize: 16, margin: 0 }}>
                      {(g.target - g.current).toFixed(g.current < 100 ? 1 : 0)} {g.unit}
                    </p>
                  </div>
                  <div style={{ background: t.surface, borderRadius: 12, padding: 12 }}>
                    <p style={{ color: t.textMuted, fontSize: 11, margin: "0 0 4px" }}>PROGRESSO</p>
                    <p style={{ color: g.color, fontWeight: 800, fontSize: 16, margin: 0 }}>{pct.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Motivational */}
      <Card theme={theme} style={{ background: `linear-gradient(135deg, ${t.purple}20, ${t.blue}15)`, border: `1px solid ${t.purple}30` }}>
        <p style={{ fontSize: 24, margin: "0 0 8px" }}>💪</p>
        <p style={{ color: t.textPrimary, fontWeight: 800, fontSize: 16, margin: "0 0 4px" }}>Quase lá!</p>
        <p style={{ color: t.textSecondary, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          Você está a apenas <span style={{ color: t.accent, fontWeight: 700 }}>850 passos</span> da sua meta diária. Vamos dar um passeio?
        </p>
      </Card>
    </div>
  );
};

// ─── SCREEN: EXPLORE ──────────────────────────────────────────────────────────
const ExploreScreen = ({ theme }) => {
  const t = themes[theme];
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Parque", "Bosque", "Trilha", "Praça"];

  const filtered = filter === "Todos" ? PLACES : PLACES.filter(p => p.type === filter);

  return (
    <div style={{ padding: "0 0 100px" }}>
      {/* Map Mock */}
      <div style={{
        height: 220, background: `linear-gradient(135deg, ${t.accentSoft}, ${t.blue}10)`,
        position: "relative", overflow: "hidden", marginBottom: 0
      }}>
        {/* Fake map grid */}
        <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.15 }}>
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 30} x2="100%" y2={i * 30} stroke={t.accent} strokeWidth="0.5" />
          ))}
          {[...Array(12)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="100%" stroke={t.accent} strokeWidth="0.5" />
          ))}
        </svg>
        {/* Pins */}
        {PLACES.slice(0, 4).map((p, i) => (
          <div key={p.id} onClick={() => setSelected(selected === p.id ? null : p.id)} style={{
            position: "absolute",
            top: [40, 80, 120, 60][i] + "px",
            left: [60, 150, 90, 240][i] + "px",
            cursor: "pointer",
            transition: "transform 0.2s",
            transform: selected === p.id ? "scale(1.3)" : "scale(1)",
          }}>
            <div style={{
              background: selected === p.id ? p.color : t.card,
              border: `2px solid ${p.color}`,
              borderRadius: 20, padding: "4px 8px",
              fontSize: 11, fontWeight: 700,
              color: selected === p.id ? "#0A0B0F" : p.color,
              whiteSpace: "nowrap",
              boxShadow: `0 4px 12px ${p.color}40`,
            }}>{p.emoji} {p.dist}</div>
          </div>
        ))}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: t.card, border: `1px solid ${t.border}`,
          borderRadius: 20, padding: "6px 14px",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <span style={{ fontSize: 14 }}>📍</span>
          <span style={{ color: t.textSecondary, fontSize: 12, fontWeight: 600 }}>Campinas, SP</span>
        </div>
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          background: t.accentSoft, border: `1px solid ${t.accentMid}`,
          borderRadius: 20, padding: "6px 14px",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <span style={{ color: t.accent, fontSize: 12, fontWeight: 700 }}>5 locais próximos</span>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 0", scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flex: "none", background: filter === f ? t.accent : t.card,
              border: `1px solid ${filter === f ? t.accent : t.border}`,
              color: filter === f ? "#0A0B0F" : t.textSecondary,
              borderRadius: 20, padding: "8px 18px", fontSize: 13,
              fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>

        {filtered.map(p => (
          <Card key={p.id} theme={theme} style={{ marginBottom: 12 }} onClick={() => setSelected(selected === p.id ? null : p.id)}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `${p.color}18`, border: `1px solid ${p.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0
              }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: t.textPrimary, fontWeight: 800, fontSize: 14, margin: 0 }}>{p.name}</p>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                      <Badge color={p.color} theme={theme}>{p.type}</Badge>
                      <Badge color={t.textMuted} theme={theme}>{p.diff}</Badge>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: t.accent, fontWeight: 800, fontSize: 14, margin: 0 }}>{p.dist}</p>
                    <p style={{ color: t.gold, fontSize: 12, margin: "2px 0 0" }}>★ {p.rating}</p>
                  </div>
                </div>
              </div>
            </div>
            {selected === p.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    ["🌙", "Iluminação", p.light],
                    ["🛡️", "Segurança", p.safe],
                    ["⛰️", "Dificuldade", p.diff],
                  ].map(([ico, lbl, val]) => (
                    <div key={lbl} style={{ background: t.surface, borderRadius: 12, padding: 10, textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 16 }}>{ico}</p>
                      <p style={{ color: t.textMuted, fontSize: 10, margin: "2px 0 0" }}>{lbl}</p>
                      <p style={{ color: t.textPrimary, fontSize: 11, fontWeight: 700, margin: "2px 0 0" }}>{val}</p>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: "100%", marginTop: 12,
                  background: `linear-gradient(135deg, ${p.color}, ${p.color}CC)`,
                  border: "none", borderRadius: 14, padding: "12px 0",
                  color: "#0A0B0F", fontWeight: 800, fontSize: 14, cursor: "pointer",
                }}>🧭 Navegar até aqui</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: ACHIEVEMENTS ────────────────────────────────────────────────────
const AchievementsScreen = ({ theme }) => {
  const t = themes[theme];
  const level = 12;
  const xpCurrent = 1850;
  const xpNext = 2000;

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Level Card */}
      <Card theme={theme} style={{
        background: `linear-gradient(135deg, ${t.purple}20, ${t.gold}10)`,
        border: `1px solid ${t.purple}30`, marginBottom: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: `linear-gradient(135deg, ${t.purple}, ${t.gold})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, boxShadow: `0 4px 20px ${t.purple}50`
          }}>⭐</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: t.textSecondary, fontSize: 12, margin: 0, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Nível atual</p>
            <p style={{ color: t.textPrimary, fontWeight: 900, fontSize: 28, margin: "2px 0 0", lineHeight: 1 }}>Nível {level}</p>
            <p style={{ color: t.textSecondary, fontSize: 12, margin: "2px 0 6px" }}>Explorador Veterano</p>
            <ProgressBar value={xpCurrent} max={xpNext} color={t.purple} theme={theme} />
            <p style={{ color: t.textMuted, fontSize: 11, margin: "4px 0 0" }}>{xpCurrent} / {xpNext} XP</p>
          </div>
        </div>
      </Card>

      {/* Streak */}
      <Card theme={theme} style={{ marginBottom: 20, background: `linear-gradient(135deg, ${t.gold}15, ${t.card})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: t.textSecondary, fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sequência ativa</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 32 }}>🔥</span>
              <span style={{ color: t.gold, fontWeight: 900, fontSize: 36 }}>14</span>
              <span style={{ color: t.textSecondary, fontWeight: 600 }}>dias</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: t.textMuted, fontSize: 12, margin: 0 }}>Recorde pessoal</p>
            <p style={{ color: t.gold, fontWeight: 900, fontSize: 22, margin: "2px 0" }}>21 dias</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {["S","T","Q","Q","S","S","D"].map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: "100%", height: 28, borderRadius: 8,
                background: i < 6 ? t.gold : t.border,
                boxShadow: i < 6 ? `0 2px 8px ${t.gold}40` : "none",
                marginBottom: 4,
              }} />
              <p style={{ color: i < 6 ? t.gold : t.textMuted, fontSize: 10, margin: 0, fontWeight: 700 }}>{d}</p>
            </div>
          ))}
        </div>
      </Card>

      <h3 style={{ color: t.textPrimary, fontWeight: 800, margin: "0 0 14px", fontSize: 18 }}>Conquistas</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {ACHIEVEMENTS.map(a => (
          <Card key={a.id} theme={theme} style={{
            opacity: a.unlocked ? 1 : 0.45,
            border: a.unlocked ? `1px solid ${t.accentMid}` : `1px solid ${t.border}`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
              <div style={{
                fontSize: 36,
                filter: a.unlocked ? "none" : "grayscale(100%)",
              }}>{a.icon}</div>
              <p style={{ color: t.textPrimary, fontWeight: 800, fontSize: 13, margin: 0 }}>{a.name}</p>
              <p style={{ color: t.textSecondary, fontSize: 11, margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
              <Badge color={a.unlocked ? t.gold : t.textMuted} theme={theme}>+{a.xp} XP</Badge>
              {a.unlocked && <span style={{ fontSize: 12, color: t.accent }}>✓ Conquistado</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: PROFILE ──────────────────────────────────────────────────────────
const ProfileScreen = ({ theme, onToggleTheme }) => {
  const t = themes[theme];

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Profile Header */}
      <Card theme={theme} style={{
        marginBottom: 16,
        background: `linear-gradient(135deg, ${t.accentSoft}, ${t.card})`,
        textAlign: "center"
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.accent}, ${t.blue})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 12px",
          boxShadow: `0 4px 20px ${t.accentGlow}`
        }}>🧑</div>
        <h2 style={{ color: t.textPrimary, margin: "0 0 4px", fontWeight: 900, fontSize: 22 }}>Você</h2>
        <p style={{ color: t.textSecondary, margin: "0 0 12px", fontSize: 14 }}>Explorador Veterano · Nível 12</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <Badge theme={theme}>🔥 14 dias de streak</Badge>
          <Badge color={t.gold} theme={theme}>⭐ 1.850 XP</Badge>
        </div>
      </Card>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { val: "147", label: "Caminhadas", icon: "👟" },
          { val: "428", label: "Km Totais", icon: "🗺️" },
          { val: "42", label: "Conquistas", icon: "🏆" },
        ].map(s => (
          <Card key={s.label} theme={theme} style={{ textAlign: "center" }}>
            <p style={{ fontSize: 20, margin: "0 0 4px" }}>{s.icon}</p>
            <p style={{ color: t.accent, fontWeight: 900, fontSize: 20, margin: "0 0 2px" }}>{s.val}</p>
            <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Ranking */}
      <Card theme={theme} style={{ marginBottom: 16 }}>
        <h3 style={{ color: t.textPrimary, margin: "0 0 16px", fontWeight: 800, fontSize: 16 }}>🏆 Ranking de Amigos</h3>
        {FRIENDS.map(f => (
          <div key={f.rank} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0",
            borderBottom: f.rank < FRIENDS.length ? `1px solid ${t.border}` : "none",
            background: f.isUser ? t.accentSoft : "transparent",
            borderRadius: f.isUser ? 12 : 0,
            padding: f.isUser ? "10px 12px" : "10px 0",
            margin: f.isUser ? "0 -4px" : 0,
          }}>
            <span style={{ color: t.textMuted, fontWeight: 800, fontSize: 14, width: 20 }}>#{f.rank}</span>
            <span style={{ fontSize: 24 }}>{f.avatar}</span>
            <span style={{ flex: 1, color: f.isUser ? t.accent : t.textPrimary, fontWeight: f.isUser ? 800 : 600, fontSize: 14 }}>{f.name}</span>
            <span style={{ color: t.textSecondary, fontSize: 13 }}>{f.steps.toLocaleString()} passos</span>
            {f.badge && <span style={{ fontSize: 18 }}>{f.badge}</span>}
          </div>
        ))}
      </Card>

      {/* Settings */}
      <Card theme={theme}>
        <h3 style={{ color: t.textPrimary, margin: "0 0 16px", fontWeight: 800, fontSize: 16 }}>⚙️ Configurações</h3>
        {[
          { icon: theme === "dark" ? "☀️" : "🌙", label: theme === "dark" ? "Tema Claro" : "Tema Escuro", action: onToggleTheme },
          { icon: "🔔", label: "Notificações motivacionais", action: null },
          { icon: "📊", label: "Conectar Google Fit / Apple Health", action: null },
          { icon: "🔒", label: "Privacidade e Dados", action: null },
        ].map(s => (
          <div key={s.label} onClick={s.action} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 0", cursor: s.action ? "pointer" : "default",
            borderBottom: `1px solid ${t.border}`,
          }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <span style={{ flex: 1, color: t.textPrimary, fontSize: 14, fontWeight: 500 }}>{s.label}</span>
            <span style={{ color: t.textMuted }}>›</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function StepFlowApp() {
  const [theme, setTheme] = useState("dark");
  const [tab, setTab] = useState("home");
  const [steps, setSteps] = useState(7650);
  const [walking, setWalking] = useState(false);
  const [goal] = useState(8000);
  const [streak] = useState(14);
  const [notif, setNotif] = useState(null);
  const walkRef = useRef(null);

  const t = themes[theme];

  const NOTIFICATIONS = [
    "Você está quase na meta! Só mais 350 passos! 💪",
    "Que tal uma caminhada de 15 min no Taquaral? 🌳",
    "Você manteve a sequência por 14 dias! Continue! 🔥",
    "Nova conquista desbloqueada! 🏆",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotif(NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]);
      setTimeout(() => setNotif(null), 4000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleWalk = () => {
    if (!walking) {
      setWalking(true);
      walkRef.current = setInterval(() => {
        setSteps(s => Math.min(s + Math.floor(Math.random() * 8 + 3), goal + 500));
      }, 800);
    } else {
      setWalking(false);
      clearInterval(walkRef.current);
    }
  };

  useEffect(() => () => clearInterval(walkRef.current), []);

  const navItems = [
    { id: "home", icon: "🏠", label: "Início" },
    { id: "goals", icon: "🎯", label: "Metas" },
    { id: "explore", icon: "🗺️", label: "Explorar" },
    { id: "achievements", icon: "🏆", label: "Conquistas" },
    { id: "profile", icon: "👤", label: "Perfil" },
  ];

  return (
    <div style={{
      background: t.bg,
      minHeight: "100vh",
      fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif",
      color: t.textPrimary,
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      transition: "background 0.3s ease",
    }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: inherit; }
      `}</style>

      {/* Notification Toast */}
      {notif && (
        <div style={{
          position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
          background: t.card, border: `1px solid ${t.accentMid}`,
          borderRadius: 16, padding: "12px 18px",
          boxShadow: `0 8px 32px ${t.accentGlow}`,
          zIndex: 1000, maxWidth: 340, width: "90%",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideIn 0.3s ease",
        }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <p style={{ color: t.textPrimary, margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{notif}</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${t.bg}EE`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${t.border}`,
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${t.accent}, #00C9B1)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: `0 2px 12px ${t.accentGlow}`
          }}>👟</div>
          <span style={{ fontWeight: 900, fontSize: 20, color: t.textPrimary, letterSpacing: "-0.02em" }}>StepFlow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {walking && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: `${t.red}18`, border: `1px solid ${t.red}40`,
              borderRadius: 20, padding: "4px 12px"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, animation: "pulse 1s infinite" }} />
              <span style={{ color: t.red, fontSize: 12, fontWeight: 700 }}>AO VIVO</span>
            </div>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: 10, width: 34, height: 34,
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >{theme === "dark" ? "☀️" : "🌙"}</button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* Screen Title */}
      <div style={{ padding: "20px 20px 8px" }}>
        {tab === "home" && (
          <div>
            <p style={{ color: t.textSecondary, fontSize: 13, margin: 0 }}>Bom dia! 👋</p>
            <h1 style={{ color: t.textPrimary, margin: "2px 0 0", fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>
              Vamos Caminhar?
            </h1>
          </div>
        )}
        {tab === "goals" && <h1 style={{ color: t.textPrimary, margin: 0, fontSize: 28, fontWeight: 900 }}>Minhas Metas</h1>}
        {tab === "explore" && <h1 style={{ color: t.textPrimary, margin: 0, fontSize: 28, fontWeight: 900 }}>Explorar</h1>}
        {tab === "achievements" && <h1 style={{ color: t.textPrimary, margin: 0, fontSize: 28, fontWeight: 900 }}>Conquistas</h1>}
        {tab === "profile" && <h1 style={{ color: t.textPrimary, margin: 0, fontSize: 28, fontWeight: 900 }}>Perfil</h1>}
      </div>

      {/* Screens */}
      <div style={{ paddingTop: 12 }}>
        {tab === "home" && <HomeScreen theme={theme} steps={steps} goal={goal} streak={streak} onToggleWalk={handleToggleWalk} walking={walking} />}
        {tab === "goals" && <GoalsScreen theme={theme} />}
        {tab === "explore" && <ExploreScreen theme={theme} />}
        {tab === "achievements" && <AchievementsScreen theme={theme} />}
        {tab === "profile" && <ProfileScreen theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: `${t.surface}F5`, backdropFilter: "blur(20px)",
        borderTop: `1px solid ${t.border}`,
        display: "flex", justifyContent: "space-around",
        padding: "10px 0 20px", zIndex: 200,
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "6px 12px", borderRadius: 12,
              transition: "all 0.2s ease",
            }}
          >
            <div style={{
              width: 40, height: 36, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
              background: tab === item.id ? t.accentSoft : "transparent",
              border: tab === item.id ? `1px solid ${t.accentMid}` : "1px solid transparent",
              transition: "all 0.2s ease",
              boxShadow: tab === item.id ? `0 2px 12px ${t.accentGlow}` : "none",
            }}>{item.icon}</div>
            <span style={{
              color: tab === item.id ? t.accent : t.textMuted,
              fontSize: 10, fontWeight: tab === item.id ? 800 : 500,
              transition: "color 0.2s",
            }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
