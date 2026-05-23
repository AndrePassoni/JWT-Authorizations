# Authentication and Authorization System

A robust Express.js application implementing JWT-based authentication with role-based access control (RBAC). This project was developed while studying the **Authentication and Authorization** module of the **Rocketseat Fullstack Course**.

## 🎯 Project Overview

This application demonstrates core concepts of modern web authentication and authorization patterns:

- **JWT Authentication**: Secure token-based user sessions
- **Role-Based Access Control**: Different permission levels for different user roles
- **Middleware Pattern**: Reusable authentication and authorization middleware
- **Error Handling**: Centralized error management with custom error classes
- **TypeScript**: Full type safety throughout the application

## 🚀 Features

- ✅ User authentication with JWT token generation
- ✅ Role-based authorization (admin, sale, and more)
- ✅ Secure password validation
- ✅ Token expiration management (24-hour default)
- ✅ Async error handling
- ✅ Environment-based configuration
- ✅ TypeScript support with strict type checking
- ✅ RESTful API endpoints

## 📋 Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/AndrePassoni/JWT-Authorizations.git
cd JWT-Authorizations
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env-example`:
```bash
cp .env-example .env
```

4. Set your JWT secret in the `.env` file:
```env
AUTH_SECRET=your_secret_key_here
```

## 🏃 Running the Application

### Development Mode
Start the development server with hot reload:
```bash
npm run dev
```

The server will run on `http://localhost:3333`

## 🏗️ Project Structure

```
src/
├── configs/
│   └── auth.ts              # JWT configuration
├── controllers/
│   ├── products-controller.ts    # Products business logic
│   └── sessions-controller.ts    # Authentication/login logic
├── middlewares/
│   ├── ensureAuthenticated.ts    # JWT token validation
│   └── verifyUserAuthorization.ts # Role-based authorization
├── routes/
│   ├── index.ts             # Route aggregator
│   ├── products.routes.ts   # Products endpoints
│   └── sessions.routes.ts   # Authentication endpoints
├── types/
│   └── express.d.ts         # Express type extensions
├── utils/
│   └── AppError.ts          # Custom error class
└── server.ts                # Server entry point
```

## 🔌 API Endpoints

### Authentication
- **POST** `/sessions` - Create new session (login)
  - **Body**: `{ "username": "string", "password": "string" }`
  - **Response**: `{ "token": "jwt_token_string" }`
  - **Status**: 201 Created / 401 Unauthorized

### Products
- **GET** `/products` - List all products
  - **Response**: `{ "message": "Products listed successfully" }`
  - **Status**: 200 OK

- **POST** `/products` - Create a new product
  - **Headers**: `Authorization: Bearer <token>`
  - **Required Roles**: admin, sale
  - **Response**: `{ "message": "sale" }` (returns user role)
  - **Status**: 201 Created / 401 Unauthorized / 401 Unauthorized (Invalid role)

## 🔐 Authentication Flow

### 1. User Login (Create Session)
```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "123456"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Access Protected Routes
```bash
curl -X POST http://localhost:3333/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 👤 Default User

For testing purposes, a hardcoded user is available:

| Field | Value |
|-------|-------|
| Username | john_doe |
| Password | 123456 |
| Role | sale |
| ID | 1 |

> **⚠️ Security Note**: Never use hardcoded credentials in production. Implement a proper user database with password hashing.

## 🛡️ Authorization Levels

The application supports role-based access control:

- **admin**: Full access to all protected resources
- **sale**: Access to sales-related resources
- Other custom roles can be easily added

To restrict endpoints to specific roles:
```typescript
productsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale", "admin"]),
  productsController.create
)
```

## 🔧 Middleware Usage

### ensureAuthenticated
Validates JWT token presence and validity:
```typescript
// Protects a route with JWT validation
route.post("/", ensureAuthenticated, controller.method)
```

### verifyUserAuthorization
Checks if user has required roles:
```typescript
// Restricts access to specific roles
route.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "sale"]),
  controller.method
)
```

## ⚙️ Configuration

### JWT Settings
Located in `src/configs/auth.ts`:

```typescript
export const authConfig = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default",
    expiresIn: "1d",  // Token expiration time
  },
}
```

### Environment Variables
Create a `.env` file with:
```env
AUTH_SECRET=your_jwt_secret_key_minimum_32_chars
```

## 🛠️ Technologies Used

### Core
- **Express.js** 4.21.0 - Web framework
- **TypeScript** 5.6.2 - Type-safe language
- **Node.js** 18+ - Runtime environment

### Authentication
- **jsonwebtoken** 9.0.2 - JWT token generation and verification

### Development Tools
- **tsx** 4.19.1 - TypeScript executor for Node.js
- **@types/express** 4.17.21 - Express type definitions
- **@types/node** 22.5.4 - Node.js type definitions
- **@types/jsonwebtoken** 9.0.6 - JWT type definitions

### Error Handling
- **express-async-errors** 3.1.1 - Async error handling wrapper

## 📝 Error Handling

The application uses centralized error handling through the `AppError` class:

```typescript
class AppError {
  message: string
  statusCode: number
  constructor(message: string, statusCode: number = 400)
}
```

All errors are caught and returned with appropriate HTTP status codes:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

## 🧪 Testing Endpoints

### 1. Login as john_doe
```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "123456"}'
```

### 2. Get Products (Public)
```bash
curl http://localhost:3333/products
```

### 3. Create Product (Protected)
```bash
TOKEN="<your_jwt_token>"
curl -X POST http://localhost:3333/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

## 🔍 Token Structure

The JWT token contains the following payload:
```json
{
  "role": "sale",
  "sub": "1",
  "iat": 1234567890,
  "exp": 1234654290
}
```

- `role`: User's role for authorization
- `sub`: Subject (user ID)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

## 📚 Learning Outcomes

This project covers:

1. **Authentication Concepts**
   - JWT structure and usage
   - Token generation and validation
   - Secure token storage considerations

2. **Authorization Concepts**
   - Role-based access control (RBAC)
   - Middleware-based permission checking
   - Resource protection patterns

3. **Express.js Advanced Topics**
   - Middleware implementation
   - Error handling patterns
   - Route organization
   - Async/await with error handling

4. **TypeScript Best Practices**
   - Interface definitions
   - Type safety
   - Custom type extensions

## 📖 Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/) - JWT decoder and information
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rocketseat](https://rocketseat.com.br/) - Course platform

## 📄 License

ISC

## 👨‍💻 Author

Developed as part of the **Fullstack Course - Authentication and Authorization Module** by Rocketseat.

---

**Created**: May 2026  
**Course**: Rocketseat Fullstack  
**Module**: Authentication and Authorization
