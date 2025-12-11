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

## 📥 Instalasi Lengkap dari Awal

### 1. Instalasi Software yang Diperlukan

#### A. Install Node.js (untuk Frontend)

**macOS:**

```bash
# Menggunakan Homebrew
brew install node

# Atau download dari https://nodejs.org/ (LTS version recommended)
```

**Windows:**

```bash
# Download installer dari https://nodejs.org/ (LTS version)
# Jalankan installer dan ikuti petunjuk
```

**Linux (Ubuntu/Debian):**

```bash
# Update package manager
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verifikasi instalasi:**

```bash
node --version  # Harus v18 atau lebih tinggi
npm --version   # Harus v9 atau lebih tinggi
```

#### B. Install Go (untuk Backend)

**macOS:**

```bash
# Menggunakan Homebrew
brew install go

# Atau download dari https://go.dev/dl/
```

**Windows:**

```bash
# Download installer dari https://go.dev/dl/
# Jalankan installer dan ikuti petunjuk
```

**Linux (Ubuntu/Debian):**

```bash
# Download dan extract
wget https://go.dev/dl/go1.24.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.24.linux-amd64.tar.gz

# Tambahkan ke PATH (tambahkan ke ~/.bashrc atau ~/.zshrc)
export PATH=$PATH:/usr/local/go/bin
source ~/.bashrc  # atau source ~/.zshrc
```

**Verifikasi instalasi:**

```bash
go version  # Harus go1.20 atau lebih tinggi
```

#### C. Install PostgreSQL (Database)

**macOS:**

```bash
# Menggunakan Homebrew
brew install postgresql@15
brew services start postgresql@15

# Atau download PostgreSQL.app dari https://postgresapp.com/
```

**Windows:**

```bash
# Download installer dari https://www.postgresql.org/download/windows/
# Jalankan installer dan ikuti petunjuk
# Set password untuk user postgres
```

**Linux (Ubuntu/Debian):**

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Verifikasi instalasi:**

```bash
psql --version  # Harus PostgreSQL 12 atau lebih tinggi
```

#### D. Install Git (Version Control)

**macOS:**

```bash
# Biasanya sudah terinstall, jika belum:
brew install git
```

**Windows:**

```bash
# Download dari https://git-scm.com/download/win
# Jalankan installer dan ikuti petunjuk
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install git
```

**Verifikasi instalasi:**

```bash
git --version
```

### 2. Setup Database PostgreSQL

```bash
# Login ke PostgreSQL
# macOS/Linux:
psql postgres

# Windows (Command Prompt as Administrator):
psql -U postgres

# Buat database baru
CREATE DATABASE gdss_db;

# Buat user baru (opsional)
CREATE USER gdss_user WITH PASSWORD 'your_password';

# Berikan akses ke database
GRANT ALL PRIVILEGES ON DATABASE gdss_db TO gdss_user;

# Keluar dari psql
\q
```

### 3. Clone dan Setup Project

#### A. Clone Repository

```bash
# Clone repository
git clone https://github.com/Ghozi-Waridi/project-UAS-Sistem-Informasi.git

# Masuk ke direktori project
cd project-UAS-Sistem-Informasi
```

#### B. Setup Backend (Go)

```bash
# Masuk ke direktori services
cd services

# Download dependencies
go mod download
go mod tidy

# Konfigurasi database
# Edit file internal/config/config.go
# Sesuaikan dengan kredensial database Anda:
# - Host: localhost
# - Port: 5432
# - User: gdss_user (atau postgres)
# - Password: your_password
# - Database: gdss_db
```

**Edit `services/internal/config/config.go`:**

```go
// Sesuaikan bagian ini:
dsn := fmt.Sprintf(
    "host=localhost user=gdss_user password=your_password dbname=gdss_db port=5432 sslmode=disable",
)
```

#### C. Setup Frontend (React)

```bash
# Kembali ke root directory
cd ..

# Masuk ke direktori interfaces
cd interfaces

# Install dependencies
npm install

# Buat file .env
cp .env.example .env

# Atau buat manual file .env dengan isi:
# VITE_API_URL=http://localhost:8080/api
```

**Buat file `interfaces/.env`:**

```env
VITE_API_URL=http://localhost:8080/api
```

### 4. Jalankan Aplikasi

#### Opsi 1: Menggunakan Script Otomatis (Recommended)

```bash
# Kembali ke root directory
cd ..

# Jalankan semua service
./start.sh
```

#### Opsi 2: Manual (Jalankan di Terminal Terpisah)

**Terminal 1 - Backend:**

```bash
cd services
go run cmd/api/main.go
```

**Terminal 2 - Frontend:**

```bash
cd interfaces
npm run dev
```

### 5. Akses Aplikasi

Setelah berhasil dijalankan:

- **Frontend**: Buka browser dan akses http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api

### 6. Login ke Aplikasi

**Default Admin Account:**

```
Username: admin
Password: admin123
```

**Default Decision Maker Account:**

```
Username: dm1
Password: dm123
```

> ⚠️ **Penting**: Ganti password default setelah login pertama kali!

### 7. Troubleshooting Instalasi

#### Problem: Port sudah digunakan

```bash
# Cek proses yang menggunakan port
# macOS/Linux:
lsof -i :8080  # Backend port
lsof -i :5173  # Frontend port

# Windows:
netstat -ano | findstr :8080
netstat -ano | findstr :5173

# Kill proses jika diperlukan
# macOS/Linux:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F
```

#### Problem: Database connection error

```bash
# Pastikan PostgreSQL berjalan
# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Windows:
# Cek di Services (services.msc)

# Restart PostgreSQL jika perlu
# macOS:
brew services restart postgresql@15

# Linux:
sudo systemctl restart postgresql
```

#### Problem: Go modules error

```bash
cd services
go clean -modcache
go mod download
go mod tidy
```

#### Problem: npm install error

```bash
cd interfaces
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### 8. Stop Aplikasi

```bash
# Menggunakan script
./stop.sh

# Atau manual: Tekan Ctrl+C di setiap terminal yang menjalankan service
```

## 🔄 Update Project

```bash
# Pull perubahan terbaru
git pull origin main

# Update backend dependencies
cd services
go mod tidy

# Update frontend dependencies
cd ../interfaces
npm install

# Restart aplikasi
cd ..
./start.sh
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
