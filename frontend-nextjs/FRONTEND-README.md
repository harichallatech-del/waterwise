# WaterWise Frontend — Next.js

Standalone Next.js frontend package extracted from the WaterWise platform.

## Requirements
- Node.js 20+ and npm
- Backend API running at `http://localhost:4000` if using API-backed features

## Run
From this folder:
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Structure
- `apps/web/src/app` — Next.js app, page and global styles
- `packages/shared` — shared TypeScript types from the original monorepo

This archive contains the frontend only. Configure API URLs in the frontend where applicable to match your backend deployment.
