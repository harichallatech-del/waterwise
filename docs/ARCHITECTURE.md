# Architecture

See the root [ARCHITECTURE.md](../ARCHITECTURE.md) for the system overview and dependency diagram.

## Package boundaries
`apps/web` owns presentation and browser interaction. `apps/api` owns HTTP transport, application orchestration, and persistence integration. `packages/shared` contains stable transport contracts only; it should not become a dumping ground for server internals or UI components.

## Boundary rules
- Controllers translate HTTP input/output; they do not implement calculations.
- DTOs validate external input; domain objects enforce business invariants regardless of entry point.
- Application services coordinate use cases; pure domain functions remain easy to unit test.
- DAO/repository interfaces are defined inward and adapters implement them outward.
- TypeORM entities and database row shapes do not leak into public API responses.
- External rainfall/sensor provider formats are translated by adapters before entering the domain.

## Failure handling
Use stable error response shapes, map validation failures to 400, missing resources to 404, conflicts to 409, and unexpected errors to 500 without exposing stack traces or secrets. External provider timeouts and malformed data should be surfaced as explicit unavailable/stale-data states rather than silently represented as verified values.
