# KAVA API Contract

> Backend base URL (development): `http://localhost:5000`

---

## Format Response Standar

Semua response dari backend menggunakan format berikut:

**Sukses:**
```json
{
  "status": "success",
  "message": "Pesan sukses",
  "data": { ... }
}
```

**Gagal (Client Error):**
```json
{
  "status": "failed",
  "message": "Pesan error"
}
```

**Error Server:**
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server"
}
```

---

## Authentication

### 1. Register
**`POST /users/register`**

Request:
```json
{
  "name": "Kava",
  "email": "kava@email.com",
  "password": "password123"
}
```

Response `201`:
```json
{
  "status": "success",
  "message": "Registrasi berhasil. Cek email untuk kode verifikasi.",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Kava",
      "email": "kava@email.com"
    }
  }
}
```

Error `409` - email sudah terdaftar:
```json
{
  "status": "failed",
  "message": "Email sudah terdaftar"
}
```

---

### 2. Verifikasi Email
**`POST /users/verify`**

Request:
```json
{
  "email": "kava@email.com",
  "code": "847291"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Email berhasil diverifikasi"
}
```

Error `400` - kode salah:
```json
{
  "status": "failed",
  "message": "Kode verifikasi tidak valid"
}
```

---

### 3. Login
**`POST /authentications/login`**

Request:
```json
{
  "email": "kava@email.com",
  "password": "password123"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

Error `401` - email/password salah:
```json
{
  "status": "failed",
  "message": "Email atau password salah"
}
```

Error `403` - akun belum diverifikasi:
```json
{
  "status": "failed",
  "message": "Akun belum diverifikasi. Cek email kamu."
}
```

---

### 4. Login dengan Google
**`POST /authentications/google`**

Request:
```json
{
  "idToken": "token_dari_google_sdk"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Login dengan Google berhasil",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### 5. Refresh Access Token
**`PUT /authentications/refresh`**

Request:
```json
{
  "refreshToken": "eyJhbGci..."
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Access token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

---

### 6. Logout
**`DELETE /authentications/logout`**

Request:
```json
{
  "refreshToken": "eyJhbGci..."
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

## User

> Semua endpoint di bawah ini membutuhkan header:
> ```
> Authorization: Bearer <accessToken>
> ```

### 7. Get Profil
**`GET /users/me`**

Response `200`:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Kava",
      "email": "kava@email.com",
      "created_at": "2026-04-30T10:00:00.000Z"
    }
  }
}
```

---

### 8. Ganti Password
**`PUT /users/password`**

Request:
```json
{
  "oldPassword": "password123",
  "newPassword": "passwordbaru456"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Password berhasil diperbarui"
}
```

Error `400` - password lama salah:
```json
{
  "status": "failed",
  "message": "Password lama tidak sesuai"
}
```

---

### 9. Hapus Akun
**`DELETE /users/me`**

Response `200`:
```json
{
  "status": "success",
  "message": "Akun berhasil dihapus"
}
```

---

## CV Analysis (Coming Soon)


## HTTP Status Code yang Digunakan

| Code | Arti |
|------|------|
| `200` | Sukses |
| `201` | Sukses membuat data baru |
| `400` | Request tidak valid |
| `401` | Tidak terautentikasi |
| `403` | Terautentikasi tapi tidak diizinkan |
| `404` | Data tidak ditemukan |
| `409` | Konflik (misal: email sudah ada) |
| `500` | Error server |