

---

# User Notification Preferences API Challenge

Create a serverless API for managing user notification preferences and sending notifications. The system should handle user preferences for different notification types and manage notification delivery settings.

---

## **Technologies**

- Framework: NestJS  
- Database: MongoDB  
- Language: TypeScript  
- Testing: Jest  

---

## **Prerequisites**

- **Node.js**  
- **npm**  
- **MongoDB**: Ensure a running MongoDB instance  

---

## **API Explanation**

```plaintext
src/
  ├─> modules/
  │     ├─> notifications/
  │     │     ├─> notifications.controller.ts
  │     │     ├─> notifications.service.ts
  │     │     ├─> notifications.spec.ts
  │     │     ├─> notifications.integration.spec.ts
  │     │     ├─> dto/
  │     │     └─> schemas/
  │     │
  │     └─> preferences/
  │           ├─> preferences.controller.ts
  │           ├─> preferences.service.ts
  │           ├─> preferences.spec.ts
  │           ├─> preferences.integration.spec.ts
  │           ├─> dto/
  │           └─> schemas/
  │
  ├─> common/
  │     ├─> filters/
  │     │     └─> global-exception.filter.ts
  │     ├─> guards/
  │     │     ├─> api-key.guard.ts
  │     │     └─> throttler.guard.ts
  │     └─> interceptors/
  │           └─> logging.interceptor.ts
  │
  ├─> app.controller.ts
  ├─> app.service.ts
  ├─> app.module.ts
  └─> main.ts
```

---

## **Modules**

### **Notifications Module**

- **Components**:  
  - **Controller**: Defines endpoints like `POST /notifications` to send notifications.  
  - **Service**: Defines logic to process notifications and interact with the database.  
  - **DTO**: Validates incoming data.  
  - **Schemas**: Defines database models.  

### **Preferences Module**

- **Components**:  
  - **Controller**: Handles endpoints like `PUT /preferences` for updating preferences.  
  - **Service**: Defines logic for managing preferences.  
  - **DTO**: Validates incoming data.  
  - **Schemas**: Defines database models.  

---

## **Common**

### **Filters**

- **Global Exception Handling**: `global-exception.filter.ts`

### **Guards**

- **`api-key.guard.ts`**: API key authentication.  
- **`throttler.guard.ts`**: Rate limiting.  

### **Interceptors**

- **Logging**: Logs requests (`logging.interceptor.ts`).  

---

### **`main.ts`**

- Initializes the application, sets up filters, guards, and starts the server.

---

## **Flow of a Request**

1. **Controller**:
   - Receives and validates requests.  
2. **Service**:
   - Handles logic and interacts with the database.  
3. **Database**:
   - Stores or retrieves data (defined via schemas).  
4. **Response**:
   - Returns success/error based on processing.  

---

## **Setup Instructions**

### Step 1: Clone the Repository

Clone/download the repo to your local machine.

```bash
git clone https://github.com/your-repository/user-notification-preferences-api.git
cd user-notification-preferences-api
```

### Step 2: Install Dependencies

Run this in the terminal:

```bash
npm install
```

### Step 3: Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
MONGO_URI=<secret_mongo_uri>
API_KEY=<secret_api_key>
PORT=3000
```

### Step 4: Running the Application

The API will run on `http://localhost:3000`.

```bash
npm run start:dev
```

---

## **Deployment Configuration**

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

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).send('User Notification Preferences API');
};
```

### 3. Deploying to Vercel

You can either use CLI or directly deploy via the webpage. Remember to set up **Environment Variables**.  

---

## **Tests**

### Performed Tests

#### 1. Unit Testing

```bash
npm run test:cov:unit
```

### Test Details and Images

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

---

## **API Documentation**

[API Documentation](https://docs.google.com/document/d/1Hs99-BUMhE-FcqlX4I2enQbNVxWhsyEycOeLC0p_Ycw/edit?usp=sharing)

---

## **Postman Collection**

[Download Postman Collection](./ZIGMENT_POSTMANC.json)

---
