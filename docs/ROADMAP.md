# Delivery Roadmap

## Phase 1 — Establish reliable estimates
- [ ] Extract calculation formulas into pure, unit-tested domain functions.
- [ ] Show units, formula version, assumptions, and uncertainty/limitations beside every estimate.
- [ ] Add form validation, loading/error/empty states, keyboard access, and reduced-motion support.
- [ ] Add a stable API error contract and request correlation IDs.
- [ ] Add CI for lint, type-check, unit tests, and production builds.

## Phase 2 — Durable user scenarios
- [ ] Add authentication and property-level authorization.
- [ ] Add versioned database migrations and integration tests.
- [ ] Persist calculation snapshots and provide paginated scenario history/comparison.
- [ ] Add export/import with schema versioning and input validation.

## Phase 3 — Ground truth and recommendations
- [ ] Integrate a verified rainfall source with attribution, location resolution, historical range, units, and freshness indicators.
- [ ] Build a provider adapter and caching/rate-limit strategy.
- [ ] Make recommendations explainable: reason, expected benefit, cost/effort assumptions, and applicability constraints.
- [ ] Validate storage-sizing guidance against regional standards and qualified domain review.

## Phase 4 — Greywater and sensors
- [ ] Define non-potable demand categories and treatment assumptions.
- [ ] Add authenticated sensor provisioning, idempotent ingestion, and outlier/staleness flags.
- [ ] Add water-quality sampling records and clear safety boundaries.
- [ ] Compare predictions with observations using held-out data and publish error metrics.

## Phase 5 — Production readiness
- [ ] Threat model, penetration test, privacy review, and dependency scanning.
- [ ] Production observability, backups, restore drills, deployment/rollback automation.
- [ ] Performance/load tests and accessibility audit.
- [ ] Document support, incident response, data retention, and service-level objectives.

## Definition of done
A feature is complete when its behavior is tested, inputs and outputs are documented, failures are handled, accessibility is considered, telemetry/privacy implications are reviewed, and required migrations are included.
