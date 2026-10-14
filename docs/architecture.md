# Architecture
Modular monolith grouped by domain. Controllers map HTTP, DTOs validate requests, services implement business logic, generic `Dao<T>` and `TypeOrmDao<T>` provide a reusable persistence abstraction, and TypeORM entities map relational records. NestJS dependency injection composes modules; shared TS contracts are kept in `packages/shared`.

Future extension: a `CalculationStrategy` interface for deterministic/forecast/validated-ML approaches. Keep model inference separate only if model dependencies justify it. Do not expose unrestricted generic CRUD directly to clients; add owner-scoped repository methods and authorization.
