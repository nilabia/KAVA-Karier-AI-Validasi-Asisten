# KAVA API Contract

> Backend base URL (development): `http://localhost:5000`

---

## Standard Response Format

**Success:**
```json
{
  "status": "success",
  "message": "Success message",
  "data": { ... }
}
```

**Client Error:**
```json
{
  "status": "failed",
  "message": "Error message"
}
```

**Server Error:**
```json
{
  "status": "error",
  "message": "Internal server error"
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
  "message": "Registration successful. Please check your email for the verification code.",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Kava",
      "email": "kava@email.com"
    }
  }
}
```

Error `409` - email already registered:
```json
{
  "status": "failed",
  "message": "Email already registered"
}
```

---

### 2. Verify Email
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
  "message": "Email successfully verified"
}
```

Error `400` - invalid code:
```json
{
  "status": "failed",
  "message": "Invalid verification code"
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
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

Error `401` - wrong email/password:
```json
{
  "status": "failed",
  "message": "Invalid email or password"
}
```

Error `403` - account not verified:
```json
{
  "status": "failed",
  "message": "Account not verified. Please check your email."
}
```

---

### 4. Login with Google
**`POST /authentications/google`**

Request:
```json
{
  "idToken": "token_from_google_sdk"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Google login successful",
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
  "message": "Access token successfully refreshed",
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
  "message": "Logout successful"
}
```

---

## User

> All endpoints below require the following header:
> ```
> Authorization: Bearer <accessToken>
> ```

### 7. Get Profile
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
      "has_password": true,
      "created_at": "2026-04-30T10:00:00.000Z"
    }
  }
}
```

---

### 8. Update Password
**`PUT /users/password`**

Request:
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Password successfully updated"
}
```

Error `400` - wrong old password:
```json
{
  "status": "failed",
  "message": "Old password is incorrect"
}
```

### 9. Update Name
**`PUT /users/name`**

Request:
```json
{
  "name": "Nama Baru"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Name successfully updated",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nama Baru",
      "email": "kava@email.com"
    }
  }
}
```

Error `400` - name too short:
```json
{
  "status": "failed",
  "message": "\"name\" length must be at least 2 characters long"
}
```

### 10. Delete Account
**`DELETE /users/me`**

Response `200`:
```json
{
  "status": "success",
  "message": "Account successfully deleted"
}
```

### 11. Set Password (Google User)
**`POST /users/password`**
> Auth: Required (Bearer Token)

Request:
```json
{
  "newPassword": "newpassword456"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Password successfully set"
}
```

Error `400` - password already set:
```json
{
  "status": "failed",
  "message": "Password already set. Use PUT /users/password to update it"
}
```

---

### 12. Forgot Password
**`POST /users/forgot-password`**
> Auth: Not required

Request:
```json
{
  "email": "kava@email.com"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Password reset link sent to your email"
}
```

Error `404` - email not found:
```json
{
  "status": "failed",
  "message": "Email not found"
}
```

Error `400` - Google account:
```json
{
  "status": "failed",
  "message": "This account uses Google login. Please set a password first via the profile page."
}
```

---

### 13. Reset Password
**`POST /users/reset-password`**
> Auth: Not required

Request:
```json
{
  "token": "token_from_email",
  "newPassword": "newpassword456"
}
```

Response `200`:
```json
{
  "status": "success",
  "message": "Password successfully reset"
}
```

Error `400` - invalid/expired token:
```json
{
  "status": "failed",
  "message": "Invalid or expired token"
}
```


---

## How to Use Tokens in FE

1. After login, store `accessToken` and `refreshToken`
2. For every authenticated request, add the header:
   ```
   Authorization: Bearer <accessToken>
   ```
3. If you receive a `401` response, use `PUT /authentications/refresh` to get a new `accessToken`
4. If the refresh token is also expired, redirect the user to the login page

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Successfully created |
| `400` | Invalid request |
| `401` | Unauthenticated |
| `403` | Authenticated but not authorized |
| `404` | Data not found |
| `409` | Conflict (e.g. email already exists) |
| `500` | Server error |
