# AI Interview Simulator

The repository is split into `frontend/` (Next.js + Clerk), `backend/` (Spring Boot + PostgreSQL), and `ai-service/` (FastAPI). Compose and shared environment configuration remain at the repository root.

## Clerk Setup

The Next.js Clerk application and development instance have been initialized. The Clerk CLI stores credentials in `frontend/.env.local`; keep that file private and do not copy its secret key into the root `.env`. Spring derives its issuer and JWKS URL from the public publishable key. Optional `CLERK_ISSUER` and `CLERK_JWKS_URI` overrides are available in `.env`.

Compose loads the Clerk environment file for the frontend and passes only the public publishable key to Spring and the frontend build. The Clerk secret remains in the frontend container only.

## Run Locally

Prerequisite: Docker Compose.

```bash
docker compose --env-file frontend/.env.local up --build
```

Compose uses development database defaults unless you also copy `.env.example` to `.env`. If using `.env`, pass both files in order: `docker compose --env-file .env --env-file frontend/.env.local up --build`.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Spring API: [http://localhost:8080/api](http://localhost:8080/api)
- Spring Swagger: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- FastAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Spring health: [http://localhost:8080/api/health](http://localhost:8080/api/health)

Sign-in and sign-up are handled by Clerk. The frontend sends Clerk session JWTs as bearer tokens; Spring validates their signature using the configured JWKS URI and uses the verified `sub` claim for PostgreSQL user/interview ownership.

`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are embedded into the frontend image at build time. Rebuild the frontend after changing either value.

## Integration Status

Profiles, interviews, answers, history, reports, dashboard, analytics, and topics use Spring Boot. Interview questions currently come from a development question bank. Answers persist, but AI evaluation remains pending until the FastAPI evaluation endpoint is implemented. Code submissions are stored; arbitrary code execution is disabled until a sandbox is connected.
