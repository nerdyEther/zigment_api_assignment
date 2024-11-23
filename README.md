User Notification Preferences API
This API enables the management of user notification preferences, sending notifications, and related services. Built with NestJS, it adheres to RESTful principles and includes features like unit testing, integration testing, and reporting.

Table of Contents
Features
Technologies
Prerequisites
Setup Instructions
Running the Application
Testing
Deployment
Directory Structure
Contributing
License
Features
User registration and authentication
Notification preferences management
Sending notifications via various channels (e.g., email, SMS)
Unit and integration testing with Jest
Coverage and reporting tools (HTML and JUnit)
Technologies
Framework: NestJS
Database: MongoDB
Language: TypeScript
Testing: Jest, ts-jest
Build Tool: TypeScript Compiler
Prerequisites
Node.js: v16 or higher
npm: v8 or higher
MongoDB: Ensure a running MongoDB instance
Environment Variables:
Create a .env file in the root directory with the following variables:
makefile
Copy code
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=3000
Setup Instructions
Clone the repository:

bash
Copy code
git clone https://github.com/your-repository/user-notification-preferences-api.git
cd user-notification-preferences-api
Install dependencies:

bash
Copy code
npm install
Configure environment variables:

Create a .env file as described in the Prerequisites section.
Build the application:

bash
Copy code
npm run build
Running the Application
Development Mode
Start the application in watch mode:

bash
Copy code
npm run start:dev
Access the API at http://localhost:3000.

Production Mode
Build the application:
bash
Copy code
npm run build
Start the application:
bash
Copy code
npm run start:prod
Testing
Unit Tests
Run unit tests for modules and services:

bash
Copy code
npm run test:unit
Integration Tests
Run integration tests for end-to-end workflows:

bash
Copy code
npm run test:integration
Test Coverage
Generate a test coverage report:

bash
Copy code
npm run test:cov
Coverage reports are saved in the coverage/ directory.

Deployment
Using Docker
Build the Docker image:

bash
Copy code
docker build -t user-notification-api .
Run the Docker container:

bash
Copy code
docker run -p 3000:3000 --env-file .env user-notification-api
Deploying to a Cloud Service
Render:

Add the .env variables in the Render environment settings.
Deploy the project repository to Render.
Vercel:

Use vercel CLI or connect your GitHub repository.
Ensure the correct environment variables are set in the Vercel dashboard.
AWS EC2:

SSH into the EC2 instance.
Install Node.js and MongoDB.
Clone the repository and follow the Setup Instructions.
Directory Structure
plaintext
Copy code
.
├── src
│   ├── modules
│   │   ├── notifications
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.spec.ts      # Unit tests
│   │   │   ├── notifications.integration.spec.ts  # Integration tests
│   │   │   └── ...
│   │   ├── preferences
│   │   │   ├── preferences.controller.ts
│   │   │   ├── preferences.service.ts
│   │   │   ├── preferences.spec.ts        # Unit tests
│   │   │   ├── preferences.integration.spec.ts  # Integration tests
│   │   │   └── ...
│   │   └── ...
│   ├── main.ts
│   ├── app.module.ts
│   └── ...
├── test
│   ├── jest-e2e.json
│   └── ...
├── jest.unit.config.js
├── jest.integration.config.js
├── package.json
├── tsconfig.json
├── Dockerfile
├── .env
└── ...
