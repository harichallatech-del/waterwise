# Local Development

## Prerequisites
- Node.js 20 or newer and npm.
- Docker Engine with Docker Compose.
- Git (recommended).

## Setup
From the repository root:

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run dev
```

Use the root `package.json` scripts as the source of truth for workspace commands. If the script names or service names differ from these instructions in a future revision, update this guide at the same time.

## Configuration
- Keep local secrets in `.env`; do not commit it.
- Verify the API's database URL and frontend API base URL agree with the Docker/local networking arrangement.
- From a container, `localhost` refers to that container, not another Compose service; use the service name for container-to-container connections.

## Suggested quality gates
Before opening a pull request, run the scripts available in `package.json` for linting, type-checking, tests, and builds. Add CI jobs for all four as they are introduced.

## Database lifecycle
- `docker compose up -d postgres` starts the local database.
- Inspect status with `docker compose ps` and logs with `docker compose logs postgres`.
- Initialization SQL generally runs only when the data directory is empty. Editing `database/init/001-schema.sql` does not automatically migrate an existing volume.
- For a disposable local database only, `docker compose down -v` removes volumes and all stored data. Review the command carefully before running it.

## Debugging checklist
1. Confirm PostgreSQL health and connection settings.
2. Confirm API environment variables are loaded.
3. Confirm the API starts and the health endpoint responds.
4. Confirm browser requests target the correct API origin and CORS policy.
5. Inspect API logs for validation errors and database connectivity failures.
