# WaterWise — Product and System Overview

## Purpose
WaterWise is a planning application for estimating household rainwater harvesting and greywater reuse potential. It brings user-editable assumptions, visual explanations, calculations, and recommendations into one interface.

## Problem statement
Households often lack a simple way to compare roof catchment potential, seasonal rainfall, collection losses, storage capacity, and non-potable demand. WaterWise makes these assumptions visible so users can explore scenarios rather than treat a single estimate as a guarantee.

## Product goals
- Explain the water flow from roof catchment to storage and reuse using a responsive Canvas/SVG illustration.
- Let users adjust roof area, rainfall, runoff/collection assumptions, household size, and demand.
- Present derived quantities with units and enough context to understand the estimate.
- Provide recommendations and a path toward saved properties, calculation history, sensor telemetry, and measured-vs-predicted evaluation.
- Keep UI, domain calculations, HTTP transport, persistence, and infrastructure concerns separated.

## Primary user journey
1. Open the dashboard and inspect the roof-to-tank visualization.
2. Adjust catchment and household assumptions.
3. Review estimated harvest, demand offset, and indicative storage sizing.
4. Compare recommendations and the assumptions behind them.
5. Export a scenario or, once persistence/authentication is implemented, save it to a property history.

## Current scope
The repository is a development starter with a Next.js frontend, NestJS API, shared TypeScript contracts, TypeORM entity definitions, PostgreSQL/PostGIS initialization SQL, and Docker Compose configuration. The calculation path is deterministic and explainable; it is not a trained machine-learning system. Rainfall data must be treated as illustrative until connected to a verified provider and documented for location, period, units, and provenance.

## Out of scope for production use today
- User authentication, tenant/property authorization, and account lifecycle.
- Production-grade persistence of all dashboard scenarios and audit history.
- Verified operational rainfall feeds and calibrated local forecasts.
- Safety certification for potable reuse or water-quality decisions.
- Production monitoring, backups, disaster recovery, and deployment hardening.

## Success measures to instrument
- Scenario completion rate and time to first useful estimate.
- Percentage of calculations with explicit, reviewable assumptions.
- API error/latency rate and calculation reproducibility.
- If sensor integrations are added: prediction error by location and season, data freshness, and sensor-quality flags.

## Repository map
- `apps/web/` — Next.js UI and visual interaction.
- `apps/api/` — NestJS transport and application services.
- `packages/shared/` — shared TypeScript types/contracts.
- `database/init/` — PostgreSQL/PostGIS bootstrap SQL.
- `docs/` — architecture, operations, data model, API, security, and decisions.
- `docker-compose.yml` — local PostgreSQL service.

## Related documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA_MODEL.md)
- [API conventions](docs/API.md)
- [Local development](docs/DEVELOPMENT.md)
- [Security checklist](docs/SECURITY.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/adr/README.md)
