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

## ✅ Prerequisites

Before running this project locally, ensure you have the following installed on your system:

- **Node.js** (v14 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** (Node package manager, usually comes with Node.js)
- **MongoDB** (local or cloud instance like MongoDB Atlas): [MongoDB Atlas Setup Guide](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for cloning the repo): [Download Git](https://git-scm.com/)

Also make sure:
- You've created a `.env` file with valid values for `MONGO_URI` and `JWT_SECRET`.
- Port `3000` (for frontend) and `5000` (or whichever port your backend runs on) are available.

### 📦 Clone the Repository
1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Bhavani102/lms-platform.git

## ⚙️ Project Setup

This project is divided into two main parts: the **Frontend** (React) and the **Backend** (Node.js + Express + MongoDB). Follow the steps below to run the project locally.

---

### 📁 Backend Setup (`/server`)

1. Navigate to the backend folder:

   ```bash
   cd server
   
2. Install backend dependencies:
   
   ```bash
   npm install

3. Create a `.env` file in the server directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. Start the backend server:

   ```bash
   npm start

Backend will run on: http://localhost:5000

### 💻 Frontend Setup (`/client`)

1. Navigate to the frontend folder:

  ```bash
  cd ../client
  ```

2. Install frontend dependencies:

  ```bash
  npm install
  ```

3. Start the frontend React app:

   ```bash
   npm start

Frontend will run on: http://localhost:3000
