import { useState } from 'react'
import Header from './components/Header'
import VesselForm from './components/VesselForm'
import AnalysisResult from './components/AnalysisResult'
import ApiKeyModal from './components/ApiKeyModal'
import './App.css'

export default function App() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROK_KEY || localStorage.getItem('grok_key') || '')
const [showModal, setShowModal] = useState(!import.meta.env.VITE_GROK_KEY && !localStorage.getItem('grok_key'))  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSaveKey = (key) => {
    localStorage.setItem('grok_key', key)
    setApiKey(key)
    setShowModal(false)
  }

  const analyzeVessel = async (vesselData) => {
    if (!apiKey) { setShowModal(true); return }
    setLoading(true)
    setError('')
    setAnalysis(null)

    const prompt = `You are an expert maritime investment underwriter and Web3 tokenization specialist. Analyze the following vessel for fractional ownership investment on a blockchain platform like Shipfinex.

Vessel Details:
- Name: ${vesselData.name}
- Type: ${vesselData.type}
- Year Built: ${vesselData.yearBuilt}
- DWT (Deadweight Tonnage): ${vesselData.dwt} tonnes
- Flag State: ${vesselData.flag}
- Classification Society: ${vesselData.classification}
- Current Charter Rate: $${vesselData.charterRate}/day
- Estimated Market Value: $${vesselData.marketValue}M
- Number of Previous Owners: ${vesselData.owners}
- Last Special Survey: ${vesselData.lastSurvey}
- Current Employment: ${vesselData.employment}
- Additional Notes: ${vesselData.notes || 'None'}

Provide a comprehensive investment underwriting report in the following EXACT JSON structure (respond ONLY with valid JSON, no markdown, no preamble):

{
  "overallScore": <integer 0-100>,
  "verdict": "<STRONG BUY | BUY | HOLD | AVOID>",
  "verdictReason": "<one punchy sentence summarizing the verdict>",
  "categories": {
    "vesselCondition": {
      "score": <0-100>,
      "label": "Vessel Condition",
      "finding": "<2-3 sentence analysis>"
    },
    "marketPosition": {
      "score": <0-100>,
      "label": "Market Position",
      "finding": "<2-3 sentence analysis>"
    },
    "charterCoverage": {
      "score": <0-100>,
      "label": "Charter Coverage",
      "finding": "<2-3 sentence analysis>"
    },
    "tokenizationFit": {
      "score": <0-100>,
      "label": "Tokenization Fit",
      "finding": "<2-3 sentence analysis — suitability for blockchain fractional ownership>"
    },
    "regulatoryCompliance": {
      "score": <0-100>,
      "label": "Regulatory & Flag Risk",
      "finding": "<2-3 sentence analysis>"
    }
  },
  "keyRisks": [
    "<risk 1>",
    "<risk 2>",
    "<risk 3>"
  ],
  "investmentHighlights": [
    "<highlight 1>",
    "<highlight 2>",
    "<highlight 3>"
  ],
  "estimatedYield": {
    "low": <number>,
    "mid": <number>,
    "high": <number>
  },
  "tokenizationSuitability": "<HIGH | MEDIUM | LOW>",
  "tokenizationNotes": "<2-3 sentences on Web3/MAT suitability, SPV structure recommendation, and smart contract considerations>",
  "analystNote": "<A candid, opinionated 2-3 sentence closing note from the AI underwriter>"
}`

    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'grok-3-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const text = data.choices[0].message.content.trim()
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAnalysis({ ...parsed, vessel: vesselData })
    } catch (e) {
      setError(e.message || 'Analysis failed. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      {showModal && <ApiKeyModal onSave={handleSaveKey} onClose={() => setShowModal(false)} hasKey={!!apiKey} />}
      <Header onSettings={() => setShowModal(true)} />
      <main className="main">
        <div className="layout">
          <div className="form-col">
            <VesselForm onAnalyze={analyzeVessel} loading={loading} />
          </div>
          <div className="result-col">
            <AnalysisResult analysis={analysis} loading={loading} error={error} />
          </div>
        </div>
      </main>
    </div>
  )
}
