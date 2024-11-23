# User Notification Preferences API

This API enables the management of user notification preferences, sending notifications, and related services. Built with NestJS, it adheres to RESTful principles and includes features like unit testing, integration testing, and reporting.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [Test Coverage](#test-coverage)
- [Deployment](#deployment)
  - [Using Docker](#using-docker)
  - [Deploying to a Cloud Service](#deploying-to-a-cloud-service)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and authentication
- Notification preferences management
- Sending notifications via various channels (e.g., email, SMS)
- Unit and integration testing with Jest
- Coverage and reporting tools (HTML and JUnit)

## Technologies
- Framework: NestJS
- Database: MongoDB
- Language: TypeScript
- Testing: Jest, ts-jest
- Build Tool: TypeScript Compiler

## Prerequisites
- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **MongoDB**: Ensure a running MongoDB instance

### Environment Variables:
Create a `.env` file in the root directory with the following variables:

```bash
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=3000
