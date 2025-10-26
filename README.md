# 💰 ExpenseNavigator

> A modern expense tracking web application built with Node.js, Express.js, and MongoDB Atlas

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📖 What is ExpenseNavigator?

ExpenseNavigator is a **cloud-based expense management system** that helps you track your income and expenses easily. It features:

✅ **User Authentication** - Secure login and registration  
✅ **Expense Tracking** - Add, edit, and delete expenses  
✅ **Admin Dashboard** - Manage all users and expenses  
✅ **Cloud Storage** - All data stored in MongoDB Atlas  
✅ **Role-Based Access** - Separate User and Admin dashboards  

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Node.js 20.x** | Backend runtime |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Vanilla JavaScript** | Frontend |
| **HTML/CSS** | UI design |

---

## 📁 Project Structure

```
ExpenseNavigator/
│
├── backend/                    # Backend server code
│   ├── server.js              # Main Express server
│   │
│   └── api/                   # API endpoints
│       ├── _lib/              # Shared libraries
│       │   ├── db.js         # MongoDB connection
│       │   ├── auth.js       # JWT & password utilities
│       │   └── middleware.js # Auth middleware
│       │
│       ├── auth/              # Authentication endpoints
│       │   ├── login.js      # POST /api/auth/login
│       │   ├── logout.js     # POST /api/auth/logout
│       │   └── register.js   # POST /api/auth/register
│       │
│       ├── expenses/          # Expense endpoints
│       │   ├── index.js      # GET/POST /api/expenses
│       │   └── [id].js       # GET/PUT/DELETE /api/expenses/:id
│       │
│       └── admin/             # Admin-only endpoints
│           ├── users/
│           │   ├── index.js  # GET /api/admin/users
│           │   └── [id].js   # GET/PUT/DELETE /api/admin/users/:id
│           │
│           └── expenses/
│               ├── index.js  # GET /api/admin/expenses
│               └── [id].js   # GET/PUT/DELETE /api/admin/expenses/:id
│
├── frontend/                   # Frontend code
│   ├── public/                # HTML pages
│   │   ├── index.html        # Home page
│   │   ├── login.html        # Login page
│   │   ├── register.html     # Registration page
│   │   ├── dashboard.html    # User dashboard
│   │   ├── edit-expense.html # Edit expense (user)
│   │   │
│   │   └── admin/            # Admin pages
│   │       ├── dashboard.html      # Admin dashboard
│   │       ├── edit-user.html      # Edit user
│   │       └── edit-expense.html   # Edit expense (admin)
│   │
│   └── assets/               # Static assets
│       ├── css/              # Stylesheets
│       │   ├── login.css
│       │   ├── register.css
│       │   └── dashboard.css
│       │
│       └── js/               # JavaScript files
│           ├── config.js
│           ├── user-dashboard.js
│           └── admin-dashboard.js
│
├── .env                       # Environment variables (DO NOT PUSH)
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
├── vercel.json               # Vercel deployment config
├── START_SERVER.bat          # Local server startup script
└── README.md                 # This file
```

---

## 🚀 Quick Start Guide

### **Prerequisites**

Before you begin, ensure you have:

