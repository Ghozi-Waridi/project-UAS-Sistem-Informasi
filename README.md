# Project SI (Sistem Informasi)

Proyek Flutter dengan arsitektur terorganisir menggunakan GetX state management dan backend service dalam Rust.

## 📁 Struktur Folder

### Root Directory

```
project_si/
├── lib/                    # Kode sumber utama Flutter
├── services/              # Backend service dalam Rust
├── web/                   # Konfigurasi web Flutter
├── test/                  # File testing Flutter
├── target/                # Build artifacts Rust
├── analysis_options.yaml  # Konfigurasi linter Dart
├── generate.dart          # Script generator feature
├── pubspec.yaml           # Dependencies Flutter
├── pubspec.lock           # Lock file dependencies
└── README.md              # Dokumentasi proyek
```

### 📱 Flutter App Structure (`lib/`)

#### `lib/app/` - Application Layer

Folder ini berisi logika aplikasi utama yang terorganisir berdasarkan fitur-fitur.

- **`bindings/`** - Dependency injection bindings untuk GetX

  - Mengatur inisialisasi controller dan dependencies
  - Menghubungkan controller dengan view

- **`features/`** - Feature-based modules
  - Setiap fitur memiliki struktur MVC (Model-View-Controller)
  - Menggunakan script `generate.dart` untuk membuat feature baru
  - Struktur per feature:
    ```
    features/feature_name/
    ├── controllers/     # Business logic dan state management
    ├── views/          # UI components dan screens
    └── models/         # Data models dan entities
    ```

#### `lib/core/` - Core Layer

Folder ini berisi komponen-komponen inti yang digunakan di seluruh aplikasi.

- **`config/`** - Konfigurasi aplikasi

  - Environment variables
  - API endpoints
  - App constants

- **`theme/`** - Tema dan styling

  - Color schemes
  - Text styles
  - Component themes

- **`utils/`** - Utility functions
  - Helper functions
  - Extensions
  - Common utilities

#### `lib/main.dart` - Entry Point

File utama aplikasi Flutter yang menjalankan aplikasi.

### 🦀 Backend Services (`services/`)

Folder ini berisi backend service yang dibangun menggunakan Rust dengan framework Axum.

- **`src/`** - Source code Rust

  - `main.rs` - Entry point backend service
  - API endpoints dan business logic

- **`Cargo.toml`** - Dependencies Rust

  - axum: Web framework
  - tokio: Async runtime

- **`Cargo.lock`** - Lock file dependencies Rust
- **`target/`** - Build artifacts dan compiled binaries

### 🌐 Web Configuration (`web/`)

Konfigurasi untuk Flutter web deployment.

- **`index.html`** - HTML entry point untuk web
- **`manifest.json`** - Web app manifest
- **`icons/`** - Web app icons dalam berbagai ukuran
- **`favicon.png`** - Favicon untuk web browser

### 🧪 Testing (`test/`)

- **`widget_test.dart`** - Unit tests untuk Flutter widgets

### 🛠️ Development Tools

- **`generate.dart`** - Script generator untuk membuat feature baru

  - Membuat struktur folder MVC otomatis
  - Generate boilerplate code untuk controller, view, dan model
  - Usage: `dart run generate.dart feature_name`

- **`analysis_options.yaml`** - Konfigurasi linter Dart
  - Mengatur aturan coding style
  - Static analysis rules

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (^3.9.0)
- Dart SDK
- Rust (untuk backend services)
- Cargo (Rust package manager)

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/Ghozi-Waridi/project-UAS-Sistem-Informasi.git
   cd project_si
   ```

2. **Install Flutter dependencies**

   ```bash
   flutter pub get
   ```

3. **Install Rust dependencies**
   ```bash
   cd services
   cargo build
   ```

### Development

1. **Menjalankan Flutter app**

   ```bash
   flutter run
   ```

2. **Menjalankan backend service**

   ```bash
   cd services
   cargo run
   ```

3. **Membuat feature baru**
   ```bash
   dart run generate.dart nama_feature
   ```

## 📚 Dependencies

### Flutter Dependencies

- `get: ^4.7.2` - State management dan routing
- `cupertino_icons: ^1.0.8` - iOS style icons

### Rust Dependencies

- `axum: 0.7` - Web framework
- `tokio: 1` - Async runtime

## 🏗️ Architecture

Proyek ini menggunakan:

- **Clean Architecture** dengan separation of concerns
- **GetX** untuk state management dan dependency injection
- **Feature-based structure** untuk modularity
- **Rust backend** untuk performa tinggi
- **MVC pattern** dalam setiap feature

## 📖 Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [GetX Documentation](https://github.com/jonataslaw/getx)
- [Axum Documentation](https://docs.rs/axum/)
- [Rust Documentation](https://doc.rust-lang.org/)
