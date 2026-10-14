# WaterWise — Building Water Intelligence

A responsive React + TypeScript + Vite prototype for estimating:
- rooftop rainwater collection from roof area and rainfall
- shower and laundry greywater generation
- combined annual and daily recovery potential
- indicative water-demand offset
- monthly scenario visualizations
- CSV export of assumptions and results

## Stack
- React 19.3 + TypeScript
- Vite 7
- Motion for React (`motion`)
- Recharts
- Lucide React
- Custom responsive CSS design system

## Run locally
Requires Node.js 20.19+ or 22.12+ recommended for current Vite releases.

```bash
npm install
npm run dev
```

Open the URL shown by Vite (typically http://localhost:5173).

Build for production:

```bash
npm run build
npm run preview
```

## Model equations
Rainwater estimate (litres/year):
`roof area (m²) × annual rainfall (mm) × runoff coefficient × (1 - collection losses)`

Shower water (litres/day):
`people × shower flow (L/min) × shower duration (min) × showers per person/week ÷ 7`

Laundry water (litres/day):
`loads per week × litres per load ÷ 7`

Greywater captured:
`(shower + laundry) × capture rate`

The app converts roof area from square feet to square metres. The default monthly rainfall distribution is illustrative and not a live Hyderabad forecast. Demand offset uses 135 L/person/day as an adjustable planning benchmark.

## AI / ML status and roadmap
This version is a transparent deterministic estimator with rule-based recommendations, not a trained ML model. This is intentional: the estimates are explainable and do not imply model validation that does not exist.

To add real AI/ML:
1. Connect a trusted weather API and location-specific rainfall history.
2. Capture actual flow-meter and tank-level sensor data with consent.
3. Fit and validate a time-series model against held-out seasons.
4. Report uncertainty ranges and monitor forecast error.
5. Keep water-quality treatment and safety controls rule-based and validated; ML volume forecasts are not water-quality certification.

## Important limitations
- Indicative planning tool only; not a certified engineering design.
- Roof runoff coefficient, rainfall, collection losses, flow rates and capture rates are assumptions.
- Annual yield is not equivalent to reliable daily supply; tank sizing needs rainfall timing and demand.
- Greywater reuse requires source separation, treatment appropriate to intended use, safe storage, and local regulatory compliance.
- Never cross-connect potable and non-potable pipes. Do not use untreated greywater for drinking or food preparation.
- Check local building codes, groundwater recharge suitability, water-quality standards and public-health requirements.

## Production hardening checklist
- Add location-aware rainfall history/forecast API with attribution and caching.
- Add authenticated project save/load and versioned assumptions.
- Add server-side report generation and PDF export if required.
- Add automated unit tests for model equations and UI tests for key flows.
- Add accessibility review, privacy/security review and deployment monitoring.
