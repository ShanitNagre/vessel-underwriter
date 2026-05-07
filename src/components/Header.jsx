import { Settings, Anchor } from 'lucide-react'
import './Header.css'

export default function Header({ onSettings }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-icon">
            <Anchor size={16} />
          </div>
          <div>
            <span className="brand-name">VesselIQ</span>
            <span className="brand-tag">AI Underwriting Engine</span>
          </div>
        </div>
        <div className="header-right">
          <span className="powered">Powered by Grok AI · Built for Shipfinex</span>
          <button className="settings-btn" onClick={onSettings} title="API Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
