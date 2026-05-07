# VesselIQ — AI Vessel Underwriting Engine

> An AI-powered maritime investment underwriting tool built with React + Grok API. Designed as a product concept for [Shipfinex](https://www.shipfinex.com) — the fractional ship ownership platform.

**Live demo:** `https://shanitnagre.github.io/vessel-underwriter/`

![VesselIQ Screenshot](https://via.placeholder.com/1200x630/0a0e14/00d4aa?text=VesselIQ+%E2%80%94+AI+Vessel+Underwriting)

## What it does

Enter any commercial vessel's details and get an instant AI-powered underwriting report including:

- **Overall investment score** (0–100) with animated ring display
- **5-category risk scoring** — Vessel Condition, Market Position, Charter Coverage, Tokenization Fit, Regulatory Risk
- **Yield range projection** — Bear / Base / Bull case annual yields
- **Tokenization suitability assessment** — specific to blockchain-based fractional ownership (MAT structure, SPV considerations)
- **Key risks & investment highlights**
- **AI analyst commentary** via Grok

## Tech stack

- React + Vite
- xAI Grok API (`grok-3-mini`)
- Lucide icons
- GitHub Pages (auto-deploy via Actions)
- No backend — API key stored locally in browser

## Getting started

```bash
git clone https://github.com/shanitnagre/vessel-underwriter
cd vessel-underwriter
npm install
npm run dev
```

Open `http://localhost:5173/vessel-underwriter/` and enter your [Grok API key](https://console.x.ai) when prompted.

## Deploy to GitHub Pages

1. Fork or clone this repo
2. In your GitHub repo settings → Pages → set Source to **GitHub Actions**
3. Push to `main` — the workflow auto-deploys to `https://<your-username>.github.io/vessel-underwriter/`

## About

Built by [Shanit Nagre](https://shanitnagre.github.io) as a product concept demonstrating how AI + Web3 can power the next generation of maritime investment infrastructure.

---

*Not financial advice. Analysis is AI-generated for illustrative purposes.*
