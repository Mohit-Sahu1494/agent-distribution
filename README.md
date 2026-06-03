# ⚡ Admin Dashboard — Task Distribution System

A professional, full-stack MERN application designed for efficient task distribution. This system allows administrators to manage agents and distribute tasks from uploaded CSV/XLSX files equally using a round-robin algorithm.

---

## 🚀 Key Features

- **Robust Authentication:** Secure JWT-based admin login and registration system.
- **Agent Management:** Complete CRUD operations for managing task-receiving agents.
- **Smart Task Distribution:** Automatically parses Excel/CSV files and distributes tasks across active agents using a round-robin logic.
- **Comprehensive Dashboard:** Real-time statistics showing total agents, tasks distributed, and recent activity.
- **Task Tracking:** View all distributed tasks or filter them by individual agents.
- **Modern UI:** Clean, responsive, and dark-themed interface built with Tailwind CSS.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT (JSON Web Tokens) & bcryptjs for password hashing |
| **File Parsing** | Multer & XLSX (Excel parser) |

---

## 🗂 Project Structure

```
agent-task-system/
├── backend/                # Express API
│   ├── config/             # DB configurations
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & Upload handlers
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   ├── uploads/            # Temporary file storage
│   └── utils/              # Helper functions (Parser, Token)
│
└── frontend/               # React Application
    ├── src/
    │   ├── components/     # UI Components (Sidebar, Modals, Layout)
    │   ├── context/        # Auth Context provider
    │   ├── pages/          # Application views (Dashboard, Agents, Tasks, etc.)
    │   ├── services/       # API connection services
    │   └── utils/          # Frontend helpers
    └── public/             # Static assets
```

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📊 Usage Guide

1. **Login:** Use the default admin credentials or register a new account.
2. **Add Agents:** Go to the "Agents" section and add the people who will receive tasks.
3. **Upload Tasks:** In the "Upload" section, drag and drop an Excel (.xlsx) or CSV file.
4. **Required Columns:** Ensure your file has `FirstName`, `Phone`, and `Notes` columns.
5. **Review:** Check the "Tasks" page to see how the system distributed everything.

---

## 👤 Author

- **Name:** [Your Name]
- **Email:** [Your Email]
- **Portfolio:** [Your Portfolio Link]
- **GitHub:** [@yourusername]

---

## 📝 License

This project is licensed under the MIT License.
