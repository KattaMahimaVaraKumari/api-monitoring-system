# Monitorly | API Monitoring & Incident Management

A full-stack API monitoring platform for tracking endpoint availability, detecting failures, and managing incidents through a centralized dashboard.

[**Live Demo**](https://api-monitoring-system-omega.vercel.app) · [**Source Code**](https://github.com/KattaMahimaVaraKumari/api-monitoring-system)

## Demo Credentials

Explore the deployed application using the demo account.

| | Credentials |
|---|---|
| Email | `mahi@example.com` |
| Password | `mypassword123` |

> Demo access requires the account to exist in the production database. Use this account only for demonstration purposes.

## Overview

Monitorly automates endpoint health checks and provides a centralized view of monitor status, failures, and incident-related information. Users can configure monitoring parameters and track the health of their APIs without manually checking each endpoint.

## Core Capabilities

- **Endpoint Monitoring** — Configure target URLs, expected status codes, timeouts, and monitoring intervals.
- **Automated Health Checks** — Run scheduled checks and identify endpoint failures.
- **Incident Management** — Track failures detected during monitoring.
- **Authentication & Access Control** — Secure authentication using JWT and HTTP-only cookies.
- **Monitoring Dashboard** — View monitor status and available analytics.
- **Backend Validation & Testing** — Validate requests and test critical authentication and authorization workflows.

## Tech Stack

**Frontend:** React · Vite · JavaScript

**Backend:** Node.js · Express.js · REST APIs

**Database:** MongoDB · Mongoose

**Security:** JWT · HTTP-only cookies · Zod

**Scheduling:** node-cron

**Deployment:** Vercel · Render · MongoDB Atlas

## Architecture

```text
       React + Vite
            |
         REST APIs
            |
     Express Backend
            |
     +------+------+
     |      |      |
   Auth   Monitor  Incidents
     |      |      |
     +------+------+
            |
          MongoDB

    Scheduled Health Checks
            |
      Endpoint Status Updates
```

## Local Development

**Prerequisites:** Node.js, npm, Git, and MongoDB.

### 1. Clone the repository

```bash
git clone https://github.com/KattaMahimaVaraKumari/api-monitoring-system.git
cd api-monitoring-system
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` before starting the server and configure the required values, including `MONGODB_URI`, `JWT_SECRET`, and `PORT`.

### 3. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend API URL to point to the backend. Open the local URL printed by Vite.

## Testing

Backend tests cover critical application workflows. Run the test command configured in `backend/package.json`:

```bash
cd backend
npm test
```

Ensure the required database and test environment are available before running tests.

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

## Author

**Katta Mahima vara kumari** · [GitHub](https://github.com/KattaMahimaVaraKumari)

