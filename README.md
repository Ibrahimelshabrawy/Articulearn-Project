# 📚 Articulearn App Backend

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Redis](https://img.shields.io/badge/Redis-Caching-red)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

A backend API for the Articulearn platform with role-based authentication, exercise management, attempt submission, and progress tracking.

---

## 🚀 Features

- Authentication for users, parents, and admins using JWT
- Role-based access control for protected routes
- Create, update, activate, and deactivate exercises
- Pronunciation and sentence builder attempt submission
- Parent-child progress tracking
- MongoDB for primary storage and Redis for caching
- File upload support using Multer + Cloudinary
- Request validation using Joi
- Centralized error handling

---

## 📦 Project Structure

- `src/index.js` - application bootstrap
- `src/app.controller.js` - Express app and route setup
- `src/DB/` - MongoDB and Redis connection modules
- `src/modules/` - auth, users, exercises, attempts, and progress
- `config/` - environment configuration

---

## ⚙️ Requirements

- Node.js `24.12.0`
- MongoDB
- Redis
- `npm install` dependencies

---

## 🛠 Installation

```bash
git clone https://github.com/Ibrahimelshabrawy/Articulearn-Project.git
cd "Articulearn Project"
npm install
```

Create a `.env` file from `config/development.env` and update the values for your environment.

---

## 🔧 Environment Variables

Required values:

- `PORT`
- `DB_URI`
- `DB_URI_ONLINE`
- `REDIS_URI`
- `AI_URL`
- `ACCESS_SECRET_KEY_USER`
- `ACCESS_SECRET_KEY_ADMIN`
- `ACCESS_SECRET_KEY_PARENT`
- `ENCRYPT_SECRET_KEY`
- `PREFIX_USER`
- `PREFIX_ADMIN`
- `PREFIX_PARENT`
- `GOOGLE_CLIENT_ID`
- `CLOUD_NAME`
- `CLOUD_API_KEY`
- `CLOUD_API_SECRET`

> Do not commit secrets to version control.

---

## ▶️ Start the App

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

---

## 🌍 Deployment

This project is deployed and available in production.

- Live URL: `http://54.163.152.172`
- Confirm production environment variables are configured properly

---

## 🔌 API Endpoints

### Auth

- `POST /auth/signup` - Register a new user
- `POST /auth/signup/gmail` - Register with Google
- `POST /auth/signin` - Login and receive tokens

### Users

- `GET /users/profile` - Get user profile
- `PATCH /users/update` - Update profile
- `DELETE /users/delete` - Delete profile
- `GET /users/parent/code` - Get parent link code
- `GET /users/parent/children` - List child accounts

### Exercises

- `POST /exercises/create-pronunciation` - Create pronunciation exercise (admin)
- `POST /exercises/create-sentence` - Create sentence exercise (admin)
- `GET /exercises/count-exercises` - Total exercises count (admin)
- `GET /exercises/:type/:level` - Exercises by type and level
- `GET /exercises/:id` - Get exercise details
- `PATCH /exercises/update-pronunciation/:id` - Update pronunciation exercise
- `PATCH /exercises/update-sentence/:id` - Update sentence exercise
- `PATCH /exercises/deactivate/:id` - Deactivate exercise
- `PATCH /exercises/activate/:id` - Activate exercise

### Attempts

- `POST /exercises/:exerciseId/attempt/create-sentence-builder` - Submit sentence builder attempt
- `POST /exercises/:exerciseId/attempt/pronunciation` - Submit pronunciation attempt

### Progress

- `GET /users/parent/child/:childId/child-progress` - Child progress report
- `GET /users/parent/child/:childId/me` - User progress report

---

## 📝 Notes

- Uses Express middleware for security and JSON parsing
- Redis supports caching and fast access
- Multer handles audio upload endpoints
- Cloudinary stores media files

---
