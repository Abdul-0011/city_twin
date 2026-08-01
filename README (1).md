# Urban Simulator — Abstracted City Digital Twin

A simulated city digital twin: entities (roads, intersections, sensors, buildings, transit stops) with live time-series state, what-if simulation runs, and threshold/anomaly alerts — pushed to clients in real time over WebSocket.

## Stack

- **Backend**: Java 21, Spring Boot 4.1.0, Spring Data JPA, PostgreSQL (TimescaleDB), WebSocket (STOMP)
- **Frontend**: Next.js / React
- **ML Service**: Python (planned)
- **Infra**: Docker Compose (Postgres + Redis)

## Prerequisites

Each team member needs installed locally:
- Java 21 (Eclipse Temurin recommended)
- Maven
- Node 22 LTS + pnpm
- Docker Desktop (with WSL2 backend on Windows)
- Git

See `docs/setup.md` for a full step-by-step install guide if you're starting from scratch.

## Running the backend locally

1. **Start the database** (Postgres + Redis via Docker):
   ```bash
   cd infra
   docker compose up -d
   docker ps   # confirm citytwin-postgres and citytwin-redis are "Up"
   ```

2. **Run the Spring Boot app**:
   - In IntelliJ: open `backend/`, let Maven sync, then run `CapStoneApplication.java` (green ▶ on `main`).
   - Or from terminal:
     ```bash
     cd backend
     mvn spring-boot:run
     ```
   - Wait for `Tomcat started on port 8080` in the console.

3. **Confirm it's live**:
   ```
   http://localhost:8080/api/entities
   ```
   should return `[]` (or existing data) with a `200` status.

## API Documentation

Full interactive API docs (all endpoints, request/response schemas, "try it out"):
```
http://localhost:8080/swagger-ui/index.html
```
Start here before integrating against the backend — it reflects the real, current API rather than this file.

## Core Endpoints

| Resource | Base path | Notes |
|---|---|---|
| City Entities | `/api/entities` | Roads, intersections, sensors, buildings, transit stops. `GET`, `GET /{id}`, `POST`. |
| Entity States | `/api/states` | Time-series metric readings per entity (congestion, avg speed, energy, etc). `GET`, `POST`, `GET /entity/{entityId}`. Posting triggers a live WebSocket broadcast. |
| Simulation Runs | `/api/simulations` | What-if scenario runs (road closures, demand spikes) and their results. `GET`, `GET /{id}`, `POST`. |
| Alerts | `/api/alerts` | Threshold breaches / anomaly detections tied to an entity. `GET`, `GET /{id}`, `POST`. |

All POST bodies and response shapes are documented in Swagger — check there for exact JSON structure per entity type (e.g. `EntityType`, `MetricType`, `ScenarioType`, `AlertSeverity` enum values).

## Live Updates (WebSocket)

Connect via SockJS/STOMP to:
```
ws://localhost:8080/ws
```
Subscribe to:
```
/topic/entity-states
```
to receive every new `EntityState` the moment it's posted — no polling required. Useful for the frontend map and any live dashboard.

## Error Responses

Failed requests return clean JSON instead of stack traces:
- `404` — `{"error": "Resource not found"}`
- `500` — `{"error": "An unexpected error occurred"}`

## Project Structure

```
city-twin/
├── frontend/       # Next.js app
├── backend/        # Spring Boot API (this service)
├── ml-service/      # Python ML service (planned)
├── infra/
│   └── docker-compose.yml
└── docs/
    └── setup.md     # full local dev environment setup guide
```

## Team Roles

| Role | Owner | Area |
|---|---|---|
| Backend Architect | Abdul | Java, REST APIs, this service |
| Simulation Engineer | — | Python, ML forecasting/simulation |
| Data & Cloud Ops | — | PostgreSQL, Docker, cloud deployment |
| UI/UX Developer | — | React/Vue, Chart.js |
| Visualization Engineer | — | WebGL, map/visual rendering |

## Status

- [x] Core domain model: CityEntity, EntityState, SimulationRun, Alert
- [x] REST CRUD for all four entities
- [x] Live WebSocket broadcasting on new entity states
- [x] Global error handling (clean 404/500 responses)
- [x] DTOs for nested-entity responses (EntityState, Alert)
- [x] Swagger/OpenAPI docs
- [ ] Input validation
- [ ] Simulation engine logic (currently stores runs, doesn't compute them)
- [ ] Alert auto-generation (currently manual POST only, no threshold-detection logic yet)
