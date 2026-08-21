````markdown
# 📚 Library Management System

A full-stack Library Management System built using React, Node.js, Express.js, and MySQL.

## 🚀 Features

- User Signup and Login
- JWT Authentication
- Protected Routes
- Library Dashboard
- View Books
- Add Books
- Issue Books
- Return Books
- Book History
- Reference Books
- Payments
- Responsive Design
- Mobile Hamburger Navigation

## 🛠️ Tech Stack

- React
- React Router
- JavaScript
- CSS
- Vite
- Node.js
- Express.js
- MySQL
- JWT
- js-cookie
- Nodemon

## 📁 Project Structure

library-management-system/
│
├── backend/
│ ├── middleware/
│ ├── server.js
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── AddBook/
│ │ │ ├── Books/
│ │ │ ├── Home/
│ │ │ ├── IssueBooks/
│ │ │ ├── Layout/
│ │ │ ├── Login/
│ │ │ ├── Payments/
│ │ │ ├── ProtectedRoute/
│ │ │ ├── ReferenceBooks/
│ │ │ ├── ReturnedBooks/
│ │ │ └── Signup/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── database/
│ └── library_management.sql
│
├── .gitignore
└── README.md

# 💻 Setup on a New Computer

## 1. Install Required Software

Install:

- Git
- Node.js
- MySQL Server
- MySQL Workbench
- VS Code (optional)

Verify:

```bash
git --version
node --version
npm --version
mysql --version
```
````

## 2. Clone the Repository

```bash
git clone https://github.com/Harishyarram/library-management-system.git
```

```bash
cd library-management-system
```

## 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 4. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## 5. Create Environment File

Inside the `backend` folder create:

```text
.env
```

Add:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=library_management
JWT_SECRET=YOUR_NEW_JWT_SECRET
```

Replace `YOUR_MYSQL_PASSWORD` with the MySQL password on the current computer.

Do not upload `.env` to GitHub.

## 6. Create MySQL Database

Open MySQL Workbench and run:

```sql
CREATE DATABASE library_management;
```

## 7. Restore Database

The project contains:

```text
database/library_management.sql
```

From the project root:

```bash
mysql -u root -p library_management < database/library_management.sql
```

If `mysql` is not recognized on Windows:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p library_management < database\library_management.sql
```

Enter your MySQL password.

## 8. Start Backend

Open Terminal 1:

```bash
cd library-management-system/backend
npm start
```

Expected:

```text
Server running on port 5000
MySQL database connected!
```

Backend:

```text
http://localhost:5000
```

## 9. Start Frontend

Open Terminal 2:

```bash
cd library-management-system/frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

# 🔄 Running the Project After Initial Setup

You only need two terminals.

## Terminal 1 — Backend

```bash
cd library-management-system/backend
npm start
```

## Terminal 2 — Frontend

```bash
cd library-management-system/frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

# 🔄 Get Latest Changes

If the project already exists on another computer:

```bash
cd library-management-system
git pull
```

If dependencies changed:

```bash
cd frontend
npm install

cd ../backend
npm install
```

Then start the backend and frontend.

# 📤 Save New Changes to GitHub

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

Example:

```bash
git add .
git commit -m "Add book search feature"
git push
```

# 🔐 Environment Variables

The `.env` file is intentionally excluded from GitHub.

Every computer must create its own:

```text
backend/.env
```

Never upload passwords, database credentials, or JWT secrets to GitHub.

# 🗄️ Database

Database name:

```text
library_management
```

Database backup:

```text
database/library_management.sql
```

To restore:

```bash
mysql -u root -p library_management < database/library_management.sql
```

# 🔄 Application Flow

Signup
↓
Login
↓
JWT Authentication
↓
Dashboard
↓
Books
↓
Issue Book
↓
Return Book
↓
Book History

Reference Books
↓
View Only

# 👨‍💻 Author

Harishyarram

# 📄 License

This project is developed for educational and academic purposes.

```

**You can copy the entire block directly into your `README.md`.**
```
