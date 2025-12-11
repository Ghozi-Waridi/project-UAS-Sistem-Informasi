# 🌐 GDSS Pro - Group Decision Support System

Sistem Pendukung Keputusan Kelompok yang mengintegrasikan panel Admin dan Decision Maker dalam satu aplikasi web modern.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![Tech Stack](https://img.shields.io/badge/Go-1.24-00ADD8)
![Tech Stack](https://img.shields.io/badge/Supabase-Database-3ECF8E)
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
- **Supabase** - Cloud database (PostgreSQL)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites Check

```bash
./check-prerequisites.sh
```

## 📥 Instalasi Lengkap dari Awal

> 📋 **Panduan ini dibuat untuk memudahkan dosen menjalankan aplikasi dari awal. Setiap langkah dijelaskan secara detail.**

### 1. Instalasi Software yang Diperlukan

#### A. Install Node.js dan NPM (untuk Frontend React)

**Apa itu Node.js dan NPM?**

- **Node.js**: Runtime JavaScript yang memungkinkan menjalankan JavaScript di luar browser
- **NPM**: Package manager untuk menginstall library/dependencies yang dibutuhkan React

**Langkah Instalasi di Windows (Paling Umum):**

1. **Download Node.js:**

   - Buka browser, kunjungi: https://nodejs.org/
   - Klik tombol hijau besar **"Download Node.js (LTS)"**
   - LTS = Long Term Support (versi stabil yang direkomendasikan)
   - File yang didownload: `node-vXX.XX.XX-x64.msi` (sekitar 30-40 MB)

2. **Install Node.js:**

   - Double-click file installer yang sudah didownload
   - Klik **"Next"** di welcome screen
   - **Centang** "I accept the terms in the License Agreement" → Klik **"Next"**
   - Pilih lokasi instalasi (biarkan default: `C:\Program Files\nodejs\`) → Klik **"Next"**
   - Di halaman "Custom Setup", **biarkan semua tercentang** (termasuk "Add to PATH") → Klik **"Next"**
   - Di halaman "Tools for Native Modules", **tidak perlu centang** → Klik **"Next"**
   - Klik **"Install"** dan tunggu proses selesai
   - Klik **"Finish"**

3. **Verifikasi Instalasi:**

   - Buka **Command Prompt** (tekan tombol Windows + R, ketik `cmd`, tekan Enter)
   - Ketik perintah berikut satu per satu:

   ```bash
   node --version
   ```

   Harus muncul versi seperti: `v20.11.0` atau `v18.19.0` (minimal v18)

   ```bash
   npm --version
   ```

   Harus muncul versi seperti: `10.2.4` atau `9.8.1` (minimal v9)

   **Jika muncul error "'node' is not recognized":**

   - Restart Command Prompt atau komputer
   - Jika masih error, Node.js belum masuk ke PATH. Ulangi instalasi dan pastikan opsi "Add to PATH" tercentang

**Langkah Instalasi di macOS:**

```bash
# Opsi 1: Menggunakan Homebrew (jika sudah terinstall)
brew install node

# Opsi 2: Download manual dari https://nodejs.org/
# Pilih file .pkg untuk macOS, double-click dan ikuti wizard instalasi
```

**Verifikasi di macOS/Linux:**

```bash
node --version  # Harus v18 atau lebih tinggi
npm --version   # Harus v9 atau lebih tinggi
```

**Langkah Instalasi di Linux (Ubuntu/Debian):**

```bash
# Buka Terminal dan jalankan:
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node --version
npm --version
```

#### B. Install Go (untuk Backend)

**Apa itu Go?**

- Bahasa pemrograman yang digunakan untuk membuat backend/server aplikasi
- Perlu diinstall agar backend bisa berjalan

**Langkah Instalasi di Windows:**

1. **Download Go:**

   - Buka browser, kunjungi: https://go.dev/dl/
   - Cari bagian "Stable versions"
   - Klik file **"go1.XX.X.windows-amd64.msi"** (pilih versi terbaru)
   - File sekitar 150-200 MB

2. **Install Go:**

   - Double-click file installer `.msi`
   - Klik **"Next"** di welcome screen
   - **Centang** license agreement → Klik **"Next"**
   - Pilih lokasi instalasi (biarkan default: `C:\Program Files\Go`) → Klik **"Next"**
   - Klik **"Install"** dan tunggu selesai
   - Klik **"Finish"**

3. **Verifikasi Instalasi:**

   - Buka **Command Prompt BARU** (penting: harus buka yang baru)
   - Ketik:

   ```bash
   go version
   ```

   Harus muncul: `go version go1.23.X windows/amd64` (minimal go1.20)

   **Jika muncul error "'go' is not recognized":**

   - Tutup dan buka ulang Command Prompt
   - Atau restart komputer

**Langkah Instalasi di macOS:**

```bash
# Opsi 1: Menggunakan Homebrew
brew install go

# Opsi 2: Download manual
# Kunjungi https://go.dev/dl/
# Download file .pkg untuk macOS
# Double-click dan ikuti wizard instalasi
```

**Verifikasi di macOS:**

```bash
go version  # Harus go1.20 atau lebih tinggi
```

**Langkah Instalasi di Linux (Ubuntu/Debian):**

```bash
# Buka Terminal dan jalankan:
wget https://go.dev/dl/go1.23.4.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.23.4.linux-amd64.tar.gz

# Tambahkan Go ke PATH
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Verifikasi
go version
```

#### C. Install Git (Version Control)

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

### 2. Setup Database Supabase (Cloud Database)

**Apa itu Supabase?**

- Database PostgreSQL yang dihost di cloud (online)
- Tidak perlu install PostgreSQL di komputer lokal
- Sudah dikonfigurasi dan siap pakai

**Informasi Koneksi Database:**

> ⚠️ **Untuk Dosen**: Database sudah dikonfigurasi dan berjalan di Supabase. Tidak perlu setup apapun untuk database. Kredensial database sudah ada di kode backend.

**Jika perlu membuat database Supabase baru:**

1. Kunjungi: https://supabase.com/
2. Klik "Start your project" dan daftar (gratis)
3. Buat project baru
4. Copy connection string yang diberikan
5. Paste ke file konfigurasi backend (`services/internal/config/config.go`)

> 💡 **Catatan**: Untuk keperluan menjalankan aplikasi ini, database Supabase sudah dikonfigurasi dan Anda tidak perlu melakukan setup database manual.

### 3. Clone dan Setup Project

#### A. Clone Repository (Download Project)

**Apa itu Clone?**

- Proses download seluruh kode project dari GitHub ke komputer lokal

**Langkah-langkah:**

1. **Buka Command Prompt / Terminal**

   - Windows: Tekan `Windows + R`, ketik `cmd`, tekan Enter
   - macOS: Tekan `Cmd + Space`, ketik `terminal`, tekan Enter
   - Linux: Tekan `Ctrl + Alt + T`

2. **Pindah ke folder tempat Anda ingin menyimpan project**

   ```bash
   # Contoh Windows - pindah ke Desktop:
   cd Desktop

   # Contoh macOS/Linux - pindah ke Desktop:
   cd ~/Desktop

   # Atau buat folder baru terlebih dahulu:
   # Windows:
   mkdir Projects
   cd Projects

   # macOS/Linux:
   mkdir ~/Projects
   cd ~/Projects
   ```

3. **Clone repository**

   ```bash
   git clone https://github.com/Ghozi-Waridi/project-UAS-Sistem-Informasi.git
   ```

   Proses ini akan:

   - Download semua file project (sekitar 50-100 MB)
   - Membuat folder baru bernama `project-UAS-Sistem-Informasi`
   - Tunggu hingga muncul pesan "done" atau "Resolving deltas: 100%"

4. **Masuk ke direktori project**

   ```bash
   cd project-UAS-Sistem-Informasi
   ```

5. **Verifikasi isi folder**

   ```bash
   # Windows:
   dir

   # macOS/Linux:
   ls
   ```

   Anda harus melihat folder: `interfaces`, `services`, dan beberapa file seperti `README.md`, `start.sh`, dll.

#### B. Setup Backend (Go)

**Apa yang dilakukan?**

- Menginstall semua library/package yang dibutuhkan backend
- Mengkonfigurasi koneksi ke database Supabase

**Langkah-langkah:**

1. **Masuk ke direktori services**

   ```bash
   cd services
   ```

2. **Download dependencies (library yang dibutuhkan)**

   ```bash
   go mod download
   ```

   Proses ini akan:

   - Download semua package Go yang dibutuhkan
   - Memakan waktu 1-3 menit tergantung koneksi internet
   - Jika berhasil, tidak ada pesan error

3. **Verify dan cleanup dependencies**

   ```bash
   go mod tidy
   ```

   Perintah ini akan:

   - Memverifikasi semua dependencies
   - Menghapus package yang tidak terpakai
   - Update file `go.mod` dan `go.sum`

**Konfigurasi Database:**

> ⚠️ **Untuk Dosen**: Konfigurasi database Supabase sudah ada di file `services/internal/config/config.go`. Tidak perlu diubah kecuali ada instruksi khusus.

Jika perlu melihat konfigurasi database:

- File: `services/internal/config/config.go`
- Connection string Supabase sudah dikonfigurasi

4. **Kembali ke root directory**
   ```bash
   cd ..
   ```

#### C. Setup Frontend (React + Vite)

**Apa yang dilakukan?**

- Menginstall semua library React dan dependencies frontend
- Mengkonfigurasi koneksi ke backend API

**Langkah-langkah:**

1. **Pastikan Anda di root directory project**

   ```bash
   # Jika masih di folder services, kembali ke root:
   cd ..
   ```

2. **Masuk ke direktori interfaces (folder frontend)**

   ```bash
   cd interfaces
   ```

3. **Install dependencies React (PROSES PALING LAMA)**

   ```bash
   npm install
   ```

   **Apa yang terjadi:**

   - NPM akan download semua library React, Vite, Tailwind CSS, dll.
   - Akan membuat folder `node_modules` (berisi ribuan file library)
   - Proses memakan waktu **5-15 menit** tergantung:
     - Kecepatan internet (download sekitar 200-400 MB)
     - Kecepatan processor komputer
   - Anda akan melihat progress bar dan banyak text di layar
   - **TUNGGU HINGGA SELESAI** sampai muncul kembali command prompt

   **Jika muncul warning (text kuning):**

   - Abaikan saja, itu normal
   - Yang penting tidak ada error (text merah)

   **Jika muncul error:**

   - Coba jalankan ulang: `npm install`
   - Atau hapus folder `node_modules` dulu: `rm -rf node_modules` (macOS/Linux) atau `rmdir /s node_modules` (Windows), lalu `npm install` lagi

4. **Buat file konfigurasi .env**

   **Cara 1 - Otomatis (jika ada file .env.example):**

   ```bash
   # macOS/Linux:
   cp .env.example .env

   # Windows:
   copy .env.example .env
   ```

   **Cara 2 - Manual (jika tidak ada .env.example):**

   - Buka folder `interfaces` di File Explorer / Finder
   - Klik kanan → New → Text Document
   - Beri nama: `.env` (dengan titik di depan, tanpa extension .txt)
   - Buka file `.env` dengan Notepad / Text Editor
   - Ketik isi berikut:

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

   - Save file

5. **Verifikasi instalasi berhasil**

   ```bash
   # Cek apakah folder node_modules ada:
   # Windows:
   dir node_modules

   # macOS/Linux:
   ls node_modules
   ```

   Harus ada banyak folder di dalam `node_modules`

6. **Kembali ke root directory**
   ```bash
   cd ..
   ```

> ✅ **Setup selesai!** Sekarang project siap untuk dijalankan.

### 4. Jalankan Aplikasi

> ⚠️ **Penting**: Backend dan Frontend harus berjalan BERSAMAAN. Keduanya perlu 2 terminal/command prompt terpisah.

#### Opsi 1: Otomatis dengan Script (Untuk macOS/Linux)

```bash
# Di root directory project:
./start.sh
```

**Script ini akan otomatis:**

- Menjalankan backend di background
- Menjalankan frontend
- Kedua service berjalan bersamaan

#### Opsi 2: Manual - Step by Step (RECOMMENDED untuk Windows)

**Langkah A - Jalankan Backend:**

1. **Buka Command Prompt / Terminal PERTAMA**

   - Windows: Tekan `Windows + R`, ketik `cmd`, Enter
   - macOS/Linux: Buka Terminal baru

2. **Navigasi ke folder project dan masuk ke services**

   ```bash
   # Ganti path ini sesuai lokasi project Anda
   cd Desktop/project-UAS-Sistem-Informasi
   cd services
   ```

3. **Jalankan backend**

   ```bash
   go run cmd/api/main.go
   ```

   **Apa yang terjadi:**

   - Backend akan mulai compile dan running
   - Proses compile pertama kali memakan waktu 30-60 detik
   - Jika berhasil, akan muncul pesan seperti:
     ```
     [GIN-debug] Listening and serving HTTP on :8080
     ```
   - **JANGAN TUTUP TERMINAL INI** - biarkan tetap berjalan
   - Jika muncul error, lihat bagian Troubleshooting di bawah

**Langkah B - Jalankan Frontend (Terminal Kedua):**

1. **Buka Command Prompt / Terminal KEDUA (BARU)**

   - Windows: Buka Command Prompt baru lagi
   - macOS/Linux: Buka tab Terminal baru (`Cmd + T`)

2. **Navigasi ke folder interfaces**

   ```bash
   # Ganti path ini sesuai lokasi project Anda
   cd Desktop/project-UAS-Sistem-Informasi
   cd interfaces
   ```

3. **Jalankan frontend**

   ```bash
   npm run dev
   ```

   **Apa yang terjadi:**

   - Vite development server akan mulai
   - Proses memakan waktu 5-10 detik
   - Jika berhasil, akan muncul pesan:

     ```
     VITE v5.x.x ready in xxx ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
     ```

   - **JANGAN TUTUP TERMINAL INI** - biarkan tetap berjalan

4. **Sekarang Anda memiliki 2 terminal/command prompt yang berjalan:**
   - Terminal 1: Backend (port 8080)
   - Terminal 2: Frontend (port 5173)

### 5. Akses Aplikasi di Browser

**Setelah kedua service berjalan:**

1. **Buka Browser** (Chrome, Firefox, Edge, Safari - yang mana saja)

2. **Ketik di address bar:**

   ```
   http://localhost:5173
   ```

   Atau klik link ini jika Anda membaca di browser: [http://localhost:5173](http://localhost:5173)

3. **Halaman login GDSS Pro akan muncul**
   - Jika halaman tidak muncul, pastikan:
     - Frontend masih berjalan di terminal (cek terminal 2)
     - Backend masih berjalan di terminal (cek terminal 1)
     - Tidak ada error di kedua terminal

**URL Penting:**

- **Frontend (Aplikasi Web)**: http://localhost:5173 ← **INI YANG ANDA AKSES**
- **Backend API**: http://localhost:8080 (tidak perlu dibuka di browser)

### 6. Login ke Aplikasi

**Akun Admin Default:**

```
Username: admin
Password: admin123
```

**Fungsi Admin:**

- Mengelola proyek keputusan
- Menambah/edit kandidat
- Mengelola kriteria
- Menambah decision maker
- Melihat hasil akhir dan konsensus

---

**Akun Decision Maker Default:**

```
Username: dm1
Password: dm123
```

**Fungsi Decision Maker:**

- Memberikan penilaian terhadap kandidat
- Input bobot kriteria (AHP/Direct Weight)
- Melihat hasil seleksi
- Melihat detail konsensus

> 💡 **Cara Login:**
>
> 1. Pilih role (Admin atau Decision Maker)
> 2. Masukkan username dan password
> 3. Klik tombol Login
> 4. Anda akan diarahkan ke dashboard sesuai role

> ⚠️ **Catatan**: Untuk keperluan demo/presentasi, gunakan akun default di atas.

### 7. Troubleshooting (Pemecahan Masalah)

#### ❌ Problem: "Port 8080 sudah digunakan" (Backend)

**Penyebab:**

- Ada aplikasi lain yang menggunakan port 8080
- Backend masih berjalan dari sesi sebelumnya

**Solusi Windows:**

```bash
# Cari proses yang menggunakan port 8080:
netstat -ano | findstr :8080

# Akan muncul seperti:
# TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345
# Angka terakhir (12345) adalah PID

# Kill proses dengan PID tersebut:
taskkill /PID 12345 /F
```

**Solusi macOS/Linux:**

```bash
# Cari proses:
lsof -i :8080

# Kill proses:
kill -9 <PID>
```

---

#### ❌ Problem: "Port 5173 sudah digunakan" (Frontend)

**Solusi sama seperti di atas, ganti 8080 dengan 5173**

---

#### ❌ Problem: "go: command not found" atau "npm: command not found~"

**Penyebab:**

- Go/Node.js belum terinstall
- Belum masuk ke PATH environment

**Solusi:**

1. Verifikasi instalasi:

   ```bash
   go version
   node --version
   npm --version
   ```

2. Jika command not found:
   - **Restart Command Prompt/Terminal**
   - **Restart Komputer**
   - Jika masih error, **install ulang** Go/Node.js dan pastikan centang "Add to PATH"

---

#### ❌ Problem: npm install gagal atau error

**Solusi 1 - Clear cache dan install ulang:**

```bash
cd interfaces

# Hapus node_modules dan cache
# Windows:
rmdir /s /q node_modules
del package-lock.json

# macOS/Linux:
rm -rf node_modules
rm package-lock.json

# Clear npm cache
npm cache clean --force

# Install ulang
npm install
```

**Solusi 2 - Update npm:**

```bash
npm install -g npm@latest
```

---

#### ❌ Problem: Backend error "database connection failed"

**Penyebab:**

- Koneksi internet bermasalah (Supabase adalah cloud database)
- Kredensial database salah
- Database Supabase belum dikonfigurasi

**Solusi:**

1. Cek koneksi internet
2. Pastikan kredensial database di `services/internal/config/config.go` benar
3. Hubungi pembuat project untuk kredensial database yang valid

---

#### ❌ Problem: Halaman putih / blank di browser

**Solusi:**

1. Buka Developer Console browser:
   - Tekan `F12` atau `Ctrl+Shift+I` (Windows/Linux)
   - Atau `Cmd+Option+I` (macOS)
2. Lihat tab "Console" - cari pesan error berwarna merah
3. Biasanya masalah:
   - Backend tidak berjalan (cek terminal 1)
   - URL API salah di file `.env`
   - CORS error (hubungi pembuat project)

---

#### ❌ Problem: Go build/compile error

**Solusi:**

```bash
cd services

# Clear module cache
go clean -modcache

# Download ulang dependencies
go mod download
go mod tidy

# Coba jalankan lagi
go run cmd/api/main.go
```

---

#### ❌ Problem: "Cannot find module" di React

**Solusi:**

```bash
cd interfaces
npm install
```

Jika masih error:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 8. Stop / Matikan Aplikasi

**Cara 1 - Manual (RECOMMENDED):**

1. **Stop Frontend:**

   - Klik di terminal yang menjalankan frontend (terminal 2)
   - Tekan `Ctrl + C` (Windows/Linux) atau `Cmd + C` (macOS)
   - Ketik `Y` jika diminta konfirmasi
   - Terminal akan berhenti dan kembali ke command prompt

2. **Stop Backend:**

   - Klik di terminal yang menjalankan backend (terminal 1)
   - Tekan `Ctrl + C` (Windows/Linux) atau `Cmd + C` (macOS)
   - Backend akan berhenti

3. **Kedua terminal sekarang tidak menjalankan aplikasi lagi**

**Cara 2 - Otomatis (macOS/Linux):**

```bash
./stop.sh
```

**Cara 3 - Tutup terminal:**

- Cukup tutup kedua window terminal/command prompt
- Aplikasi akan otomatis berhenti

> ⚠️ **Penting**: Setiap kali ingin menjalankan aplikasi lagi, ulangi langkah di bagian "4. Jalankan Aplikasi"

## 🔄 Update Project

```bash
# Pull perubahan terbaru dari GitHub
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
