# MODUL PRAKTIKUM: SISTEM LOGIN & REGISTER TERENKRIPSI

## STUDI KASUS
Membuat aplikasi Authentication dengan teknologi:
- **Backend**: Node.js + Express + MySQL
- **Frontend**: Ionic + Angular
- **Security**: Bcrypt (password hashing) + JWT (token)

---

## PERSIAPAN AWAL

### 1. Jalankan XAMPP
- ✅ Buka XAMPP Control Panel
- ✅ Start **Apache** (port 80)
- ✅ Start **MySQL** (port 3306)

### 2. Buat Database MySQL
```sql
CREATE DATABASE db_kampus;

USE db_kampus;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Struktur Folder Project
```
p12/
├── server-auth/
│   └── server.js (Backend Node.js)
├── client-auth/
│   └── src/app/
│       ├── services/
│       │   └── auth.service.ts
│       ├── guard/
│       │   └── auth.guard.ts
│       └── Halaman login, register, home
├── package.json
└── MODUL_PRAKTIKUM.md (file ini)
```

---

## STEP 1: SETUP BACKEND (Server Authentication)

### 1.1 Inisialisasi Project
```powershell
cd C:\xampp\htdocs\p12
npm init -y
npm install express cors body-parser mysql2 bcrypt jsonwebtoken
```

### 1.2 Buat file `server-auth/server.js`
Fitur:
- **POST /api/register** - Daftar akun baru dengan password terenkripsi
- **POST /api/login** - Login dan generate JWT token
- Port berjalan di **3000**

```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "kunci_rahasia_akses";

// Koneksi Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_kampus'
});

// ENDPOINT REGISTER
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi!' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) return res.status(400).json({ error: 'Username sudah digunakan!' });
    res.json({ message: 'Registrasi Berhasil!' });
  });
});

// ENDPOINT LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi!' });
  }
  
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Username tidak ditemukan!' });
    }
    
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password salah!' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    res.json({ message: 'Login Sukses', token: token });
  });
});

app.listen(3000, () => console.log('Server Auth Jalan di Port 3000'));
```

### 1.3 Jalankan Server
```powershell
cd C:\xampp\htdocs\p12\server-auth
node server.js
```

✅ Output: `Server Auth Jalan di Port 3000`

---

## STEP 2: SETUP FRONTEND (Client Ionic/Angular)

### 2.1 Setup Ionic Project (Jika belum ada)
```powershell
cd C:\xampp\htdocs\p12
ionic start client-auth blank
```

### 2.2 Buat Auth Service
File: `src/app/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  async setToken(token: string) {
    await Preferences.set({ key: 'auth_token', value: token });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return value;
  }

  async isLoggedIn(): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return !!value;
  }

  async logout() {
    await Preferences.remove({ key: 'auth_token' });
  }
}
```

### 2.3 Buat Auth Guard
File: `src/app/guard/auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const isLogged = await this.authService.isLoggedIn();
    
    if (isLogged) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
```

### 2.4 Setup CORS di Backend (jika perlu)
Pastikan di `server.js`:
```javascript
app.use(cors()); // Sudah ada
```

### 2.5 Jalankan Frontend
Terminal baru (jangan tutup server Node.js):
```powershell
cd C:\xampp\htdocs\p12\client-auth
ng serve --port 4200
```

✅ Buka: `http://localhost:4200`

---

## STEP 3: TESTING

### Test Register
1. Buka aplikasi di http://localhost:4200
2. Masukkan username dan password
3. Klik Register
4. Cek di MySQL: Password sudah terenkripsi (bcrypt)

**Verifikasi di MySQL:**
```sql
SELECT username, password_hash FROM users;
```

### Test Login
1. Login dengan username dan password yang sudah didaftar
2. System akan generate JWT token
3. Token disimpan di Capacitor Preferences (local storage)
4. User bisa akses halaman protected

### Test Protected Route
1. Gunakan AuthGuard untuk melindungi halaman
2. Coba akses tanpa login → redirect ke /login
3. Login berhasil → bisa akses halaman

---

## FLOW DIAGRAM

```
┌─────────────┐
│   CLIENT    │
├─────────────┤
│  Register   │───┐
│  Login      │   │ HTTP POST
└─────────────┘   │
                  ▼
            ┌─────────────────┐
            │   SERVER NODE   │
            │  (Port 3000)    │
            └─────────────────┘
                  │
                  ├─► bcrypt.hash() ─► Enkripsi Password
                  ├─► INSERT users  ─► MySQL
                  ├─► jwt.sign()    ─► Token
                  └─► Send Token   ─► Client
                  
            ┌─────────────────┐
            │     MySQL       │
            │   db_kampus     │
            │   (users table) │
            └─────────────────┘
```

---

## KEAMANAN YANG DITERAPKAN

| Aspek | Implementasi | Alasan |
|-------|--------------|--------|
| **Password Hash** | Bcrypt (10 rounds) | Tidak bisa reverse, aman jika DB bocor |
| **Token Auth** | JWT dengan Secret Key | Verifikasi user tanpa query DB setiap kali |
| **Token Expiry** | 1 jam | Membatasi masa berlaku token |
| **CORS** | Enabled | Komunikasi frontend-backend aman |
| **Input Validation** | Check username & password | Cegah request kosong |
| **Protected Routes** | AuthGuard | Cegah akses tanpa login |

---

## PERINTAH PENTING

### Terminal 1: Backend Node.js
```powershell
cd C:\xampp\htdocs\p12\server-auth
node server.js
```

### Terminal 2: Frontend Angular
```powershell
cd C:\xampp\htdocs\p12\client-auth
ng serve --port 4200
```

### MySQL Query untuk Testing
```sql
-- Lihat semua users
SELECT * FROM users;

-- Hapus user tertentu
DELETE FROM users WHERE username = 'testuser';

-- Lihat struktur tabel
DESCRIBE users;
```

---

## TROUBLESHOOTING

### Error: "Cannot find module 'express'"
**Solusi:** `npm install` di folder project

### Error: "Port 3000 already in use"
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Cannot find module '@capacitor/preferences'"
```powershell
cd C:\xampp\htdocs\p12\client-auth
npm install @capacitor/preferences
```

### Error: "MySQL connection failed"
- ✅ Pastikan MySQL sudah started
- ✅ Cek username/password di server.js
- ✅ Database `db_kampus` sudah dibuat

---

## CHECKLIST COMPLETION

- [ ] XAMPP Apache & MySQL running
- [ ] Database `db_kampus` dan tabel `users` created
- [ ] npm packages installed
- [ ] Backend server running di port 3000
- [ ] Frontend running di port 4200
- [ ] Register endpoint working
- [ ] Login endpoint working
- [ ] Password terenkripsi di MySQL
- [ ] JWT token generated
- [ ] Protected routes dengan AuthGuard
- [ ] Logout berfungsi

---

## REFERENSI

- Bcrypt: https://www.npmjs.com/package/bcrypt
- JWT: https://www.npmjs.com/package/jsonwebtoken
- Express: https://expressjs.com/
- Ionic: https://ionicframework.com/
- Angular: https://angular.io/

---

**Selamat! Anda telah membuat Sistem Login & Register Terenkripsi yang lengkap dan aman! 🎉**
