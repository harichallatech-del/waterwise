# Architecture Decision Records (ADRs)

Record important technical decisions here. Keep each decision dated and explicit about alternatives and consequences.

## ADR template
Create `NNNN-short-title.md` with status, date, context, decision, alternatives, and consequences.

## ADR-0001 — TypeScript monorepo
- **Status:** Accepted
- **Context:** Frontend and backend need coordinated request/response contracts.
- **Decision:** Keep Next.js, NestJS, and shared TypeScript contracts in one repository/workspace.
- **Consequences:** Contract changes can be coordinated; package boundaries and build scripts must remain explicit.

## ADR-0002 — PostgreSQL with PostGIS
- **Status:** Accepted
- **Context:** Relational integrity is needed for household/site metadata and time-series records; spatial queries may be useful.
- **Decision:** Use PostgreSQL and enable PostGIS for spatial capabilities where available and needed.
- **Consequences:** Local setup is reproducible through Compose; production schema evolution should use versioned migrations.

## ADR-0003 — Explainable deterministic estimates first
- **Status:** Accepted
- **Context:** Planning estimates must communicate assumptions before model-driven predictions are introduced.
- **Decision:** Start with explicit deterministic calculations and rule-based recommendations; treat sample rainfall as illustrative.
- **Consequences:** Results are auditable; ML claims require measured data, evaluation, and model versioning.
