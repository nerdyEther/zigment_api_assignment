

# User Notification Preferences API Challenge

Create a serverless API for managing user notification preferences and sending notifications. The system should handle user preferences for different notification types and manage notification delivery settings.

---

## **Technologies**

- **Framework**: NestJS  
- **Database**: MongoDB  
- **Language**: TypeScript  
- **Testing**: Jest  

---

## **Prerequisites**

To run this project, ensure you have the following:

- **Node.js**  
- **npm**  
- **MongoDB**: A running MongoDB instance  

---

## **API Explanation**

The directory structure for the project is as follows:

```plaintext
src/
  ├─ modules/
  │     ├─ notifications/
  │     │     ├─ notifications.controller.ts
  │     │     ├─ notifications.service.ts
  │     │     ├─ notifications.spec.ts
  │     │     ├─ notifications.integration.spec.ts
  │     │     ├─ dto/
  │     │     └─ schemas/
  │     └─ preferences/
  │           ├─ preferences.controller.ts
  │           ├─ preferences.service.ts
  │           ├─ preferences.spec.ts
  │           ├─ preferences.integration.spec.ts
  │           ├─ dto/
  │           └─ schemas/
  │
  ├─ common/
  │     ├─ filters/
  │     │     └─ global-exception.filter.ts
  │     ├─ guards/
  │     │     ├─ api-key.guard.ts
  │     │     └─ throttler.guard.ts
  │     └─ interceptors/
  │           └─ logging.interceptor.ts
  │
  ├─ app.controller.ts
  ├─ app.service.ts
  ├─ app.module.ts
  └─ main.ts
```

### **Modules**

#### **Notifications Module**
- **Controller**: Defines endpoints like `POST /notifications` to send notifications.  
- **Service**: Handles business logic for processing notifications and interacting with the database.  
- **DTO**: Validates incoming data.  
- **Schemas**: Defines database models.  

#### **Preferences Module**
- **Controller**: Handles endpoints like `PUT /preferences` for updating preferences.  
- **Service**: Implements logic for managing preferences.  
- **DTO**: Validates incoming data.  
- **Schemas**: Defines database models.  

### **Common**

#### **Filters**
- **Global Exception Handling**: Implements centralized error handling (`global-exception.filter.ts`).  

#### **Guards**
- **`api-key.guard.ts`**: API key-based authentication.  
- **`throttler.guard.ts`**: Rate limiting for requests.  

#### **Interceptors**
- **Logging**: Logs request and response data (`logging.interceptor.ts`).  

### **Flow of a Request**

1. **Controller**: Receives and validates requests.  
2. **Service**: Processes logic and interacts with the database.  
3. **Database**: Stores or retrieves data (schemas define structure).  
4. **Response**: Returns a success/error response based on the process.  

---

## **Setup Instructions**

### **Step 1: Clone the Repository**
Clone or download the repository to your local machine.

```bash
git clone https://github.com/your-repository/user-notification-preferences-api.git
cd user-notification-preferences-api
```

### **Step 2: Install Dependencies**
Run the following command in your terminal:

```bash
npm install
```

### **Step 3: Configure Environment Variables**
Create a `.env` file in the root directory with these variables:

```plaintext
MONGO_URI=<secret_mongo_uri>
API_KEY=<secret_api_key>
PORT=3000
```

### **Step 4: Run the Application**
Start the application in development mode. The API will run at `http://localhost:3000`.

```bash
npm run start:dev
```

---

## **Deployment Configuration**

The API is deployed using **Vercel's serverless functions**.

### **Vercel Configuration (vercel.json)**

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
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
  ]
}
```

### **Serverless Handler Setup**
The `main.ts` file defines the serverless function handler.

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).send('User Notification Preferences API');
};
```

### **Deployment Steps**
1. Install all dependencies: `npm install`.  
2. Deploy to Vercel using CLI or the web dashboard.  
3. Configure environment variables in Vercel.  

---

## **Tests**

### **Unit Testing**

Run unit tests with the following command:

```bash
npm run test:cov:unit
```

- **Focus**:  
  - Logic validation  
  - Error handling  
  - Validation checks  

### **Integration Testing**

Run integration tests with the following command:

```bash
npm run test:cov:integration
```

- **Focus**:  
  - End-to-end flow validation  
  - Database operations  
  - Guards, filters, and interceptors  

### **Results**
- Achieved **95-100% test coverage** across modules.  
- All test cases passed successfully.  

---

## **API Documentation**

The full API documentation is available [here](https://docs.google.com/document/d/1Hs99-BUMhE-FcqlX4I2enQbNVxWhsyEycOeLC0p_Ycw/edit?usp=sharing).  

---

## **Postman Collection**

Download the Postman collection for testing the API: [Postman Collection](./ZIGMENT_POSTMANC.json).  

---

