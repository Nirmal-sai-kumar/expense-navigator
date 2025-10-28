# 💰 ExpenseNavigator

> A modern expense tracking web application built with Node.js, Express.js, and MongoDB Atlas

![Node.js](https://img.shields.io/badge/Node.js-18.x%20|%2020.x-green)
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
| **Node.js 18.x / 20.x** | Backend runtime (18.x local, 20.x Vercel) |
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

- ✅ **Node.js 18.x or 20.x** installed ([Download here](https://nodejs.org/en/download/prebuilt-installer))
  - ✅ **Local development:** Node.js 18.20.4 LTS (recommended)
  - ✅ **Vercel deployment:** Uses Node.js 20.x automatically
- ✅ **MongoDB Atlas account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- ✅ **Git** installed
- ✅ **Code editor** (VS Code recommended)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/ExpenseNavigator.git
cd ExpenseNavigator
```

### **Step 2: Install Node.js**

**Option A: Node.js 18.x LTS (Recommended for local)**

1. Download Node.js 18.20.4 LTS from [nodejs.org](https://nodejs.org/en/download/prebuilt-installer)
2. Install it (it will replace any existing version)
3. Verify installation:

```bash
node --version
# Should show: v18.20.4 (or another 18.x version)
```

**Option B: Node.js 20.x (Also compatible)**

Works perfectly with both local development and Vercel deployment.

**Note:** Vercel deployment uses Node.js 20.x regardless of your local version.

### **Step 3: Install Dependencies**

```bash
npm install
```

This will install all required packages including Express.js, MongoDB driver, JWT, bcryptjs, etc.

### **Step 4: Configure Environment Variables**

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.xxxxx.mongodb.net/expense_navigator?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=development
```

**⚠️ IMPORTANT:** 
- Replace `your_username`, `your_password`, and `your-cluster.xxxxx` with your actual MongoDB Atlas credentials
- Generate a strong JWT secret for production (use random string generator)
- Never commit your `.env` file to Git (it's already in `.gitignore`)

### **Step 5: Set Up MongoDB Atlas**

1. **Create Account & Cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new FREE cluster (M0 tier)
   - Choose a cloud provider and region

2. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set privileges to "Atlas Admin" or "Read and Write to any database"

3. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - For testing: Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - For production: Add only your server's IP address
   - ⚠️ This is required or connections will be blocked!

4. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" driver version 4.1 or later
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `expense_navigator`
   - Paste it in your `.env` file as `MONGODB_URI`

**Example Connection String:**
```
mongodb+srv://myuser:MyPassword123@cluster1.xxxxx.mongodb.net/expense_navigator?retryWrites=true&w=majority
```

### **Step 6: Initialize Database**

Start the server:

```bash
node backend/server.js
```

You should see:
```
✅ MongoDB Atlas connected successfully!
✅ MongoDB ping successful!
✅ Database selected: expense_navigator
🚀 Server running on port 5001
```

Then visit: `http://localhost:5001/setup.html`

Click **"Initialize Database"** to create:
- ✅ Admin user: `admin` / `admin123`
- ✅ Collections: `users` and `expenses`

### **Step 7: Access the Application**

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

### **Issue 1: MongoDB Connection Error**

**Symptoms:**
- Server hangs when starting
- Error: "MongoServerSelectionError"
- Error: "ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR"
- Login shows "Server error occurred"

**Solutions:**

1. **Check Node.js Version (MOST COMMON ISSUE)**
   ```bash
   node --version
   ```
   - ✅ Must be **v18.x.x** (e.g., v18.20.4)
   - ❌ If you see v20.x.x or v22.x.x, download and install Node.js 18.20.4 LTS
   - After installing Node 18, delete `node_modules` and run `npm install` again

2. **Verify MongoDB Connection String**
   - Open `.env` file
   - Check `MONGODB_URI` is correct
   - Ensure password doesn't contain special characters (or URL-encode them)
   - Database name should be `expense_navigator`

3. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → "Network Access"
   - Ensure your IP is whitelisted
   - For testing, add `0.0.0.0/0` (allow from anywhere)
   - Wait 2-3 minutes for changes to apply

4. **Verify Database User Credentials**
   - Go to MongoDB Atlas → "Database Access"
   - Ensure user exists and has correct privileges
   - Password in `.env` must match exactly

5. **Test MongoDB Connection**
   - Start server: `node backend/server.js`
   - Look for these messages:
     ```
     ✅ MongoDB Atlas connected successfully!
     ✅ MongoDB ping successful!
     ```
   - If you see these, connection is working!

### **Issue 2: Port Already in Use**

**Error:** `EADDRINUSE: address already in use :::5001`

**Solution (Windows PowerShell):**
```powershell
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Restart server
node backend/server.js
```

### **Issue 3: Login Not Working**

**Symptoms:**
- Login redirects back to login page
- "Invalid credentials" error
- Dashboard shows blank

**Solutions:**

1. **Initialize Database First**
   - Visit `http://localhost:5001/setup.html`
   - Click "Initialize Database"
   - This creates the admin user

2. **Clear Browser Cache**
   - Press `Ctrl + Shift + Delete`
   - Clear "Cookies and other site data"
   - Clear "Cached images and files"
   - Close and reopen browser

3. **Check Browser Console**
   - Press `F12` to open Developer Tools
   - Go to "Console" tab
   - Look for errors (e.g., "token is not defined")
   - Report errors in GitHub Issues

4. **Verify Admin Credentials**
   - Default username: `admin`
   - Default password: `admin123`
   - Case-sensitive!

### **Issue 4: Edit Buttons Not Working**

**Problem:** Clicking "Edit" redirects to login page

**Solutions:**

1. **Clear Local Storage**
   - Press `F12` → Go to "Application" tab
   - Click "Local Storage" → `http://localhost:5001`
   - Click "Clear All"
   - Login again

2. **Check Token**
   - In Developer Tools → Application → Local Storage
   - Verify `token` exists
   - If missing, logout and login again

### **Issue 5: npm install Fails**

**Error:** `npm ERR! code ENOENT`

**Solutions:**

1. **Check Node.js and npm**
   ```bash
   node --version   # Should show v18.x.x
   npm --version    # Should show 9.x.x or 10.x.x
   ```

2. **Clear npm Cache**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Delete node_modules and Reinstall**
   ```bash
   # Remove node_modules folder
   rm -rf node_modules
   
   # Remove package-lock.json
   rm package-lock.json
   
   # Reinstall
   npm install
   ```

### **Issue 6: Vercel Deployment Fails**

**Problem:** App works locally but fails on Vercel

**Solutions:**

1. **Check Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`
   - Redeploy after adding variables

2. **Check Build Logs**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Read build logs for specific errors

3. **Verify vercel.json**
   - Ensure `vercel.json` exists in root
   - Should have correct API routes configuration

### **Issue 7: "Cannot GET /api/..." Error**

**Problem:** API endpoints return 404

**Solution:**
- Ensure server is running: `node backend/server.js`
- Check endpoint path matches exactly
- Verify file exists in `backend/api/` folder

### **Still Having Issues?**

1. **Check Server Logs**
   - Look at terminal where `node backend/server.js` is running
   - Error messages will appear there

2. **Enable Verbose Logging**
   - Add `console.log()` statements in your code
   - Check what data is being received/sent

3. **Test with Postman**
   - Download [Postman](https://www.postman.com/)
   - Test API endpoints directly
   - Check if backend works without frontend

4. **Create GitHub Issue**
   - Go to repository Issues tab
   - Describe your problem with:
     - Error message (full text)
     - Steps to reproduce
     - Node.js version
     - Operating system
     - Screenshots if applicable

---

## 💡 Common Questions

### **Q: Can I use Node.js 20 or 22?**
**A:** No. Node.js 20+ has OpenSSL 3.0 which causes TLS connection errors with MongoDB Atlas. Stick with Node.js 18.x LTS.

### **Q: Is my data safe in MongoDB Atlas?**
**A:** Yes! MongoDB Atlas is a professional cloud database with:
- Automatic backups
- Encryption at rest and in transit
- Enterprise-grade security
- 99.95% uptime SLA

### **Q: Can I use a local MongoDB instead of Atlas?**
**A:** Yes, but you'll need to:
1. Install MongoDB Community Server locally
2. Change `MONGODB_URI` to `mongodb://localhost:27017/expense_navigator`
3. Update `backend/api/_lib/db.js` connection options (remove TLS settings)

### **Q: How do I change the admin password?**
**A:** 
1. Login as admin
2. Go to Admin Dashboard
3. Click "Edit" on admin user
4. Enter new password
5. Click "Update User"

### **Q: Can multiple people use this app?**
**A:** Yes! Each user:
- Creates their own account via Register page
- Has their own dashboard
- Can only see/edit their own expenses
- Admins can see all users and expenses

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
