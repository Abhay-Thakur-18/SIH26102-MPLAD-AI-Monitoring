# AEGIS-MPLADS AI (SIH26102)
## AI Enabled Governance Intelligence System
**Theme:** AI Powered Intelligent Anomaly, Fraud & Inefficiency Detection System for MPLADS Projects.

---

## 🏛️ Architecture Overview

AEGIS-MPLADS AI is an enterprise-grade, multi-tiered platform designed to monitor MPLADS fund utilization, detect fraud/anomalies, predict project delays, verify physical milestones using computer vision, and generate explainable forensic audit reports for stakeholders (MPs, District Authorities, Auditors, Contractors, Citizens).

```
                            +--------------------------+
                            |   Nginx Reverse Proxy    |
                            |   (Port 80 / SSL)        |
                            +------------+-------------+
                                         |
               +-------------------------+-------------------------+
               |                                                   |
      (Routes /api/*, /docs)                              (Routes /ai/*)
               v                                                   v
+-------------------------------+                  +-------------------------------+
|    Node.js Express Backend    |                  |      FastAPI AI Service       |
|    (TypeScript, Port 8080)    |                  |      (Python 3.11, Port 8000) |
+---------------+---------------+                  +---------------+---------------+
                |                                                  ^
                |--- REST (x-internal-api-key, HMAC / JWT) --------|
                |
  +-------------+-------------+-------------+
  |                           |             |
  v                           v             v
+------------------+  +-------------+  +---------------+
|  MongoDB Atlas   |  | Redis 7.0   |  | Cloudinary    |
|  (Data Layer)    |  | (Sessions & |  | (Evidence &   |
|                  |  |  BullMQ)    |  |  Media Store) |
+------------------+  +-------------+  +---------------+
```

---

## 📁 Repository Structure

```
AEGIS_MPLADS_AI/
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── ai/               # AI Gateway client service
│   │   ├── config/           # Database, Redis, Permissions, Env schemas
│   │   ├── controllers/      # Express controllers (ApiResponse format)
│   │   ├── docs/             # Swagger OpenAPI 3.0 configuration
│   │   ├── jobs/             # BullMQ producers & worker consumers
│   │   ├── middleware/       # Auth, RBAC, RateLimit, AuditLog, Upload, Error
│   │   ├── models/           # Mongoose Data Models
│   │   ├── repositories/     # Encapsulated query layer
│   │   ├── routes/           # Versioned REST endpoints (/api/v1)
│   │   ├── services/         # Business logic layer
│   │   ├── sockets/          # Socket.IO authenticated server & emitter
│   │   ├── tests/            # Automated Jest + Supertest test suites
│   │   ├── types/            # TypeScript ambient declarations & interfaces
│   │   ├── utils/            # ApiError, ApiResponse, tokens, mailer
│   │   ├── validators/       # Zod request validators
│   │   ├── app.ts            # Express app assembly & middleware pipeline
│   │   └── server.ts         # Server bootstrap, Socket.IO, BullMQ, shutdown
│   ├── Dockerfile            # Multi-stage container build
│   ├── package.json          # Dependencies & scripts
│   ├── tsconfig.json         # TypeScript compiler configuration
│   └── jest.config.ts        # Jest test configuration
│
├── ai-service/               # Python FastAPI AI Microservice
│   ├── main.py               # 7 AI inference endpoints (Risk, Fraud, Vision, etc.)
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Python 3.11 container build
│
├── nginx/
│   └── nginx.conf            # Reverse proxy, SSL termination & WebSocket upgrade
├── docker-compose.yml        # Full-stack container orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 20 LTS)
- Python (>= 3.10)
- MongoDB & Redis (or Docker)

### 1. Running Backend Locally
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:8080`.
- **API Base**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:8080/api-docs`
- **Health Check**: `http://localhost:8080/health`

### 2. Running AI Microservice Locally
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The AI service runs on `http://localhost:8000` (`/health`, `/v1/*`).

### 3. Running with Docker Compose
```bash
docker-compose up --build
```
This boots up:
- `aegis_backend` (Express, BullMQ) on `:8080`
- `aegis_ai_service` (FastAPI) on `:8000`
- `aegis_mongodb` on `:27017`
- `aegis_redis` on `:6379`
- `aegis_nginx` on `:80`

---

## 🧪 Automated Testing

All 7 integration test suites pass with 100% success rate:
```bash
cd backend
npm test
```

Test Suites:
- `src/tests/user.test.ts` (Profile update, RBAC user listing, soft deletion)
- `src/tests/auth.test.ts` (Citizen registration, invalid credential handling, profile retrieval)
- `src/tests/aiGateway.test.ts` (AI forward proxying, historical prediction tracking)
- `src/tests/payment.test.ts` (PFMS transaction ingestion, budget utilization)
- `src/tests/audit.test.ts` (Auditor assignments, forensic report state machines)
- `src/tests/notification.test.ts` (User notifications, read status transitions)
- `src/tests/project.test.ts` (Project creation, RBAC authorization, pagination)

---

## 🔒 Security & RBAC Matrix

| Role | Permissions |
| :--- | :--- |
| **SUPER_ADMIN** | Full system permissions, user administration, configuration |
| **ADMIN** | User management, audits review, contractor directory |
| **MP** | Own constituency project monitoring, fund utilization review |
| **DISTRICT_AUTHORITY** | Project creation, milestone updates, payments, contractor assignment |
| **AUDITOR** | Forensic audit report generation, evidence collection, investigation |
| **CONTRACTOR** | Milestone progress updates, site evidence upload |
| **CITIZEN** | Public project explorer, grievance filing, geo-tagged photo upload |

---

## 🤖 AI Gateway Service Endpoints

The internal AI Gateway abstracts model complexity through standard contracts:
- `POST /api/v1/ai/risk-prediction`: Multi-factor delay & overrun forecasting
- `POST /api/v1/ai/anomaly-detection`: Statistical isolation forest for fraudulent spending
- `POST /api/v1/ai/duplicate-project`: Semantic NLP + Haversine distance deduplication
- `POST /api/v1/ai/image-verification`: Computer vision construction progress detection
- `POST /api/v1/ai/audit-report`: Explainable audit synthesis with forensic recommendations
- `POST /api/v1/ai/semantic-similarity`: Text embeddings comparison
- `POST /api/v1/ai/budget-leakage`: Milestone disbursement vs progress burn-rate analysis
