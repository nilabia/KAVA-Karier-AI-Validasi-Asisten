# KAVA — Karier AI Validasi Asisten

> Platform analisis CV berbasis AI untuk prediksi karier dan rekomendasi skill gap.

🔗 **Live Demo:** [https://kava.up.railway.app](https://kava-karier-ai-validasi-asisten.vercel.app)  
🔗 **Backend API:** [valiant-victory-production-032b.up.railway.app](https://valiant-victory-production-032b.up.railway.app)

---

## Daftar Isi

- [Tentang KAVA](#tentang-kava)
- [Fitur](#fitur)
- [Arsitektur](#arsitektur)
- [Tech Stack](#tech-stack)
- [Struktur Repositori](#struktur-repositori)
- [Cara Menjalankan Lokal](#cara-menjalankan-lokal)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Tim](#tim)

---

## Tentang KAVA

KAVA (Karier AI Validasi Asisten) adalah aplikasi web yang membantu pengguna menganalisis CV mereka secara otomatis menggunakan kecerdasan buatan. Pengguna cukup mengunggah CV dalam format PDF, dan KAVA akan:

1. Mengekstrak informasi dari CV (skills, pengalaman, pendidikan, sertifikasi)
2. Memprediksi **Top 3 Role** yang paling sesuai dengan profil pengguna
3. Menganalisis **skill gap** antara profil pengguna dan kebutuhan industri
4. Memberikan **saran karier personal** menggunakan Generative AI (Mistral)

---

## Fitur

- Register & login dengan email/password atau Google OAuth
- Verifikasi email via OTP
- Forgot password & reset password via email
- Upload CV (PDF, maks. 5MB) dan analisis otomatis
- Riwayat analisis CV dengan pagination
- Manaemen profil (ubah nama, ubah/set password, hapus akun)
- Tampilan responsif (mobile & desktop)

---

## Arsitektur

```
Pengguna (Browser)
      │
      ▼
Frontend — Vite + React (Railway)
      │  REST API (HTTPS)
      ▼
Backend API — Express.js (Railway)
      │
      ├──► CV Extractor — Flask + PyMuPDF (Railway)
      ├──► AI Model — TensorFlow + Mistral (Hugging Face)
      ├──► Email — Brevo HTTP API (Cloud)
      ├──► Google OAuth — google-auth-library (Cloud)
      └──► Database — PostgreSQL (Supabase)
```

---

## Tech Stack

| Komponen | Teknologi | Platform |
|---|---|---|
| Frontend | React.js + Vite + Tailwind CSS | Railway |
| Backend API | Node.js + Express.js | Railway |
| CV Extractor | Python + Flask + PyMuPDF | Railway |
| AI Model | TensorFlow + Mistral API | Hugging Face |
| Database | PostgreSQL | Supabase |
| Email | Brevo HTTP API | Cloud |
| Auth Google | google-auth-library | Cloud |

---

## Struktur Repositori

```
KAVA-Karier-AI-Validasi-Asisten/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/       # API calls
│   │   ├── hooks/
│   │   └── utils/
│   └── .env.example
│
├── backend/                # Express.js
│   ├── src/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── migrations/         # node-pg-migrate
│   └── .env.example
│
├── cv-extractor/           # Flask + PyMuPDF
│   ├── app.py
│   ├── extractor.py
│   ├── requirements.txt
│   └── Procfile
│
└── README.md
```

---

## Cara Menjalankan Lokal

### Prasyarat

- Node.js v18+
- Python 3.10+
- PostgreSQL
- Git

### 1. Clone repositori

```bash
git clone https://github.com/rielyta/KAVA-Karier-AI-Validasi-Asisten.git
cd KAVA-Karier-AI-Validasi-Asisten
```

### 2. Setup Database

Buat database PostgreSQL lokal:
```sql
CREATE DATABASE kava_db;
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Isi .env sesuai konfigurasi lokal
npm run migrate
npm run start:dev
```

Backend berjalan di `http://localhost:5000`

### 4. Setup CV Extractor

```bash
cd cv-extractor
pip install -r requirements.txt
cp .env.example .env
python app.py
```

CV Extractor berjalan di `http://localhost:5001`

### 5. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Isi .env sesuai konfigurasi lokal
npm run dev
```

Frontend berjalan di `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

```env
HOST=localhost
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kava_db

# JWT
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Email (Brevo HTTP API)
BREVO_API_KEY=your_brevo_api_key
MAIL_FROM=your_email@gmail.com

# Services
CV_EXTRACTOR_URL=http://localhost:5001
AI_MODEL_URL=https://your-hf-space.hf.space
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000
```

### CV Extractor (`cv-extractor/.env`)

```env
HOST=0.0.0.0
PORT=5001
FLASK_DEBUG=false
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/users/register` | Register akun baru |
| POST | `/users/verify` | Verifikasi OTP email |
| POST | `/users/resend-otp` | Kirim ulang OTP |
| POST | `/authentications/login` | Login email/password |
| POST | `/authentications/google` | Login Google OAuth |
| PUT | `/authentications/refresh` | Refresh access token |
| DELETE | `/authentications/logout` | Logout |

### User
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/users/me` | Get profil pengguna |
| PUT | `/users/name` | Update nama |
| PUT | `/users/password` | Update password (butuh password lama) |
| POST | `/users/password` | Set password (untuk akun Google) |
| POST | `/users/forgot-password` | Request link reset password |
| POST | `/users/reset-password` | Reset password via token |
| DELETE | `/users/me` | Hapus akun |

### CV Analysis
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/cv/analyze` | Upload & analisis CV (form-data) |
| GET | `/api/cv/history` | Riwayat analisis CV |
| GET | `/api/cv/history/:id` | Detail analisis CV |
| DELETE | `/api/cv/history/:id` | Hapus riwayat analisis |
| GET | `/api/cv/advice/:id` | Saran karier dari analisis |

> Semua endpoint user & CV analysis membutuhkan header: `Authorization: Bearer <accessToken>`

---

## Tim

**CC26-PSU251 — Coding Camp powered by DBS Foundation 2026**

| Nama | Role |
|---|---|
| Desi Maria Elita Silalahi | Full-Stack (Backend) |
| Nila Bi Idznillah | Full-Stack (Frontend) |
| Clara Angelin Pijoh | AI Engineer |
| Parulian Dwi Reslia Simbolon | AI Engineer |
| Ferarine Chang | Data Scientist |
| [Data Scientist 2] | Data Scientist |

---

> Dibuat untuk Capstone Project Coding Camp DBS Foundation 2026
