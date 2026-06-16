# SafeVault - Secure Password Management System

SafeVault is a secure, responsive, full-stack Password Management System built to securely store, encrypt, and manage login credentials. The application utilizes industry-standard security practices including AES-256 symmetric encryption, master password hashing with Bcrypt, and stateless JWT authorization.

---

## 🔗 Live Deployments

*   **Live Web Vault**: [calm-dieffenbachia-d83202.netlify.app](https://calm-dieffenbachia-d83202.netlify.app/)
*   **Live Backend API**: [password-manager-api-3uh1.onrender.com](https://password-manager-api-3uh1.onrender.com/api/health)
*   **Online Database**: Hosted on Clever Cloud

---

## 🚀 Key Features

1.  **Secure User Registration & Login**: Protects user access with master passwords hashed via Bcrypt (salt rounds = 10).
2.  **Stateless JWT Authentication**: Secures restrict API endpoints using token-based middleware.
3.  **AES-256-CBC Encryption**: Encrypts all stored credentials before writing to the database using Node.js native `crypto` modules and a unique Initialization Vector (IV).
4.  **Live Password Strength Meter**: Provides visual strength indicators and tips in real-time.
5.  **Secure Password Generator**: Allows users to dynamically generate strong, customized passwords.
6.  **Interactive Dashboard Table**: Provides search by website name, dynamic show/hide toggles, direct clipboard copying, and secure deletion prompts.
7.  **Audit Logging**: Automatically logs every security operation (login, register, add, decrypt, delete) with client IP addresses.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite), Material UI (MUI), React Router DOM, Axios
*   **Backend**: Node.js, Express.js, JSON Web Token (JWT), BcryptJS
*   **Database**: MySQL (hosted on Clever Cloud)
*   **Security Modules**: Node.js native `crypto` module (AES-256-CBC)

---

## 🗄️ Database Schema

The system uses three relational tables in MySQL:

```sql
-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    master_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Passwords Table
CREATE TABLE passwords (
    password_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    website_name VARCHAR(100) NOT NULL,
    website_url VARCHAR(255),
    login_username VARCHAR(100) NOT NULL,
    encrypted_password VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Audit Logs Table
CREATE TABLE audit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    website_name VARCHAR(100) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## ⚙️ Local Setup and Installation

### 1. Database Setup
Import the [schema.sql](schema.sql) file into your local MySQL instance.

### 2. Configure Environment variables (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=password_manager
JWT_SECRET=your_jwt_secret_key
AES_KEY=your_64_character_hex_key
```

### 3. Start Backend Server
```bash
cd server
npm install
npm run dev
```

### 4. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to access the vault locally.
