# GEDPro - HR Document Management System

## Overview
GEDPro is a modern, secure, and intelligent application for managing HR documents, candidates, and recruitment processes.
It uses a **Hybrid Architecture** with **NestJS**, **PostgreSQL** (for Users/Auth), and **MongoDB** (for Unstructured Data like Candidates/Forms).

## Features
- **Authentication**: JWT-based Auth with RBAC (Admin, HR, Manager).
- **Candidate Management**: Track candidates through recruitment stages (MongoDB).
- **Dynamic Forms**: Create custom HR forms with flexible fields.
- **Interviews**: Schedule interviews with Google Calendar integration.
- **Documents**: Upload CVs, extract text via OCR, and analyze skills.
- **Notifications**: Real-time alerts via WebSockets.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (if running locally without Docker)

### Installation (Docker - Recommended)
1.  Clone the repository.
2.  Run the stack:
    ```bash
    docker-compose up --build
    ```
3.  Access the API at `http://localhost:3000`.

### Installation (Local)
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Ensure PostgreSQL and MongoDB are running.
3.  Start the app:
    ```bash
    npm run start:dev
    ```

## Testing
Run unit tests:
```bash
npm test
```

## Architecture
- **Backend framework**: NestJS
- **Relational DB**: PostgreSQL (TypeORM)
- **Document DB**: MongoDB (Mongoose)
- **Containerization**: Docker
