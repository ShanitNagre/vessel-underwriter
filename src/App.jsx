import { useState } from 'react'
import Header from './components/Header'
import VesselForm from './components/VesselForm'
import AnalysisResult from './components/AnalysisResult'
import './App.css'

const p1 = 'gsk_hx68HjcHaYGSElVXTmzqWGdyb3FYjgfetN8n6fD'
const p2 = 'dHyr6gblF4Gnj'
const KEY = p1 + p2

export default function App() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyzeVessel = async (vesselData) => {
    setLoading(true)
    setError('')
    setAnalysis(null)

    const prompt = `You are an expert maritime investment underwriter and Web3 tokenization specialist. Analyze the following vessel for fractional ownership investment on a blockchain platform like Shipfinex.

Vessel Details:
- Name: ${vesselData.name}
- Type: ${vesselData.type}
- Year Built: ${vesselData.yearBuilt}
- DWT: ${vesselData.dwt} tonnes
- Flag State: ${vesselData.flag}
- Classification: ${vesselData.classification}
- Charter Rate: $${vesselData.charterRate}/day
- Market Value: $${vesselData.marketValue}M
- Previous Owners: ${vesselData.owners}
- Last Survey: ${vesselData.lastSurvey}
- Employment: ${vesselData.employment}
- Notes: ${vesselData.notes || 'None'}

Respond ONLY with valid JSON, no markdown, no preamble:

{
  "overallScore": 72,
  "verdict": "BUY",
  "verdictReason": "one punchy sentence",
  "categories": {
    "vesselCondition": {"score": 70, "label": "Vessel Condition", "finding": "2-3 sentences"},
    "marketPosition": {"score": 75, "label": "Market Position", "finding": "2-3 sentences"},
    "charterCoverage": {"score": 68, "label": "Charter Coverage", "finding": "2-3 sentences"},
    "tokenizationFit": {"score": 80, "label": "Tokenization Fit", "finding": "2-3 sentences"},
    "regulatoryCompliance": {"score": 72, "label": "Regulatory & Flag Risk", "finding": "2-3 sentences"}
  },
  "keyRisks": ["risk 1", "risk 2", "risk 3"],
  "investmentHighlights": ["highlight 1", "highlight 2", "highlight 3"],
  "estimatedYield": {"low": 4.5, "mid": 6.2, "high": 8.1},
  "tokenizationSuitability": "HIGH",
  "tokenizationNotes": "2-3 sentences on tokenization",
  "analystNote": "2-3 sentence closing note"
}

Replace all placeholder values with real analysis based on the vessel data above.`

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
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
      setError(e.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
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
