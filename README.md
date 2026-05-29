# Event Management System

## Project Description
This is a full-stack Event Management System developed using React, Node.js, Express, MongoDB, Docker, Jenkins, and Ansible.

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

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## DevOps Tools
- Docker
- Docker Compose
- Jenkins
- Ansible

---

# Project Structure

backend/
frontend/
docker-compose.yml
Jenkinsfile
deploy.yml
inventory.ini

---

# Features

- User Authentication
- Event Booking System
- Admin Dashboard
- REST API Integration
- Dockerized Application
- CI/CD Pipeline using Jenkins
- Automated Deployment using Ansible

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
http://localhost:3000
```

Backend:
```bash
http://localhost:5000
```

---

# Environment Variables

Create `.env` file inside backend folder:

```env
MONGO_URI=mongodb://mongodb:27017/eventsdb
JWT_SECRET=supersecret
PORT=5000
```

