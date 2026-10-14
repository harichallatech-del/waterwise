# API Conventions

Base path: `/api/v1` (unless changed in API configuration). The health endpoint is intended to be available at `/api/v1/health`.

## Current starter endpoints
Consult controller source for the definitive route list; the starter includes health, calculation, illustrative rainfall, and recommendation paths. Treat rainfall responses as sample/illustrative until an actual provider integration and provenance metadata are implemented.

## API design rules
- Use nouns and resource-oriented routes; use POST for calculation commands that accept structured input.
- Validate with DTOs at the boundary and reject unknown or out-of-range values where appropriate.
- Include units in property names or response metadata, e.g. `rainfallMm`, `roofAreaM2`, `harvestableLitres`.
- Return a stable envelope for errors with `statusCode`, machine-readable `code`, human-readable `message`, and optional field errors. Never return stack traces.
- Use pagination for histories and readings; bound page size.
- Version breaking changes under a new API version or provide a deprecation window.
- Add authentication and object-level authorization before exposing private properties or histories.

## Example calculation request
```json
{
  "roofAreaM2": 100,
  "annualRainfallMm": 800,
  "runoffCoefficient": 0.8,
  "collectionEfficiency": 0.9
}
```

This example illustrates naming and units, not a guarantee that the current DTO accepts exactly these fields. Confirm the DTO/controller source before integrating a client.

## Testing expectations
- DTO tests for invalid bounds and missing required fields.
- Unit tests for formula edge cases and unit conversions.
- Controller tests for status codes and response contracts.
- Integration tests against PostgreSQL for repository behavior and constraints.
- Contract tests ensuring frontend/shared types agree with actual response payloads.
