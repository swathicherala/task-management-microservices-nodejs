# Task Management System – Microservices Architecture

A backend **Task Management System** built using **Node.js Microservices Architecture** to demonstrate **asynchronous communication** between services using **RabbitMQ** and **Docker-based containerization**.

## Overview

This project consists of multiple independent microservices that communicate asynchronously through **RabbitMQ**. The system allows users to create accounts and manage tasks, while a separate notification service handles task-related notifications through email.

The application is fully containerized using **Docker** and orchestrated using **Docker Compose**, including **MongoDB** and **RabbitMQ** containers.

## Architecture

The system is divided into the following microservices:

### 1. User Service
- Handles user creation and management
- Stores user-related data in MongoDB
- Runs on **Port 5000**

### 2. Task Service
- Handles task creation and management
- Linked to specific users
- Publishes task creation events to RabbitMQ
- Stores task-related data in MongoDB
- Runs on **Port 5001**

### 3. Notification Service
- Consumes messages/events from RabbitMQ
- Processes task creation notifications asynchronously
- Currently implemented email notification service using nodemailer package
- Can be extended to support **Email, SMS, Push, or In-App notifications**
- Runs on **Port 5002**

### 4. RabbitMQ
- Used as a message broker for asynchronous communication
- Decouples services and improves fault tolerance

### 5. MongoDB
- Used as the database for User and Task services
- Runs inside Docker containers

## Workflow

1. A user is created using the **User Service**
2. The user creates a task using the **Task Service**
3. After task creation, an event is published to **RabbitMQ**
4. The **Notification Service** consumes the event asynchronously
5. A notification message is processed

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **RabbitMQ**
- **Docker**
- **Docker Compose**

## Key Concepts Implemented

- Microservices Architecture
- Asynchronous Communication
- Event-Driven Architecture
- Message Queue using RabbitMQ
- Docker Containerization
- Docker Compose Orchestration
- Service Isolation
- Fault Tolerance

## Running the Project

Clone the repository:

```bash
git clone https://github.com/swathicherala/task-management-microservices-nodejs.git
