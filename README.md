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

## Setup Instructions

### Step 1: Clone the Repository

Clone/download the repo to your local machine.

```bash
git clone https://github.com/your-repository/user-notification-preferences-api.git
cd user-notification-preferences-api
```

### Step 2: Install Dependencies

Run this in terminal:

```bash
npm install
```

### Step 3: Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
MONGO_URI=<secret_mongo_uri>
API_KEY=<secret_api_key>
PORT=3000
```

### Step 4: Running the Application

The API will run on http://localhost:3000.

```bash
npm run start:dev
```

## Deployment Configuration

The API is deployed using Vercel's serverless functions.
Remember to install all the dependencies first (npm install).

### 1. Vercel Configuration (vercel.json)

```json
{
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

### 2. Serverless Handler Setup (main.ts)

This file contains the Vercel serverless function handler.
You can look at complete code of main.ts from the repo.

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).send('User Notification Preferences API');
};
```

### 3. Deploying to Vercel

You can either use CLI or can directly deploy via webpage, remember to setup ENVIRONMENT VARIABLES.
After the deployment is successful, you can access API via URL.

## Tests

Test files (`.spec` files) are placed within respective module folders, making it easier to maintain, navigate, and test.

### Performed Tests

#### 1. Unit Testing

To run unit tests, use the following command:

```bash
npm run test:cov:unit
```

### Details

#### Files Tested

* `notifications.service.ts` (test file: `notifications.service.unit.spec.ts`)
* `preferences.service.ts` (test file: `preferences.service.unit.spec.ts`)

  
<table>
  <tr>
    <td>
      <img width="600" alt="Screenshot 2024-11-23 at 10 22 10 AM" src="https://github.com/user-attachments/assets/07744986-f183-4c14-9d40-0d21f326d06d">
    </td>
    <td>
      <img width="600" alt="Screenshot 2024-11-23 at 10 22 49 AM" src="https://github.com/user-attachments/assets/55a1b7dd-62ac-4957-bc76-4af63907eef4">
    </td>
  </tr>
  <tr>
    <td>
      <img width="600" alt="Screenshot 2024-11-23 at 10 24 19 AM" src="https://github.com/user-attachments/assets/5a46d18d-2ca8-44b2-9218-da9c018f398e">
    </td>
    <td>
      <img width="600" alt="Screenshot 2024-11-23 at 10 31 56 AM" src="https://github.com/user-attachments/assets/4fea77e8-1361-47bc-b9cb-41ddfbbeb0bb">
    </td>
  </tr>
</table>


#### Key Focus

* Logic validation
* Error handling
* Validation checks

#### Results

* Achieved **100% coverage** in both files
* All test cases passed successfully

### CRUD Operations Testing

* **Creation:** User preferences and notifications
* **Reading:** User preferences and notification logs
* **Updates:** User preferences
* **Deletion:** Preferences
* **Notification Delivery:** Based on user preferences
* **Channel-Specific Notification Handling**
* **Stats Retrieval:** Fetching statistics and logs

### Validation Testing

#### User Preferences Validation

* Empty/invalid `userId` validation
* Email format validation
* Preference structure validation
* Notification channel validation
* Frequency validation

#### Notification Validation

* Channel validation (email, SMS, push)
* Content structure validation
* Notification type validation
* User-specific preference validation

### Error Handling Testing

Used `NotFoundException`, `BadRequestException`, and `ConflictException` for the following:

* Missing user preferences
* Invalid notification content
* Unsupported notification types

### Edge Cases

* Handling multiple simultaneous conditions
* Complex preferences
* Complex log and stats retrieval

### 2. Integration Testing

To run unit tests, use the following command:
```bash
npm run test:cov:integration
```

### Details

This test validates complete integration of following components:
* Controllers: PreferencesController
* Services: PreferencesService
* DTOs: for preference validation
* Schemas: for preference data modeling
* Guards: API key authentication
* Filters: Exception handling
* Interceptors: Request/Response transformation

### Key Focus:
* API endpoint testing
* Database operations testing
* Rate limiting testing

### Results
* Achieved 95% coverage in both files
* All test cases passed successfully for preferences.controllers.ts

### Test Overview:

#### API Endpoint Testing
##### CRUD operations:
* POST /api/preferences
    * Successfully creates new user preferences
    * Validates API key authentication
    * Handles invalid information
* GET /api/preferences/:userId
    * Reads existing user preferences
    * Handles non-existent users (404 responses)
* DELETE /api/preferences/:userId
    * Successfully deletes user preferences
    * Handles non-existent users (404 responses)

#### Database Operations Testing
##### Create Operations
* Verifies data is correctly stored in the database
* Verifies stored data matches input
* Verifies database queries work as expected
* Verifies records are properly removed from the database

#### Rate Limiting Testing
* Verifies the implementation of rate limits after multiple requests
* Verifies 429 (Too Many Requests) response when limits are exceeded

#### Edge Cases
* Tests missing required fields
* Handles invalid input
* Implements proper test cleanup after each case
* Handles async operations with delays to prevent race conditions



