# HR DMS - GEDPro

A comprehensive HR Document Management System built with NestJS (Backend) and Next.js (Frontend). This application streamlines the recruitment process, from job posting to candidate management and interview scheduling.

## Features

-   **Dashboard Overview**: Real-time statistics on applications and documents.
-   **Job Management**: Create and manage job vacancies with customizable forms.
-   **Candidate Tracking**: Kanban-style board to track candidates through recruitment stages (New, Pre-Selected, Interviewing, Accepted, etc.).
-   **Document Management**: Secure upload and OCR processing for CVs and other documents.
-   **Authentication**: Role-based access control (Admin, HR, Manager).



## Tech Stack

-   **Backend**: NestJS, TypeORM (PostgreSQL), Mongoose (MongoDB)
-   **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
-   **DevOps**: Docker, Docker Compose

## Getting Started

1.  **Clone the repository**
2.  **Start Services**: `docker compose up -d`
3.  **Run Backend**:
    ```bash
    cd backend
    npm install
    npm run start:dev
    ```
4.  **Run Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
5.  **Access App**: `http://localhost:3000`

## License
Proprietary - GEDPro
