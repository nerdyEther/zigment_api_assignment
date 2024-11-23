# User Notification Preferences API Challenge

Create a serverless API for managing user notification preferences and sending notifications. The system should handle user preferences for different notification types and manage notification delivery settings.


## Technologies
- Framework: NestJS
- Database: MongoDB
- Language: TypeScript
- Testing: Jest


## Prerequisites
- **Node.js**
- **npm**
- **MongoDB**: Ensure a running MongoDB instance


# LOGIC



# Setup Instructions

## Step 1: Clone the Repository
clone/download my repo to your local machine.

```bash
git clone https://github.com/your-repository/user-notification-preferences-api.git
cd user-notification-preferences-api
```

## Step 2: Install Dependencies

run this in terminal:

```bash
npm install
```

## Step 3: Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
MONGO_URI=<secret_mongo_uri>
API_KEY=<secret_api_key>
PORT=3000
```


## Step 4: Running the Application

The API will run on http://localhost:3000.

```bash
npm run start:dev
```



# Deployment Configuration

I deployed the API using vercels' serverless functions.
Remeber to install all the dependencies first (npm install).

    
## 1. Vercel Configuration (vercel.json)

```bash

  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts",
      "methods": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH"
      ]
    }
  ]
}
```

## Step 2: 2. Serverless Handler Setup (main.ts)

This file contains the Vercel serverless function handler.
You can look at complete code of main.ts from my repo.

```bash
import { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).send('User Notification Preferences API');
};
```

## Step 3: Deploying to Vercel

You can either use CLI or can direcly depoly via webpage, remember to setup ENVIROMENT VARIABLES.
After the deployment is successful, you can access API via url.


#Tests
# Tests

Test files (`.spec` files) are placed within respective module folders, making it easier to maintain, navigate, and test.

## Performed Tests

### 1. Unit Testing
To run unit tests, use the following command:

```bash
npm run test:cov:unit
```





