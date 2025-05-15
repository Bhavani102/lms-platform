# 📚 Comprehensive Learning Management System (LMS) with AI Chatbot 🤖

A full-featured web-based Learning Management System that provides a one-stop solution for managing courses, assignments, grades, quizzes, and student interactions. Integrated with an AI-powered chatbot to enhance the learning experience by answering student queries instantly.

---

## 🚀 Features

- 📘 **My Courses** – View all your enrolled courses  
- 📝 **Assignments** – View, submit, and track assignments  
- 📊 **Grades** – Access and review your performance  
- 🧠 **AI Chatbot** – Instantly get answers to your academic queries  
- 🧪 **Quiz Module** – Attempt quizzes for each course  
- 🎓 **Course Enrollment** – Enroll in new courses seamlessly  
- 🖥️ **Responsive Dashboard** – Clean, role-based UI (Student/Admin)  

---

## 🛠️ Tech Stack

- **Frontend**: ReactJS, Material-UI (MUI)  
- **Routing**: React Router   
- **Backend**:  Node.js, Express 
- **Database**: MongoDB

---
## ⚙️ Getting Started

### 📦 Clone the Repository

## ⚙️ Project Setup

This project is divided into two main parts: the **Frontend** (React) and the **Backend** (Node.js + Express + MongoDB). Follow the steps below to run the project locally.

---

### 📁 Backend Setup (`/server`)

1. Navigate to the backend folder:

   ```bash
   cd server
Install backend dependencies:
npm install

Create a .env file in the server directory and add the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend server:
npm start
Backend will run on: http://localhost:5000

💻 Frontend Setup (/client)
Navigate to the frontend folder:
cd ../client

Install frontend dependencies:
npm install

Start the frontend React app:
npm start
Frontend will run on: http://localhost:3000
