# 📱 CodeAlpha Social Media Platform

A full-stack social media web application developed as part of the **CodeAlpha Full Stack Development Internship**.

## 🚀 Features

* 👤 User Profile Management
* ✏️ Edit Profile
* 📝 Create and Publish Posts
* ❤️ Like Posts
* 💬 Add and View Comments
* ➕ Follow Users
* 👥 View Followers and Following
* 📊 Profile Statistics
* 📱 Responsive and Modern UI

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* SQLite

## 📂 Project Structure

```text
CodeAlpha_SocialMedia/
│
├── backend/
│   ├── server.js
│   └── database.js
│
├── index.html
├── script.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Shrutiprabhu23/CodeAlpha_SocialMedia.git
```

### 2. Open the Project

```bash
cd CodeAlpha_SocialMedia
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
node backend/server.js
```

### 5. Open in Browser

```text
http://localhost:3000
```

## 🔌 API Features

| Method | Endpoint                   | Purpose          |
| ------ | -------------------------- | ---------------- |
| POST   | `/api/users`               | Create a user    |
| GET    | `/api/users/:id`           | Get user profile |
| PUT    | `/api/users/:id`           | Update profile   |
| POST   | `/api/posts`               | Create a post    |
| GET    | `/api/posts`               | Get all posts    |
| POST   | `/api/comments`            | Add a comment    |
| GET    | `/api/comments/:post_id`   | Get comments     |
| POST   | `/api/likes`               | Like a post      |
| POST   | `/api/follow`              | Follow a user    |
| GET    | `/api/users/:id/followers` | Get followers    |
| GET    | `/api/users/:id/following` | Get following    |

## 💡 Project Objective

The objective of this project is to develop a simple social media platform where users can create profiles, share posts, interact through likes and comments, and connect with other users through a follow system.

## 🎓 Internship

**CodeAlpha – Full Stack Development Internship**

### Task 2: Social Media Platform

Developed using **HTML, CSS, JavaScript, Node.js, Express.js and SQLite**.

## 👩‍💻 Developed By

**Shruti Prabhakaran**

B.Tech Information Technology
