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
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=3000
```


## Step 4: Running the Application

The API will run on http://localhost:3000.

```bash
npm run start:dev
```

