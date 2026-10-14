# WaterWise — Complete Full-Stack Bundle

This archive consolidates the WaterWise project assets created across the conversation:
- **`frontend-nextjs/`** — Next.js + React + TypeScript application.
- **`backend-nestjs/`** — NestJS API, TypeORM entities/DAO, and PostgreSQL/PostGIS schema.
- **`prototype-vite/`** — earlier Vite/React website prototype, preserved as a reference.
- **`docs/`** — architecture, data model, API, development, security, roadmap, and ADR guidance.
- **`OVERVIEW.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CHANGELOG.md`** — project-level documentation.
- **`docker-compose.yml`, `.env.example`** — local database/dev configuration from the starter repository.

## Recommended structure

Use `frontend-nextjs/` and `backend-nestjs/` as the primary application projects. The Vite prototype is retained for reference and is not required to run the primary stack.

## Quick start

Requirements: Node.js 20+, npm, Docker with Docker Compose, and PostgreSQL/PostGIS if running the API against a local database.

1. Extract this archive.
2. Read `docs/DEVELOPMENT.md` and the README files in each app folder.
3. Configure environment variables from `.env.example` and the relevant app README.
4. Start PostgreSQL/PostGIS with Docker Compose, then start the API and web app in separate terminals.

### Frontend
```bash
cd frontend-nextjs
npm install
npm run dev
```

### Backend
```bash
cd backend-nestjs
npm install
npm run dev
```

The intended local URLs are `http://localhost:3000` (web) and `http://localhost:4000` (API); confirm environment configuration in the app README files.

## Current implementation status

This is a development starter and consolidated source bundle, not a production-certified deployment. Some integrations are illustrative or incomplete. In particular, do not assume production authentication/authorization, trained ML inference, live sensor ingestion, or production-grade rainfall data sources are implemented unless explicitly present in source. Review `docs/ROADMAP.md` and `docs/SECURITY.md` before deployment.

## Important
The two main apps are bundled together but remain independently runnable. Shared type definitions are currently copied into each app tree; if you change them, keep the copies in sync until a workspace package is configured.
