# Security and Privacy Checklist

This checklist identifies work required before production. It is not a security certification.

## Required before storing real household data
- [ ] Authentication with secure session/token handling.
- [ ] Authorization on every property, calculation-history, sensor, and water-quality resource; never trust a client-supplied owner ID.
- [ ] Input validation, request-size limits, rate limiting, and abuse controls.
- [ ] CORS restricted to approved origins; secure headers and TLS at the deployment edge.
- [ ] Secrets stored in a secret manager/environment, rotated periodically, and excluded from logs and source control.
- [ ] Database least-privilege credentials; network isolation; backups encrypted and restore-tested.
- [ ] Audit policy for sensitive changes and access to household location data.
- [ ] Data minimization, retention/deletion policy, privacy notice, and consent where applicable.
- [ ] Dependency scanning, lockfile review, patch process, and CI checks.
- [ ] Structured logs with redaction; no passwords, tokens, precise addresses, or sensitive payloads in logs.

## Water safety boundaries
WaterWise estimates capture and non-potable reuse potential; it must not imply that rainwater or greywater is potable or safe for a specific use without appropriate testing, treatment design, local code compliance, and qualified review. Water-quality measurements should carry units, sampling method, timestamp, and quality flags.

## Operational readiness
Add readiness/liveness checks, monitoring and alerting, database migration controls, backup retention, recovery objectives, incident response procedures, and an environment-specific threat model before launch.