- ✅ **Node.js 20.x** installed ([Download here](https://nodejs.org))
- ✅ **MongoDB Atlas account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- ✅ **Git** installed
- ✅ **Code editor** (VS Code recommended)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/ExpenseNavigator.git
cd ExpenseNavigator
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Configure Environment Variables**

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/expense_navigator?retryWrites=true&w=majority

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=development
```

**Important:** Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials.

### **Step 4: Set Up MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Add your IP address to Network Access (or use `0.0.0.0/0` for testing)
5. Copy your connection string to `.env` file

### **Step 5: Initialize Database**

```bash
# Start the server
node backend/server.js
```

Then visit: `http://localhost:5001/setup`

Click "Initialize Database" to create:
- ✅ Admin user: `admin` / `admin123`
- ✅ Database collections

### **Step 6: Access the Application**

Open your browser and navigate to:

- 🏠 **Home:** http://localhost:5001
- 🔐 **Login:** http://localhost:5001/login
- 📝 **Register:** http://localhost:5001/register

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`
- Role: `Admin`

---

## 📋 API Endpoints

### **Authentication**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Authenticated |

### **Expenses (User)**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/expenses` | Get user's expenses | User |
| POST | `/api/expenses` | Create new expense | User |
| GET | `/api/expenses/:id` | Get expense by ID | User |
| PUT | `/api/expenses/:id` | Update expense | User |
| DELETE | `/api/expenses/:id` | Delete expense | User |

### **Admin - Users**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

### **Admin - Expenses**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/expenses` | Get all expenses | Admin |
| GET | `/api/admin/expenses/:id` | Get expense by ID | Admin |
| PUT | `/api/admin/expenses/:id` | Update any expense | Admin |
| DELETE | `/api/admin/expenses/:id` | Delete any expense | Admin |

---

## 🌐 Deploy to Vercel

### **Option 1: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### **Option 2: Deploy via GitHub**

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Click "Deploy"

Your app will be live at: `https://your-project.vercel.app`

---

## 🎨 Features Overview

### **For Users:**
- ✅ Register and login securely
- ✅ Add new expenses with source, amount, and date
- ✅ View all your expenses in a dashboard
- ✅ Edit your expenses
- ✅ Delete expenses you no longer need
- ✅ Track total spending

### **For Admins:**
- ✅ All user features PLUS:
- ✅ View all registered users
- ✅ Edit user information
- ✅ Delete users
- ✅ View ALL expenses from ALL users
- ✅ Edit any user's expenses
- ✅ Delete any expense
- ✅ Track system-wide statistics

---

## 🗂️ Database Schema

### **Users Collection**

```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  email: String (unique),
  password: String (hashed with bcrypt),
  firstName: String,
  lastName: String,
  role: String (enum: ['user', 'admin']),
  gender: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Expenses Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  source: String,
  amount: Number,
  date: Date,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Troubleshooting

### **MongoDB Connection Error**

**Problem:** "Server error occurred during login"

**Solution:**
1. Check MongoDB Atlas is running
2. Verify connection string in `.env`
3. Ensure IP is whitelisted in MongoDB Atlas Network Access
4. Use Node.js 20.x (not 22.x)

### **Port Already in Use**

**Problem:** "EADDRINUSE: address already in use :::5001"

**Solution:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Then restart
node backend/server.js
```

### **Edit Buttons Not Working**

**Problem:** Clicking Edit redirects to login

**Solution:**
1. Clear browser localStorage
2. Login again
3. Check browser console for errors

---

## 📝 What are .bat Files?

The `.bat` files in this project are **Windows batch scripts** for local development:

### **START_SERVER.bat**
- **Purpose:** Starts the Node.js server easily
- **What it does:**
  1. Checks your Node.js version
  2. Warns if using incompatible version (Node.js 22)
  3. Starts the Express server
  4. Opens server at http://localhost:5001
- **Usage:** Double-click to run

**Note:** `.bat` files are in `.gitignore` - they won't be pushed to GitHub because:
- ❌ They only work on Windows
- ❌ They contain local development settings
- ❌ Deployment platforms (Vercel) don't need them

---

## 🚫 Files NOT Pushed to GitHub

Thanks to `.gitignore`, these files stay local:

```
✅ .env                  # Your MongoDB password is SAFE
✅ node_modules/         # Too large (100MB+)
✅ *.bat                 # Windows-only scripts
✅ *.json (except package.json & vercel.json)
✅ .vercel/              # Deployment artifacts
✅ *.log                 # Error logs
✅ temp files            # Temporary data
```

**Only these get pushed:**
- ✅ Source code (backend/, frontend/)
- ✅ package.json (dependencies)
- ✅ vercel.json (deployment config)
- ✅ README.md (documentation)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nirmal Sai Kumar**
- GitHub: [@Nirmal-sai-kumar](https://github.com/Nirmal-sai-kumar)
- Repository: [ExpenseNavigator](https://github.com/Nirmal-sai-kumar/expense-navigator)

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database
- Vercel for hosting platform
- Express.js framework
- JWT for secure authentication

---

## 📞 Support

Having issues? Check the [Troubleshooting](#troubleshooting) section above.

Still stuck? Open an issue on GitHub.

---

**Made with ❤️ by Nirmal Sai Kumar**
