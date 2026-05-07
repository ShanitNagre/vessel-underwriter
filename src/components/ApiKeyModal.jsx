import { useState } from 'react'
import { Key, X, ExternalLink } from 'lucide-react'
import './ApiKeyModal.css'

export default function ApiKeyModal({ onSave, onClose, hasKey }) {
  const [key, setKey] = useState('')

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-icon"><Key size={18} /></div>
          <div>
            <h2 className="modal-title">Grok API Key</h2>
            <p className="modal-sub">Required to run AI underwriting analysis</p>
          </div>
          {hasKey && <button className="modal-close" onClick={onClose}><X size={16} /></button>}
        </div>
        <div className="modal-body">
          <p className="modal-desc">
            VesselIQ uses <strong>xAI's Grok</strong> to perform deep vessel investment analysis.
            Your key is stored locally in your browser and never sent to any server.
          </p>
          <input
            type="password"
            placeholder="xai-xxxxxxxxxxxxxxxx"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && key && onSave(key)}
          />
          <a className="get-key-link" href="https://console.x.ai" target="_blank" rel="noreferrer">
            Get your API key at console.x.ai <ExternalLink size={12} />
          </a>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={() => key && onSave(key)} disabled={!key}>
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
