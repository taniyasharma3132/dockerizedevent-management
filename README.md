# Event Management System

## Project Description
This is a full-stack Event Management System developed using React, Node.js, Express, MongoDB, Docker, and Jenkins.

The project allows users to:
- Register and Login
- View Events
- Book Events
- Manage Events through Admin Panel

---

# Technologies Used

## Frontend
- React.js
- Vite
- CSS

## Backend & Microservices
- Node.js
- Express.js
- **Auth Service** - JWT authentication
- **Event Service** - Event management
- **Booking Service** - Booking management

## Database
- MongoDB

## DevOps Tools
- Docker
- Docker Compose
- Jenkins
- GitHub Actions

---

# Project Structure

backend/
frontend/
auth-service/
event-service/
booking-service/
docker-compose.yml
Jenkinsfile
.github/workflows/ci-cd.yml

---

# Features

- User Authentication
- Event Booking System
- Admin Dashboard
- REST API Integration
- Dockerized Application
- CI/CD Pipeline using Jenkins and GitHub Actions

---

# How to Run the Project

## Step 1: Clone Repository

```bash
git clone <repository-link>
```

---

## Step 2: Run Docker Containers

```bash
docker-compose up --build
```

---

# Application Ports

Frontend:
```bash
http://localhost:80
```

Backend (Main API):
```bash
http://localhost:5000
```

Auth Service:
```bash
http://localhost:3001
```

Event Service:
```bash
http://localhost:3002
```

Booking Service:
```bash
http://localhost:3003
```

Database (MongoDB):
```bash
localhost:27017
```

---

# Microservices API Endpoints

## Auth Service (Port 3001)
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token
- `GET /health` - Health check

## Event Service (Port 3002)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /health` - Health check

## Booking Service (Port 3003)
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /health` - Health check

# Environment Variables

Create `.env` file inside backend folder:

```env
MONGO_URI=mongodb://mongodb:27017/eventsdb
JWT_SECRET=supersecret
PORT=5000
```

Create `.env` file inside auth-service folder:

```env
PORT=3001
JWT_SECRET=auth-secret-key
```

Create `.env` file inside event-service folder:

```env
PORT=3002
MONGO_URI=mongodb://mongodb:27017/eventsdb
```

Create `.env` file inside booking-service folder:

```env
PORT=3003
EVENT_SERVICE_URL=http://event-service:3002
MONGO_URI=mongodb://mongodb:27017/eventsdb
```

