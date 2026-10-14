# API
All routes use `/api/v1`.
- `GET /health`
- `GET /rainfall/monthly?city=Hyderabad` — illustrative values only, not verified.
- `GET /recommendations` — starter rule-based guidance.
- `POST /calculations` — validated estimate; current starter does not persist calculation runs.

Example POST body:
```json
{
  "roofAreaSqFt": 1200, "monthlyRainfallMm": 65,
  "runoffCoefficient": 0.82, "collectionEfficiency": 0.88,
  "people": 4, "bathEventsPerPersonPerDay": 1.2,
  "litresPerBathEvent": 35, "laundryLitresPerDay": 48,
  "greywaterRecoveryFraction": 0.65, "dailyDemandLitres": 540,
  "tankCapacityLitres": 5000
}
```
