# Contributing

## Workflow
1. Create a focused branch and keep changes small enough to review.
2. Describe the user problem and intended behavior in the pull request.
3. Add or update tests for domain rules, API contracts, and persistence changes.
4. Update documentation and migrations alongside code changes.
5. Run available lint, type-check, test, and build scripts before requesting review.

## Code guidelines
- Use strict TypeScript and explicit return types for public service/domain APIs.
- Keep controllers thin and domain calculations pure where possible.
- Prefer composition and dependency injection to global state.
- Avoid `any`; document unavoidable boundary casts.
- Use clear physical units in names and contracts.
- Never commit `.env`, credentials, personal household data, or production exports.
- Do not present illustrative or stale data as verified/current.

## Pull request checklist
- [ ] Scope and behavior are clear.
- [ ] Tests cover expected and failure cases.
- [ ] API/schema changes are backwards-compatible or versioned.
- [ ] Migrations and rollback considerations are included where needed.
- [ ] Accessibility, privacy, and security implications were reviewed.
- [ ] Documentation reflects the actual implementation.
