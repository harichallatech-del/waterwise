# WaterWise Platform
Creative water-intelligence app starter: Next.js + React frontend, NestJS modular API, TypeORM entity/DAO pattern, PostgreSQL + PostGIS, SQL startup schema.

## Three priority features
1. Combined rooftop rainwater and bath/laundry greywater estimator with editable assumptions and CSV export.
2. Rainfall records that include source and verification metadata, ready for Hyderabad/Telangana-specific verified data.
3. Explainable recommendations plus versioned calculations, sensor readings and prediction-vs-observed tables to support future model validation.

## Run
Requirements: Node.js 20+, npm, Docker.
1. `cp .env.example .env`
2. `docker compose up -d postgres`
3. `npm install`
4. `npm run dev`
Frontend http://localhost:3000; API health http://localhost:4000/api/v1/health.
Separate: `npm run dev:web`, `npm run dev:api`. Build: `npm run build`.

Docker runs `database/init/001-schema.sql` only for a fresh volume. Do not run startup SQL and migration twice on the same DB. `docker compose down -v` destroys local DB data.

## Architecture
`apps/web`: responsive Next.js application, custom CSS, SVG illustration, Canvas rain animation.
`apps/api`: NestJS controllers, DTO validation, services, TypeORM entities, generic DAO abstraction.
`packages/shared`: shared TS contracts.
`database/init`: PostgreSQL/PostGIS schema.
`docs`: architecture, data dictionary, API payload.

## Important
This is a development starter. The calculator is deterministic and explainable, not trained ML. Sample rainfall values are illustrative and not authoritative observations. Greywater estimates do not establish water quality or safe reuse. Seek qualified engineering review for tank sizing, treatment, plumbing separation, groundwater recharge and local compliance. Before production add authentication, property ownership authorization, rate limiting, logs, monitoring, tests, backups, secret management and migration verification.
