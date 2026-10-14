# Data Model and Table Responsibilities

The authoritative bootstrap schema is in `database/init/001-schema.sql`; entity classes live under `apps/api/src/database/entities/`. Always compare these two sources when changing the model. In a production workflow, version schema changes as migrations rather than editing an already-applied initialization script.

## Logical entities

| Entity/table area | Responsibility | Important considerations |
|---|---|---|
| Profiles | User preferences and profile metadata | Add identity-provider mapping and retention rules before launch |
| Properties | Household/site location and ownership | Authorization must scope every query by owner/tenant |
| Roof surfaces | Catchment area, material, runoff assumptions | Validate area and coefficient bounds |
| Rainfall records | Observed or forecast precipitation | Store source, timestamp, units, location, quality and freshness |
| Water-use profiles | Household size and demand assumptions | Version defaults; distinguish user inputs from inferred values |
| Calculation runs | Immutable inputs/outputs for reproducibility | Store formula/version and assumptions snapshot |
| Recommendations | Suggested actions and rationale | Persist rule version and supporting calculation reference |
| Sensors and readings | Device metadata and telemetry | Idempotent ingestion, timestamp normalization, device authentication |
| Treatment methods | Treatment process assumptions | Do not imply potable safety without validated evidence |
| Water-quality measurements | Lab/sensor values and units | Record method, detection limit, sample time and quality flags |
| Model versions/outcomes | Evaluation metadata for future predictive models | No claim of ML accuracy without evaluation datasets and metrics |

## Data integrity recommendations
- Use foreign keys and deliberate delete behavior; prefer soft deletion for auditable business records where appropriate.
- Add indexes for common filters, especially foreign keys, property/time history queries, and sensor/time-series reads.
- Store timestamps in UTC (`timestamptz`) and convert only at presentation boundaries.
- Store physical units explicitly or standardize them in schema/API contracts. Never mix mm and cm or litres and cubic metres silently.
- Snapshot input assumptions, formula version, source identifiers, and output units with every calculation run.
- Treat coordinates and property data as sensitive; minimize collection and apply retention controls.
- If PostGIS is enabled, add spatial indexes for spatial search only when the relevant geometry/geography columns exist.

## Change procedure
1. Update entity/domain types and SQL migration together.
2. Add constraints and indexes with a rollback strategy.
3. Update shared API contracts and DTOs.
4. Add repository, service, and API tests.
5. Document migration order and any backfill.
