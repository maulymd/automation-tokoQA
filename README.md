# 🛒 TokoQA E2E & API Test Automation Framework

![Playwright Tests](https://github.com/maulymd/automation-tokoQA/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-v1.49+-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Contract%20Testing-Zod-3E67B1?logo=zod&logoColor=white)
![Allure Report](https://img.shields.io/badge/Reporting-Allure-FF7800?logo=qameta&logoColor=white)

Test automation suite enterprise-grade untuk platform e-commerce **TokoQA** ([https://playground.aminhamzah.com](https://playground.aminhamzah.com)), mencakup pengujian **End-to-End (UI)**, **API Testing**, **Contract Testing**, **Hybrid Testing**, dan **Network Mocking** menggunakan **Playwright Test** & **TypeScript**.

---

## 📑 Daftar Isi

- [Arsitektur & Desain Framework](#-arsitektur--desain-framework)
- [Struktur Direktori](#-struktur-direktori)
- [Cakupan Skenario Test (23 Tests)](#-cakupan-skenario-test-23-tests)
- [Instalasi & Pengaturan Lingkungan](#-instalasi--pengaturan-lingkungan)
- [Cara Menjalankan Pengujian](#-cara-menjalankan-pengujian)
- [CI/CD Pipeline (GitHub Actions)](#-cicd-pipeline-github-actions)
- [Alasan Keputusan Teknis (Architecture Decisions)](#-alasan-keputusan-teknis-architecture-decisions)
- [Quality Gate Checklist](#-quality-gate-checklist)

---

## 🏛️ Arsitektur & Desain Framework

Framework ini dibangun dengan prinsip reusability, isolasi data, dan keandalan tinggi (zero flaky test):

1. **Page Object Model (POM):**
   - Seluruh halaman dan komponen dimodelkan ke dalam class terpisah (`pages/`).
   - Tidak ada selector CSS mentah atau XPath rapuh di test file; semua interaksi dilakukan melalui action method yang deskriptif.
2. **Accessibility-First Locators:**
   - Memprioritaskan locator bawaan Playwright yang ramah aksesibilitas: `getByRole()`, `getByLabel()`, dan `getByTestId()`.
3. **Custom Fixtures & Dependency Injection:**
   - Menyediakan fixture `loggedInShop` yang mengotomasi login via API dan menginjeksi token JWT langsung ke `localStorage`, menghemat waktu eksekusi tanpa melewati alur UI login berulang kali.
4. **Data-Driven Testing (DDT):**
   - Skenario pengujian negatif login dan validasi form checkout disimpan dalam file JSON eksternal (`data/`).
5. **Contract Testing dengan Zod:**
   - Memvalidasi skema payload response `GET /api/products` terhadap TypeScript interface secara otomatis saat runtime.
6. **Network Mocking:**
   - Mensimulasikan kondisi server error `500 Internal Server Error` menggunakan `page.route()` untuk memvalidasi user experience saat terjadi kegagalan sistem.

---

## 📂 Struktur Direktori

```text
automation-tokoQA/
├── .github/
│   └── workflows/
│       └── playwright.yml             # CI/CD pipeline GitHub Actions
├── .auth/                             # Session storageState (gitignored)
├── data/                              # Test datasets (Data-Driven Testing)
│   ├── checkout-validation.json       # Validasi field form alamat
│   └── login-negative.json            # Dataset login gagal
├── fixtures/                          # Custom test fixtures & setup
│   ├── index.ts                       # Fixture utama (POM + hybrid login)
│   └── auth.fixture.ts                # StorageState generation
├── helpers/
│   ├── api/
│   │   ├── auth.api.ts                # API client: Login & token extraction
│   │   ├── cart.api.ts                # API client: Keranjang & item management
│   │   └── product.api.ts             # API client: Katalog produk
│   └── schemas/
│       └── product.schema.ts          # Zod schema untuk contract testing
├── pages/                             # Page Object Model
│   ├── base.page.ts                   # Abstract base page
│   ├── login.page.ts                  # Halaman Login
│   ├── shop.page.ts                   # Halaman Katalog & Keranjang
│   ├── checkout.page.ts               # Halaman Checkout (3 langkah)
│   ├── admin.page.ts                  # Dashboard Admin
│   └── components/
│       └── navbar.component.ts        # Komponen header & cart badge
├── tests/
│   ├── api/                           # Pengujian API langsung
│   │   ├── auth.spec.ts               # Login API (200, 401, 403)
│   │   ├── cart.spec.ts               # Keranjang API (401, 201, 409 stok)
│   │   └── products-contract.spec.ts  # Contract test API via Zod
│   ├── e2e/                           # Pengujian UI End-to-End
│   │   ├── smoke/
│   │   │   └── checkout.spec.ts       # E2E alur belanja sampai berhasil
│   │   ├── regression/
│   │   │   ├── cart-actions.spec.ts   # Hapus item dari keranjang
│   │   │   ├── checkout-form.spec.ts  # Validasi form checkout (DDT)
│   │   │   ├── login-negative.spec.ts # Login gagal (DDT)
│   │   │   ├── product-filter.spec.ts # Filter & validasi out of stock
│   │   │   └── rbac-admin.spec.ts     # Customer vs Admin role access
│   │   └── mock/
│   │       └── product-error.spec.ts  # Simulasi network 500 error
│   └── hybrid/
│       └── fast-checkout.spec.ts      # Setup via API, checkout via UI
├── .env.example                       # Template konfigurasi environment
├── package.json
├── playwright.config.ts               # Konfigurasi utama Playwright
└── tsconfig.json                      # Path aliases TypeScript
```

---

## 🧪 Cakupan Skenario Test (23 Tests)

|   Level    | Kategori       | File                        | Skenario                                                                                                     | Prioritas |      Tag      |
| :--------: | :------------- | :-------------------------- | :----------------------------------------------------------------------------------------------------------- | :-------: | :-----------: |
|   **UI**   | **Smoke**      | `checkout.spec.ts`          | Belanja end-to-end: filter kategori, tambah 2 produk, 3 langkah checkout, validasi nomor pesanan `TQA-XXXX`  |  **P1**   |   `@smoke`    |
|   **UI**   | **Regression** | `login-negative.spec.ts`    | Login gagal: password salah, akun terkunci, form kosong (4 skenario DDT)                                     |  **P1**   | `@regression` |
|   **UI**   | **Regression** | `product-filter.spec.ts`    | Cari dan filter produk berdasarkan kategori dan keyword pencarian                                            |  **P2**   | `@regression` |
|   **UI**   | **Regression** | `product-filter.spec.ts`    | Produk stok habis (`Tas Laptop`) tombol beli dalam keadaan `disabled`                                        |  **P2**   | `@regression` |
|   **UI**   | **Regression** | `cart-actions.spec.ts`      | Hapus produk dari keranjang, verifikasi keranjang kosong dan checkout disabled                               |  **P2**   | `@regression` |
|   **UI**   | **Regression** | `rbac-admin.spec.ts`        | Role-based access: Customer dilarang membuka `/admin.html` (`Akses ditolak`), Admin berhasil masuk dashboard |  **P2**   | `@regression` |
|   **UI**   | **Regression** | `checkout-form.spec.ts`     | Validasi form alamat: nama, nomor HP, jalan, kota, kode pos kosong (5 skenario DDT)                          |  **P2**   | `@regression` |
|   **UI**   | **Mocking**    | `product-error.spec.ts`     | Simulasi server error `500`: verifikasi error state ramah pengguna dan tombol retry                          |  **P3**   | `@regression` |
|  **API**   | **Smoke**      | `products-contract.spec.ts` | Contract testing skema produk menggunakan validasi runtime Zod                                               |  **P1**   |   `@smoke`    |
|  **API**   | **Smoke**      | `auth.spec.ts`              | Login API mengembalikan token JWT dan objek profil pengguna                                                  |  **P1**   |   `@smoke`    |
|  **API**   | **Regression** | `auth.spec.ts`              | Login gagal mengembalikan response status `401 Unauthorized`                                                 |  **P1**   | `@regression` |
|  **API**   | **Regression** | `auth.spec.ts`              | Login akun terkunci mengembalikan response status `403 Forbidden`                                            |  **P1**   | `@regression` |
|  **API**   | **Regression** | `cart.spec.ts`              | Akses keranjang tanpa token otentikasi ditolak dengan status `401`                                           |  **P2**   | `@regression` |
|  **API**   | **Smoke**      | `cart.spec.ts`              | Tambah item ke keranjang berhasil mengembalikan status `201 Created`                                         |  **P1**   |   `@smoke`    |
|  **API**   | **Regression** | `cart.spec.ts`              | Tambah item melebihi ketersediaan stok mengembalikan status `409 Conflict`                                   |  **P2**   | `@regression` |
| **Hybrid** | **Regression** | `fast-checkout.spec.ts`     | Login dan tambah item via API, bypass UI, langsung checkout di UI                                            |  **P2**   | `@regression` |

---

## 🚀 Instalasi & Pengaturan Lingkungan

### 1. Clone Repositori

```bash
git clone https://github.com/maulymd/automation-tokoQA.git
cd automation-tokoQA
```

### 2. Instal Dependensi

```bash
npm install
npx playwright install --with-deps chromium
```

### 3. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Pastikan file `.env` terisi.

---

## ⚡ Cara Menjalankan Pengujian

```bash
# Menjalankan seluruh test suite (23 tests)
npm test

# Menjalankan test smoke saja (P1)
npm run test:smoke

# Menjalankan test regression
npm run test:regression

# Menjalankan test API saja
npm run test:api

# Menjalankan dengan browser visual (headed mode)
npm run test:headed

# Menjalankan dengan Playwright UI Mode interaktif
npm run test:ui

# Membuka laporan hasil pengujian (Playwright HTML Report)
npm run report

# Menghasilkan dan membuka Allure 3 Report (100% Java-free)
npm run allure:generate
npm run allure:open

# Atau langsung serve Allure Report secara live
npm run allure:serve
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Workflow CI otomatis berjalan pada setiap `push` dan `pull_request` ke branch `main`:

1. Menyiapkan environment Node.js 20 dengan caching npm.
2. Menginstal browser engine Chromium.
3. Menjalankan seluruh suite pengujian dengan kredensial aman dari **GitHub Secrets**.
4. Mengunggah artefak laporan: **Playwright HTML Report** dan **Allure Report** (tersimpan 30 hari).

---

## 💡 Alasan Keputusan Teknis (Architecture Decisions)

- **Mengapa Playwright?**  
  Playwright memiliki built-in auto-waiting, eksekusi paralel super cepat, isolasi browser context per test, serta dukungan network interception dan API testing dalam satu runner tanpa perlu tool tambahan.
- **Mengapa Hybrid Testing?**  
  Mengulang login lewat UI di setiap skenario membuang waktu dan menambah risiko flaky. Dengan mengautentikasi dan menyiapkan data via API lalu menginjeksi token ke browser, eksekusi test menjadi 3-5x lebih cepat dan fokus menguji halaman target.
- **Mengapa Contract Testing dengan Zod?**  
  Perubahan struktur API dari backend sering kali merusak UI secara diam-diam. Validasi skema Zod memastikan kontrak request/response API tetap konsisten sebelum bug mencapai UI.
- **Bebas dari Test Flaky (Zero Flakiness):**  
  Tidak ada penggunaan `sleep()` atau `waitForTimeout()`. Seluruh assertion menggunakan web-first assertions (`toBeVisible()`, `toHaveText()`) yang otomatis melakukan retry hingga kondisi terpenuhi.

---

## ✅ Quality Gate Checklist

- [x] **10 Syarat Proyek Akhir** terpenuhi secara lengkap.
- [x] **12/12 Checklist Review Test** lulus (independent tests, falsifiable, accessibility locators, no plain credentials, non-flaky).
- [x] **100% Pass Rate** pada seluruh 23 test cases.
- [x] Terintegrasi penuh dengan CI/CD GitHub Actions.
