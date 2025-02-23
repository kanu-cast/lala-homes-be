# lala-homes-be

![CI](https://github.com/kanu-cast/lala-homes-be/actions/workflows/ci.yml/badge.svg)
![Codecov](https://codecov.io/gh/kanu-cast/lala-homes-be/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN)

# 🏡 LALA Homes Backend

This is the backend service for **LALA Homes**, a home booking platform built with the **PERN stack** (PostgreSQL, Express.js, React, and Node.js). It provides APIs for user authentication, property listings, and booking management.

## 🚀 Features

- User authentication (Local & Google OAuth)
- Property listing management (CRUD operations)
- Booking system with status tracking
- Role-based access control (Renters & Hosts)
- API documentation with Swagger
- PostgreSQL database integration
- Secure authentication using JWT

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** Passport.js (Local & Google OAuth)
- **Testing:** Jest & Supertest
- **Documentation:** Swagger
- **Deployment:** Docker, Render

---

## 📦 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/yourusername/lala-homes-be.git
cd lala-homes-be


```

## Install dependencies
```

npm install

```

## enviroments

```

PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=your_db_host
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

```


## Start Development Server 


```

npm run dev

```
## Start Production Server
```

npm run start

```

## Environment variables 

```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=your_db_host
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🔥 API Documentation
Once the server is running, access the Swagger API docs at:

http://localhost:5000/api/docs

## Build and Run the Containers
🐳 Running with Docker

```
docker compose up -d

```
Stopping containers
```
docker compose down
```
## Testing
```
npm test
```
