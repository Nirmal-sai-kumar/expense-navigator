# 💰 ExpenseNavigator

A modern, cloud-based expense tracking application that helps you manage expenses efficiently with role-based access control for users and admins.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![Express](https://img.shields.io/badge/Express-4.x-blue)
---

## ✨ Features

- � **Secure Authentication** - JWT-based login and registration
- 💰 **Expense Management** - Add, edit, view, and delete expenses
- 👑 **Admin Dashboard** - Manage all users and their expenses
- ☁️ **Cloud Storage** - MongoDB Atlas cloud database
- 📊 **Real-time Analytics** - Track spending patterns
- 🎨 **Modern UI** - Clean and responsive interface

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js 18.x | Backend runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| JWT | Authentication |
| bcryptjs | Password encryption |
| HTML/CSS/JS | Frontend |

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18.x** ([Download here](https://nodejs.org/))
- ✅ **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- ✅ **Git** installed
- ✅ **GitHub Account** (for deployment)

---

## 🚀 Local Setup

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/Nirmal-sai-kumar/expense-navigator.git
cd expense-navigator
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Configure Environment Variables**

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/expense_navigator?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=5001
NODE_ENV=development
```

**⚠️ Important:** Replace `username`, `password`, and `cluster.xxxxx` with your actual MongoDB credentials.

### **Step 4: Set Up MongoDB Atlas**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up and create a **FREE cluster** (M0 tier)

2. **Create Database User**
   - Navigate to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Create username and password
   - Set role to **Read and write to any database**

3. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
   - Click **Confirm**

4. **Get Connection String**
   - Go to **Database** → Click **Connect** button
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database password
   - Update your `.env` file with this connection string

### **Step 5: Start the Server**

```bash
npm start
```

You should see:
```
✅ Server is running!
📍 Port: 5001
🌐 Pages:
   🏠 Home:       http://localhost:5001/
   🔐 Login:      http://localhost:5001/login
```

### **Step 6: Initialize Database**

1. Open browser and go to: `http://localhost:5001/setup`
2. Click **"Initialize Database"** button
3. This creates the default admin user

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🌐 Deploy to Render

### **Prerequisites**
- ✅ Code pushed to GitHub
- ✅ MongoDB Atlas configured
- ✅ Render account ([Sign up free](https://render.com))

### **Step 1: Prepare Your Repository**

Ensure `render.yaml` exists in your root directory (already included):

```yaml
services:
  - type: web
    name: expense-navigator
    runtime: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: node backend/server.js
    healthCheckPath: /api/health
```

### **Step 2: Push Code to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### **Step 3: Create Web Service on Render**

1. **Login to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click **New +** → **Web Service**
   - Click **Connect GitHub Account** (if first time)
   - Select your `expense-navigator` repository

3. **Configure Service**
   - **Name:** `expense-navigator`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main` or `develop`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`
   - **Plan:** Free

### **Step 4: Add Environment Variables**

In the Render dashboard, scroll to **Environment Variables** section and add:

```
NODE_ENV = production
MONGODB_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_super_secret_jwt_key
```

**⚠️ Important:** 
- Use the **same** MongoDB URI from your local `.env` file
- Use a **strong** JWT secret for production
- Don't use quotes around values

### **Step 5: Deploy**

1. Click **Create Web Service**
2. Render will automatically:
   - Clone your repository
   - Run `npm install`
   - Start your server
   - Provide a live URL

3. **Monitor Deployment**
   - Watch the **Logs** tab
   - Wait for: `✅ Server is running!`
   - Deployment takes ~2-3 minutes

4. **Your Live URL**
   - Will be: `https://expense-navigator.onrender.com`
   - Or: `https://your-app-name.onrender.com`

### **Step 6: Initialize Production Database**

1. Visit: `https://your-app-name.onrender.com/setup`
2. Click **"Initialize Database"**
3. Login with admin credentials

---

## 📁 Project Structure

```
ExpenseNavigator/
├── backend/
│   ├── server.js              # Main Express server
│   └── api/
│       ├── _lib/              # Database & auth utilities
│       ├── auth/              # Login, register, logout
│       ├── expenses/          # Expense CRUD operations
│       └── admin/             # Admin-only endpoints
│
├── frontend/
│   ├── public/                # HTML pages
│   │   ├── index.html         # Home page
│   │   ├── login.html         # Login page
│   │   ├── register.html      # Registration
│   │   ├── dashboard.html     # User dashboard
│   │   └── admin/             # Admin pages
│   │
│   └── assets/
│       ├── css/               # Stylesheets
│       └── js/                # JavaScript files
│
├── .env                       # Environment variables (local only)
├── package.json               # Dependencies
├── render.yaml                # Render deployment config
└── README.md                  # This file
```

---

## 🔑 Default Login Credentials

After database initialization:

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Access: Full system control

**⚠️ Security:** Change the default admin password immediately after first login!

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/expense_navigator` |
| `JWT_SECRET` | Secret key for JWT tokens | `my-super-secret-key-123` |
| `PORT` | Server port (optional) | `5001` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 🔧 Common Issues

### **Issue: MongoDB Connection Error**

**Solution:**
1. Verify MongoDB connection string in `.env`
2. Check Network Access in MongoDB Atlas (allow `0.0.0.0/0`)
3. Ensure database user credentials are correct

### **Issue: Port Already in Use**

**Solution (Windows PowerShell):**
```powershell
netstat -ano | findstr :5001
taskkill /PID <PID> /F
npm start
```

### **Issue: Login Not Working**

**Solution:**
1. Visit `http://localhost:5001/setup` to initialize database
2. Clear browser cookies and cache
3. Use correct credentials: `admin` / `admin123`

### **Issue: Render Deployment Failed**

**Solution:**
1. Check environment variables are set correctly
2. Verify `render.yaml` exists in repository
3. Check build logs in Render dashboard for errors

---

## 📞 Support

- **GitHub:** [@Nirmal-sai-kumar](https://github.com/Nirmal-sai-kumar)
- **Repository:** [expense-navigator](https://github.com/Nirmal-sai-kumar/expense-navigator)
- **Issues:** [Report a bug](https://github.com/Nirmal-sai-kumar/expense-navigator/issues)

---

## 📝 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Check git status
git status

# Push changes to GitHub
git add .
git commit -m "Your message"
git push origin main
```