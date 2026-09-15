# Manufacturer–Distributor API

A microservices-based system for a pharmaceutical distributor to track **what medicines exist**, **what was shipped to them**, and **what they currently hold in stock**. Built as three independently deployable Node.js APIs backed by a single Azure SQL database, with a React frontend and full Docker/Azure deployment support.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Frontend](#frontend)
- [Docker](#docker)
- [Azure Deployment](#azure-deployment)
- [Monitoring](#monitoring)
- [Security Notes](#security-notes)

---

## Architecture

The system is split into three services, each representing a different **rate of change** in the business process rather than an arbitrary technical boundary:

| Service | Owns | Change frequency |
|---|---|---|
| **Product API** | Manufacturers, medicine/product records | Rarely changes |
| **Shipment API** | Shipment events (medicine, manufacturer, distributor, quantity, date) | Changes constantly — an event log |
| **Inventory API** | Current stock levels | Derived — not its own fact |

A key architectural decision: **inventory is never stored or directly edited.** There is no `PUT /inventory` endpoint. Instead, `GET /inventory` computes current stock live as `SUM(Quantity)` from `ShipmentEvents`, grouped by medicine. This guarantees inventory can never drift out of sync with shipment history, because there is nothing separate to keep in sync — shipment events are the single source of truth.

```
                        Distributor (Client)
                                |
                                v
                    Azure API Management (APIM)
              [ Auth · Rate Limiting · Routing · Versioning ]
                                |
              +-----------------+------------------+
              |                 |                  |
              v                 v                  v
        Product API       Shipment API       Inventory API
      (Container, App    (Container, App    (Container, App
       Service)           Service)           Service — read-only,
              |                 |             aggregates the other
              |                 |             two tables)
              +--------+--------+------------------+
                       |
                       v
              Azure SQL Database (capstonedb)
        Manufacturers · ProductMaster · ShipmentEvents
                       |
                       v
     App Insights (per API) + APIM Diagnostics
                       |
                       v
         Log Analytics Workspace → Azure Monitor
                (dashboards + alerts)
```

**Database strategy:** one shared Azure SQL database (`capstonedb`) with tables owned by convention rather than physically isolated per service. For a solo-developer project this avoids the real cost of database-per-service (network hops, duplicated infrastructure) without losing any practical benefit, since there are no separate teams needing independent schema deployment.

---

## Tech Stack

- **Backend:** Node.js, Express, `mssql` driver
- **Database:** Azure SQL Database (single shared instance)
- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, `lucide-react` icons
- **Containerization:** Docker (`node:20-alpine`)
- **Hosting:** Azure App Service (Web App for Containers)
- **Registry:** Azure Container Registry (ACR)
- **Gateway:** Azure API Management (APIM)
- **Monitoring:** Application Insights, APIM Diagnostics, Log Analytics, Azure Monitor

---

## Project Structure

```
manufacturer-distributer-api/
├── database/
│   └── schema.sql
├── product-api/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── products.js
│   │   │   └── manufacturers.js
│   │   ├── app.js
│   │   ├── db.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── shipment-api/
│   ├── src/
│   │   ├── routes/shipments.js
│   │   ├── app.js
│   │   ├── db.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── inventory-api/
│   ├── src/
│   │   ├── routes/inventory.js
│   │   ├── app.js
│   │   ├── db.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # FeatureCard, Modal, PageHeader, LoadingSpinner, banners
│   │   ├── pages/         # Home, RegisterProduct, CreateShipment, CheckInventory
│   │   └── services/      # productService, manufacturerService, shipmentService, inventoryService
│   ├── .env / .env.production
│   └── package.json
└── .gitignore
```

---

## Database Schema

```
Manufacturers  (1) ──────< (Many)  ProductMaster
     |                                    |
     └──────< (Many) ──────────────────  ShipmentEvents
```

- **`Manufacturers`** — `ManufacturerId` (PK), `ManufacturerName`
- **`ProductMaster`** — `MedicineCode` (PK), `MedicineName`, `ManufacturerId` (FK), `Status` (`ACTIVE`/`INACTIVE`)
- **`ShipmentEvents`** — `ShipmentId` (PK), `MedicineCode` (FK), `ManufacturerId` (FK), `DistributorId`, `Quantity` (`CHECK > 0`), `Status` (`DISPATCHED`/`CANCELLED`), `ShipmentDate`
- Indexes on `ShipmentEvents.MedicineCode` and `ShipmentEvents.ManufacturerId` for fast aggregation and filtering as the event log grows

There is intentionally **no `Inventory` table** — stock is always a live query over `ShipmentEvents`.

Run the schema:
```bash
sqlcmd -S sqlsrv-yourname.database.windows.net -d capstonedb -U sqladmin -P '<your-password>' -i database/schema.sql
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- An Azure SQL Database (or compatible SQL Server instance)
- Docker (for containerized runs)
- Azure CLI (for deployment)

### 1. Clone and configure environment variables

Each API needs its own `.env` (copy from `.env.example` and fill in real values — `.env` is git-ignored):

```
DB_SERVER=sqlsrv-yourname.database.windows.net
DB_NAME=capstone-db
DB_USER=sqladmin
DB_PASSWORD=your-real-password
PORT=3001   # 3002 for shipment-api, 3003 for inventory-api
```

### 2. Install and run each API

```bash
cd product-api && npm install && npm run dev     # http://localhost:3001
cd shipment-api && npm install && npm run dev     # http://localhost:3002
cd inventory-api && npm install && npm run dev    # http://localhost:3003
```

### 3. Health check

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

`frontend/.env` points at the three local API ports:
```
VITE_PRODUCT_API_URL=http://localhost:3001
VITE_SHIPMENT_API_URL=http://localhost:3002
VITE_INVENTORY_API_URL=http://localhost:3003
```

---

## API Reference

### Product API (`:3001`)

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/products` | List all products |
| GET | `/products/:code` | Get one product (404 if not found) |
| POST | `/products` | Create a product (`medicineCode`, `medicineName`, `manufacturerId`) |
| GET | `/manufacturers` | List all manufacturers |
| POST | `/manufacturers` | Register a new manufacturer (`manufacturerId`, `manufacturerName`) |

### Shipment API (`:3002`)

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/shipments` | List all shipments, newest first |
| GET | `/shipments/:id` | Get one shipment (404 if not found) |
| POST | `/shipments` | Record a shipment (`shipmentId`, `medicineCode`, `manufacturerId`, `distributorId`, `quantity`) |

Shipments are event-log style — no update/delete. Validation rejects non-positive quantities before hitting the database.

### Inventory API (`:3003`) — read-only

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/inventory` | Current computed stock for all products |
| GET | `/inventory/:medicineCode` | Current computed stock for one product (404 only if the product itself doesn't exist; a real product with no shipments returns `CurrentStock: 0`) |

---

## Frontend

A React SPA with three main flows, matching the three APIs:

1. **Register a Product** — manufacturer dropdown (with an inline "+ Register New Manufacturer" modal that creates a manufacturer and auto-selects it), product form, and a "View All Products" table.
2. **Create a Shipment** — product dropdown with the manufacturer auto-derived and shown read-only (prevents mismatched product/manufacturer pairs), shipment form, "+ Register New Product" redirect if no products exist yet, and a "View All Shipments" table.
3. **Check Inventory** — toggle between a complete inventory table and a single-product lookup by ID, with a clear distinction between "zero stock" and "product not found."

Shared components (`LoadingSpinner`, `ErrorBanner`, `SuccessBanner`, `PageHeader`, `Modal`, `FeatureCard`) are reused across all three pages.

CORS is enabled on all three APIs, scoped to the Vite dev origin (`http://localhost:5173`) rather than left open.

---

## Docker

Each API has its own `Dockerfile` (based on `node:20-alpine`) and `.dockerignore` (excluding `.env` and `node_modules`).

```bash
cd product-api
docker build -t product-api .
docker run -p 3001:3001 --env-file .env product-api
```

Repeat for `shipment-api` (port 3002) and `inventory-api` (port 3003). Environment variables are always passed at **runtime** via `--env-file`, never baked into the image.

---

## Azure Deployment

1. **Azure Container Registry (ACR)** — build, tag, and push each image:
   ```bash
   az acr login --name acrcapstoneyourname
   docker tag product-api acrcapstoneyourname.azurecr.io/product-api:v1
   docker push acrcapstoneyourname.azurecr.io/product-api:v1
   ```
2. **App Service (Web App for Containers)** — one shared App Service Plan (Linux, B1) hosts all three containers as separate Web Apps.
3. **Application settings** — DB credentials and `WEBSITES_PORT` are set as App Service Application Settings, not baked into the image.
4. **API Management (APIM)** sits in front of all three App Services, handling auth, rate limiting, routing, and versioning for the production client path. The App Services remain directly reachable for local debugging.

---

## Monitoring

Three layers, used together rather than as competing choices:

- **Collectors:** Application Insights (per API — requests, exceptions, SQL dependency calls) and APIM Diagnostics (per gateway request — API, operation, status, latency)
- **Warehouse:** Log Analytics Workspace — both collectors write here
- **Dashboard/alerting:** Azure Monitor, built on top of Log Analytics

---

## Security Notes

- `.env` files are git-ignored at both the root and per-API level; only `.env.example` is committed.
- All SQL queries use parameterized inputs (`mssql`'s `.input()`) to prevent SQL injection.
- Database-level constraints (`CHECK (Quantity > 0)`, foreign keys) back up application-level validation.
- Secrets are injected via environment variables / App Service Application Settings, never baked into container images.
- Planned upgrade path: Managed Identity for App Service → SQL (passwordless), and Azure Key Vault for secrets, once username/password auth is confirmed working end-to-end.
