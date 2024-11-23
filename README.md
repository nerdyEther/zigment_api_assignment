# User Notification Preferences API

A serverless API for managing user notification preferences and sending notifications. The system handles user preferences for different notification types and manages notification delivery settings.

## 🚀 Technologies

- **Framework:** NestJS
- **Database:** MongoDB
- **Language:** TypeScript
- **Testing:** Jest

## 📋 Prerequisites

- Node.js
- npm
- MongoDB (ensure a running MongoDB instance)

## 🏗️ API Structure

```
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

### Core Modules

#### Notifications Module
- Controller: Handles endpoints like `POST /notifications`
- Service: Processes notifications and database interactions
- DTO & Schemas: Data validation and modeling

#### Preferences Module
- Controller: Manages endpoints like `PUT /preferences`
- Service: Handles preference management logic
- DTO & Schemas: Data validation and modeling

### Common Components
- **Filters:** Global exception handling
- **Guards:** API key authentication and rate limiting
- **Interceptors:** Request/response logging

## 🛠️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repository/user-notification-preferences-api.git
   cd user-notification-preferences-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file:
   ```env
   MONGO_URI=<secret_mongo_uri>
   API_KEY=<secret_api_key>
   PORT=3000
   ```

4. **Start the Application**
   ```bash
   npm run start:dev
   ```
   Access the API at http://localhost:3000

## 🚀 Deployment Configuration

### Vercel Configuration
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

### Serverless Handler
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
export default (req: VercelRequest, res: VercelResponse) => {
  res.status(200).send('User Notification Preferences API');
};
```

## 🧪 Tests

### Unit Testing
```bash
npm run test:cov:unit
```

#### Coverage Areas
- Notifications Service
- Preferences Service
- Validation Logic
- Error Handling
- Edge Cases

### Integration Testing
```bash
npm run test:cov:integration
```

#### Test Scope
- API Endpoints
- Database Operations
- Rate Limiting
- Authentication
- Error Handling
- Edge Cases

#### Results
- Unit Tests: 100% coverage
- Integration Tests: 95% coverage
- All test cases passing successfully

## 📚 API Documentation

For detailed API documentation, visit our [API Documentation](https://docs.google.com/document/d/1Hs99-BUMhE-FcqlX4I2enQbNVxWhsyEycOeLC0p_Ycw/edit?usp=sharing)

## 🔧 Postman Collection

Download our [Postman Collection](./ZIGMENT_POSTMANC.json) for easy API testing and integration.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).
