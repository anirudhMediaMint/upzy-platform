# Upzy Backend API

Backend API server for the Upzy partner platform.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:8000

## API Endpoints

### Authentication
- `POST /v1/auth/login` - User login
- `GET /v1/auth/verify` - Verify JWT token

### Jobs
- `GET /v1/jobs` - Get all jobs with filtering
- `GET /v1/jobs/:id` - Get job by ID
- `POST /v1/jobs` - Create new job (business only)
- `PATCH /v1/jobs/:id` - Update job
- `DELETE /v1/jobs/:id` - Delete job (business only)
- `POST /v1/jobs/:id/accept` - Accept job (partner only)
- `POST /v1/jobs/:id/cancel` - Cancel job
- `POST /v1/jobs/:id/complete` - Complete job (partner only)
- `GET /v1/jobs/my-jobs` - Get partner's jobs
- `GET /v1/jobs/:id/partners` - Search partners for job

## Environment Variables

Create a `.env` file:

```env
PORT=8000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Demo Users

### Partner Account
- Email: `partner@example.com`
- Password: any password (demo mode)

### Business Account
- Email: `business@example.com`  
- Password: any password (demo mode)

## Features

- JWT authentication
- Role-based access control
- Job filtering and pagination
- Mock data for testing
- CORS enabled for frontend
- Request logging with Morgan
- Security headers with Helmet

## Development

The server uses ES modules and runs with nodemon for hot reloading during development.

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
``` 