using nodejs, reactjs, typescript with mongodb
# 📝 Blog Application  

## 🚀 Project Overview  
This is a **Full Stack Blog Application** built using **React.js with TypeScript and Material-UI** for the frontend, and **Node.js with MongoDB** for the backend. The application allows users to **create, edit, delete, and view blog posts** with a modern and responsive UI.  

## 📌 Features  
- 📝 **Create, Read, Update, Delete (CRUD) Blog Posts**  
- 🔐 **User Authentication (JWT-based Login & Signup)**  
- 🌐 **Rich Text Editor for Blog Content**  
- 🎨 **Material-UI for a Responsive UI**  
- 📡 **REST API with Express & MongoDB**  
- 🚀 **Dockerized Deployment Support**  
- 🛠️ **Unit & Integration Testing (Jest, Supertest, React Testing Library)**  

---

## 🏗️ Tech Stack  

### 🔹 Frontend  
- **React.js (with TypeScript)**
- **Material-UI (MUI)**
- **React Router**
- **Axios for API Calls**  

### 🔹 Backend  
- **Node.js & Express.js**  
- **MongoDB with Mongoose**  
- **JWT for Authentication**  
- **Bcrypt for Password Hashing**  

### 🔹 DevOps & Testing  
- **Docker for Containerization**  
- **Jest, Supertest, React Testing Library**  
- **ESLint & Prettier for Code Formatting**  

---

## 📂 Project Setup  

### 🔹 1️⃣ Clone the Repository  
```sh
git clone https://github.com/yourusername/blog-app.git
cd blog-app

2️⃣ Install Dependencies
📌 Frontend

cd frontend
npm install
📌 Backend

cd backend
npm install

Environment Variables
Create a .env file in the backend folder and configure the following:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=your_secret_key
🔨 Running the Application
🔹 Start Backend

cd backend
npm run dev
API will be available at: http://localhost:5000/

🔹 Start Frontend

cd frontend
npm start
App will be available at: http://localhost:3000/

🧪 Running Tests
Run tests for both frontend and backend:

🔹 Backend Tests

cd backend
npm test
🔹 Frontend Tests

cd frontend
npm test
📜 API Documentation
Swagger is integrated. Once the backend is running, visit:
http://localhost:5000/api-docs


