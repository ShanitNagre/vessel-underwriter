import { useState } from 'react'
import { Search, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import './VesselForm.css'

const PRESETS = {
  bulk: {
    name: 'MV Pacific Fortune',
    type: 'Bulk Carrier',
    yearBuilt: '2015',
    dwt: '82000',
    flag: 'Marshall Islands',
    classification: 'DNV',
    charterRate: '14500',
    marketValue: '28',
    owners: '2',
    lastSurvey: '2022',
    employment: 'Time charter (12 months remaining)',
    notes: 'Well-maintained Kamsarmax. Minor repairs done in 2023 drydock.'
  },
  tanker: {
    name: 'MT Horizon Star',
    type: 'Product Tanker',
    yearBuilt: '2011',
    dwt: '50000',
    flag: 'Liberia',
    classification: 'ABS',
    charterRate: '18000',
    marketValue: '22',
    owners: '3',
    lastSurvey: '2021',
    employment: 'Spot market',
    notes: 'MR tanker. Currently on spot market in Middle East Gulf region.'
  }
}

export default function VesselForm({ onAnalyze, loading }) {
  const [form, setForm] = useState({
    name: '', type: 'Bulk Carrier', yearBuilt: '', dwt: '',
    flag: '', classification: '', charterRate: '', marketValue: '',
    owners: '1', lastSurvey: '', employment: '', notes: ''
  })
  const [advanced, setAdvanced] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const loadPreset = (key) => setForm({ ...PRESETS[key] })

  const isValid = form.name && form.yearBuilt && form.dwt && form.charterRate && form.marketValue

  return (
    <div className="vessel-form">
      <div className="form-header">
        <h1 className="form-title">Vessel Analysis</h1>
        <p className="form-desc">Enter vessel details for AI-powered investment underwriting</p>
      </div>

      <div className="preset-row">
        <span className="preset-label">Quick load:</span>
        <button className="preset-btn" onClick={() => loadPreset('bulk')}>Bulk Carrier</button>
        <button className="preset-btn" onClick={() => loadPreset('tanker')}>Tanker</button>
      </div>

      <div className="fields">
        <div className="field">
          <label>Vessel Name</label>
          <input placeholder="e.g. MV Pacific Fortune" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="field">
          <label>Vessel Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {['Bulk Carrier','Oil Tanker','Product Tanker','Container Ship','LNG Carrier',
              'LPG Carrier','Chemical Tanker','General Cargo','RORO','Offshore Vessel'].map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Year Built</label>
            <input type="number" placeholder="2015" min="1970" max="2024" value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} />
          </div>
          <div className="field">
            <label>DWT (tonnes)</label>
            <input type="number" placeholder="82000" value={form.dwt} onChange={e => set('dwt', e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Charter Rate ($/day)</label>
            <input type="number" placeholder="14500" value={form.charterRate} onChange={e => set('charterRate', e.target.value)} />
          </div>
          <div className="field">
            <label>Market Value ($M)</label>
            <input type="number" placeholder="28" value={form.marketValue} onChange={e => set('marketValue', e.target.value)} />
          </div>
        </div>

        <button className="advanced-toggle" onClick={() => setAdvanced(a => !a)}>
          {advanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {advanced ? 'Hide' : 'Show'} advanced fields
        </button>

        {advanced && (
          <div className="advanced-fields">
            <div className="field-row">
              <div className="field">
                <label>Flag State</label>
                <input placeholder="Marshall Islands" value={form.flag} onChange={e => set('flag', e.target.value)} />
              </div>
              <div className="field">
                <label>Classification</label>
                <select value={form.classification} onChange={e => set('classification', e.target.value)}>
                  <option value="">Select...</option>
                  {['DNV','ABS','Lloyd\'s Register','Bureau Veritas','ClassNK','RINA','KR'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Previous Owners</label>
                <input type="number" min="1" max="10" value={form.owners} onChange={e => set('owners', e.target.value)} />
              </div>
              <div className="field">
                <label>Last Special Survey</label>
                <input type="number" placeholder="2022" min="2010" max="2025" value={form.lastSurvey} onChange={e => set('lastSurvey', e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Current Employment</label>
              <input placeholder="Time charter, spot market, etc." value={form.employment} onChange={e => set('employment', e.target.value)} />
            </div>

            <div className="field">
              <label>Additional Notes</label>
              <textarea rows={3} placeholder="Any additional context about the vessel..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{resize:'vertical'}} />
            </div>
          </div>
        )}
      </div>

      <button className="analyze-btn" onClick={() => onAnalyze(form)} disabled={!isValid || loading}>
        {loading ? (
          <><Loader2 size={16} className="spin" /> Analyzing vessel...</>
        ) : (
          <><Search size={16} /> Run AI Underwriting</>
        )}
      </button>

      {!isValid && !loading && (
        <p className="hint">Fill in vessel name, year, DWT, charter rate, and market value to continue</p>
      )}
    </div>
  )
}
