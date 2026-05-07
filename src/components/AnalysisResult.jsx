import { AlertTriangle, TrendingUp, Cpu, Shield, Anchor, BarChart2, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import './AnalysisResult.css'

function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#00d4aa' : score >= 45 ? '#f5a623' : '#ff5c5c'
  return (
    <svg width={size} height={size} className="score-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="18" fontWeight="600" fontFamily="'DM Mono',monospace">{score}</text>
    </svg>
  )
}

function CategoryBar({ label, score, finding }) {
  const color = score >= 70 ? 'teal' : score >= 45 ? 'amber' : 'red'
  return (
    <div className="cat-bar">
      <div className="cat-header">
        <span className="cat-label">{label}</span>
        <span className={`cat-score score-${color}`}>{score}</span>
      </div>
      <div className="bar-track">
        <div className={`bar-fill fill-${color}`} style={{ width: `${score}%` }} />
      </div>
      <p className="cat-finding">{finding}</p>
    </div>
  )
}

function VerdictBadge({ verdict }) {
  const map = {
    'STRONG BUY': { cls: 'teal', icon: <CheckCircle size={14} /> },
    'BUY': { cls: 'blue', icon: <CheckCircle size={14} /> },
    'HOLD': { cls: 'amber', icon: <AlertCircle size={14} /> },
    'AVOID': { cls: 'red', icon: <XCircle size={14} /> },
  }
  const v = map[verdict] || map['HOLD']
  return (
    <span className={`verdict-badge verdict-${v.cls}`}>
      {v.icon} {verdict}
    </span>
  )
}

function Empty() {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Anchor size={32} /></div>
      <h2 className="empty-title">Ready to underwrite</h2>
      <p className="empty-desc">Enter vessel details on the left and run the AI analysis to get a comprehensive investment risk report — including scores, yield estimates, and tokenization suitability.</p>
      <div className="empty-features">
        {[
          { icon: <BarChart2 size={14} />, text: '5-category risk scoring' },
          { icon: <Cpu size={14} />, text: 'Grok-powered analysis' },
          { icon: <Shield size={14} />, text: 'Tokenization fit assessment' },
          { icon: <TrendingUp size={14} />, text: 'Yield range projection' },
        ].map((f, i) => (
          <div className="empty-feature" key={i}>{f.icon}<span>{f.text}</span></div>
        ))}
      </div>
    </div>
  )
}

function Loading() {
  const steps = ['Fetching vessel class data...', 'Analyzing charter market...', 'Assessing tokenization fit...', 'Generating risk report...']
  return (
    <div className="loading-state">
      <div className="loading-spinner"><Loader2 size={28} className="spin-lg" /></div>
      <h2 className="loading-title">Analyzing vessel</h2>
      <div className="loading-steps">
        {steps.map((s, i) => (
          <div className="loading-step" key={i} style={{ animationDelay: `${i * 0.4}s` }}>
            <div className="step-dot" />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalysisResult({ analysis, loading, error }) {
  if (loading) return <Loading />
  if (error) return (
    <div className="error-state">
      <AlertTriangle size={24} className="error-icon" />
      <p className="error-title">Analysis failed</p>
      <p className="error-msg">{error}</p>
    </div>
  )
  if (!analysis) return <Empty />

  const { overallScore, verdict, verdictReason, categories, keyRisks, investmentHighlights,
    estimatedYield, tokenizationSuitability, tokenizationNotes, analystNote, vessel } = analysis

  const tokColor = tokenizationSuitability === 'HIGH' ? 'teal' : tokenizationSuitability === 'MEDIUM' ? 'amber' : 'red'

  return (
    <div className="result">
      <div className="result-hero">
        <div className="hero-left">
          <p className="vessel-label">{vessel.type} · {vessel.yearBuilt} · {vessel.dwt?.toLocaleString()} DWT</p>
          <h2 className="vessel-name">{vessel.name}</h2>
          <VerdictBadge verdict={verdict} />
          <p className="verdict-reason">{verdictReason}</p>
        </div>
        <div className="hero-right">
          <ScoreRing score={overallScore} size={90} />
          <p className="score-label">Overall Score</p>
        </div>
      </div>

      <div className="yield-cards">
        {[
          { label: 'Bear case', val: estimatedYield?.low, cls: 'red' },
          { label: 'Base case', val: estimatedYield?.mid, cls: 'teal' },
          { label: 'Bull case', val: estimatedYield?.high, cls: 'blue' },
        ].map(c => (
          <div className="yield-card" key={c.label}>
            <span className="yc-label">{c.label}</span>
            <span className={`yc-val yc-${c.cls}`}>{c.val}%</span>
            <span className="yc-sub">p.a. yield</span>
          </div>
        ))}
      </div>

      <div className="section">
        <h3 className="section-title">Risk Categories</h3>
        <div className="categories">
          {categories && Object.values(categories).map((cat) => (
            <CategoryBar key={cat.label} label={cat.label} score={cat.score} finding={cat.finding} />
          ))}
        </div>
      </div>

      <div className="two-col">
        <div className="section">
          <h3 className="section-title"><TrendingUp size={14} /> Investment Highlights</h3>
          <ul className="list list-green">
            {investmentHighlights?.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
        <div className="section">
          <h3 className="section-title"><AlertTriangle size={14} /> Key Risks</h3>
          <ul className="list list-red">
            {keyRisks?.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      </div>

      <div className="token-section">
        <div className="token-header">
          <Cpu size={16} />
          <h3 className="section-title" style={{margin:0}}>Tokenization Assessment</h3>
          <span className={`tok-badge tok-${tokColor}`}>{tokenizationSuitability} suitability</span>
        </div>
        <p className="token-notes">{tokenizationNotes}</p>
      </div>

      <div className="analyst-note">
        <div className="analyst-header">
          <div className="analyst-avatar">AI</div>
          <div>
            <p className="analyst-name">Grok Analyst</p>
            <p className="analyst-sub">AI Underwriting Engine</p>
          </div>
        </div>
        <p className="analyst-text">"{analystNote}"</p>
      </div>

      <p className="disclaimer">This analysis is AI-generated for informational purposes only. Not financial advice. Conduct independent due diligence before investing.</p>
    </div>
  )
}
