# WaterWise Backend — NestJS

Standalone NestJS API package with PostgreSQL/PostGIS schema.

## Requirements
- Node.js 20+ and npm
- PostgreSQL with PostGIS enabled

## Configure
Set database environment variables expected by `apps/api/src/app.module.ts` / your deployment. The schema initialization script is `database/init/001-schema.sql`. Run it against a PostGIS-enabled database before starting the API.

## Run
From this folder:
```bash
npm install
npm run dev
```
API health endpoint: `http://localhost:4000/api/v1/health` (assuming the configured port/base path).

## Structure
- `apps/api/src` — NestJS modules, controllers, services, entities and DAO abstraction
- `database/init` — PostgreSQL/PostGIS schema
- `packages/shared` — shared TypeScript types

This archive contains the backend and database schema only. Review environment configuration and security settings before deployment.
