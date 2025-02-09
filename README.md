# Arxatec Service - Developer Documentation

## Description

Arxatec Service is the backend service that enables communication between the Arxatec platform and its database. It handles all business logic and manages connections with the PostgreSQL database.

## Technologies Used

- **Node.js** (version 21 or higher)
- **Express** (framework for Node.js)
- **TypeScript** (static typing for JavaScript)
- **Docker** (optional, for containerization)
- **Pkgroll** (bundler)
- **Prisma ORM** (database mapping)
- **Zod** (data validation)
- **Axios** (HTTP client)
- **TSX** (TypeScript execution without prior compilation)
- **PostgreSQL** (relational database)

---

## Requirements

- Install **Node.js** version 21 or higher.
- Install PostgreSQL if running locally.
- Docker (optional, if using containerization).

---

## Installation and Setup for Development

### 1. Clone the repository

```sh
git clone <REPOSITORY_URL>
cd arxatec-service
```

### 2. Create and configure the `.env` file

In the project root, create a `.env` file with the following content:

```env
DATABASE_URL="postgresql://arxatec:arxatec@localhost:5432/arxatecservice" # Database URL
PORT="3000" # Server port
```

### 3. (Optional) Create a `Dockerfile`

If you want to use Docker for the database, create a `Dockerfile` in the project root with the following content:

```dockerfile
FROM postgres:16

ENV POSTGRES_DB=arxatecservice
ENV POSTGRES_USER=arxatec
ENV POSTGRES_PASSWORD=arxatec

EXPOSE 5432
```

### 4. Install dependencies

```sh
npm install
```

### 5. Run database migrations

```sh
npx prisma migrate dev --name init
```

### 6. Start the development server

```sh
npm run dev
```

---

## Deployment to Production

To deploy in production, follow the same installation steps, but instead of `npm run dev`, use:

```sh
npm run build
npm start
```

---

## Contribution Guidelines

For detailed development conventions, including commit messages and branch naming, please refer to the [`CONTRIBUTING.md`](CONTRIBUTING.md) file.
