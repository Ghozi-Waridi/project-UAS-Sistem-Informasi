# 🌐 GDSS Pro - Group Decision Support System

Sistem Pendukung Keputusan Kelompok yang mengintegrasikan panel Admin dan Decision Maker dalam satu aplikasi web modern.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![Tech Stack](https://img.shields.io/badge/Go-1.24-00ADD8)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Tech Stack](https://img.shields.io/badge/Vite-7-646CFF)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-4-38B2AC)

## 📖 Overview

GDSS Pro adalah aplikasi web full-stack untuk mendukung proses pengambilan keputusan kelompok menggunakan berbagai metode seperti AHP, SAW, TOPSIS, dan Borda Count. Aplikasi ini memiliki dua panel utama:

- **Admin Panel**: Untuk mengelola proyek, kandidat, kriteria, dan melihat hasil keputusan
- **Decision Maker Panel**: Untuk melakukan evaluasi kandidat dan memberikan penilaian

## ✨ Features

### Admin Features

- 📊 Dashboard dengan statistik lengkap
- 👥 Manajemen kandidat/alternatif
- 📋 Manajemen kriteria keputusan
- 🎯 Manajemen Decision Maker
- 📈 Visualisasi hasil keputusan
- 🤝 Konsensus keputusan final

### Decision Maker Features

- 🎯 Dashboard evaluator dengan progress tracking
- 📝 Form penilaian kandidat
- ⚖️ Input pairwise comparison (AHP)
- 🔢 Direct weight assignment
- ⭐ Score assignment untuk kandidat
- 📊 Review semua evaluasi
- 🤝 Status konsensus antar evaluator

## 🏗️ Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite 7** - Lightning fast build tool
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - Utility-first CSS
- **Recharts** - Data visualization

### Backend

- **Go 1.24** - High-performance backend
- **Gin** - Web framework
- **GORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites Check

```bash
./check-prerequisites.sh
```

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd project-UAS-Sistem-Informasi
```

2. **Setup Frontend**

```bash
cd interfaces
npm install
cp .env.example .env
```

3. **Setup Backend**

```bash
cd services
go mod tidy
# Setup database configuration in internal/config/config.go
```

### Running the Application

**Option 1: Automatic (Recommended)**

```bash
./start.sh
```

**Option 2: Manual**

Terminal 1 - Backend:

```bash
cd services
go run cmd/api/main.go
```

Terminal 2 - Frontend:

```bash
cd interfaces
npm run dev
```

### Stop the Application

```bash
./stop.sh
```

### Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 📁 Project Structure

```
project-UAS-Sistem-Informasi/
├── interfaces/                 # Frontend React Application
│   ├── src/
│   │   ├── admin/             # Admin panel
│   │   │   ├── components/    # Reusable components
│   │   │   └── pages/         # Admin pages
│   │   ├── dm/                # Decision Maker panel
│   │   ├── components/        # Shared components
│   │   ├── config/            # API configuration
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Main routing
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Environment variables
│   └── vite.config.js         # Vite configuration
│
├── services/                   # Backend Go Application
│   ├── cmd/api/               # Main application
│   └── internal/
│       ├── calculations/      # Decision algorithms
│       ├── handler/           # HTTP handlers
│       ├── middleware/        # Middlewares
│       ├── models/            # Data models
│       ├── repository/        # Data access layer
│       ├── routes/            # Route definitions
│       └── service/           # Business logic
│
├── check-prerequisites.sh      # Prerequisites checker
├── start.sh                    # Start all services
├── stop.sh                     # Stop all services
├── QUICK_START.md             # Quick start guide
├── INTEGRATION_GUIDE.md       # Integration documentation
└── SUMMARY.md                 # Project summary
```

## 🔐 Authentication

The application uses JWT-based authentication:

- Login credentials are validated against the database
- JWT token is stored in localStorage
- Token is automatically included in all API requests
- Auto-redirect to login on 401 Unauthorized

## 🛣️ Routing

### Admin Routes

- `/beranda` - Home page
- `/dashboard` - Admin dashboard
- `/decision-maker` - Consensus management
- `/kandidat` - Candidate management
- `/hasil` - Final results

### Decision Maker Routes

- `/dm/dashboard` - DM dashboard
- `/dm/kandidat` - Candidate list
- `/dm/penilaian/:id` - Evaluation form
- `/dm/evaluasi-semua` - All evaluations
- `/dm/hasil` - Selection results
- `/dm/konsensus-detail` - Consensus details

### Auth Routes

- `/login` - Login page
- `/register` - Registration page

## 📡 API Integration

All API calls are handled through service layer:

```javascript
import {
  authService,
  projectService,
  criteriaService,
  alternativeService,
  evaluationService,
  decisionService,
} from "./services";

// Example: Login
const response = await authService.login({ username, password });

// Example: Get projects
const projects = await projectService.getProjects();

// Example: Submit evaluation
await evaluationService.submitScores(projectId, scoresData);
```

## 🔧 Development

### Available Scripts (Frontend)

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run clean      # Clean node_modules and dist
npm run reinstall  # Clean and reinstall dependencies
```

### Backend Commands

```bash
go run cmd/api/main.go    # Run backend server
go build                  # Build binary
go mod tidy              # Update dependencies
```

## 🐛 Troubleshooting

See [QUICK_START.md](QUICK_START.md) for common issues and solutions.

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Get started quickly
- [Integration Guide](INTEGRATION_GUIDE.md) - Detailed integration docs
- [Summary](SUMMARY.md) - Project summary and features

## 🤝 Contributing

This is an academic project for UAS (Final Exam) - Information Systems.

## 👥 Team

Sistem Informasi - Group Project

## 📄 License

Academic Use Only

---

**Made with ❤️ for UAS Sistem Informasi**
