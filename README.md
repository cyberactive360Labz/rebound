# rebound

A modern browser arcade game project.

## Current status

The repository now includes a runnable frontend scaffold at:

- `/home/runner/work/rebound/rebound/apps/client`

## Frontend setup (Vite + TypeScript)

```bash
cd /home/runner/work/rebound/rebound/apps/client
npm install
```

## Run locally

```bash
cd /home/runner/work/rebound/rebound/apps/client
npm run dev
```

## Build

```bash
cd /home/runner/work/rebound/rebound/apps/client
npm run build
```

## Test

```bash
cd /home/runner/work/rebound/rebound/apps/client
npm test
```

## Deploy (GitHub Pages)

This repository includes `/home/runner/work/rebound/rebound/.github/workflows/deploy-pages.yml` to deploy the frontend automatically.

1. Push to the `main` branch.
2. In GitHub, enable **Pages** and set source to **GitHub Actions**.
3. The workflow runs tests, builds `/home/runner/work/rebound/rebound/apps/client`, and deploys `dist` to Pages.