# 📚 PANDUAN PUSH PROJECT KE GITHUB

## ✅ PREREQUISITE

Pastikan sudah install:
- ✅ Git for Windows (https://git-scm.com/download/win)
- ✅ GitHub Account (https://github.com)

---

## 📝 LANGKAH-LANGKAH LENGKAP

### **STEP 1: Setup Git Configuration (Jika belum)**

Jalankan di PowerShell/CMD sekali saja:

```powershell
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

**Misal:**
```powershell
git config --global user.name "Muhammad Rizki"
git config --global user.email "rizki@email.com"
```

Verifikasi:
```powershell
git config --global --list
```

---

### **STEP 2: Buat Repository di GitHub**

1. Masuk ke: https://github.com/new
2. **Repository name:** `pertemuan12`
3. **Description:** Sistem Login & Register Terenkripsi - Pertemuan 12
4. **Privacy:** Public (so anyone can see)
5. ❌ **JANGAN** pilih "Initialize with README" (kita sudah punya)
6. Klik **"Create repository"**

**Hasil:**
```
https://github.com/username/pertemuan12
```

---

### **STEP 3: Initialize Git di Project**

Masuk ke folder project:

```powershell
cd C:\xampp\htdocs\p12
```

Inisialisasi git repository:

```powershell
git init
```

Output:
```
Initialized empty Git repository in C:\xampp\htdocs\p12\.git\
```

---

### **STEP 4: Add Files**

Stage semua file untuk commit:

```powershell
git add .
```

Verifikasi apa yang akan di-commit:

```powershell
git status
```

Output akan menunjukkan file-file yang staged.

---

### **STEP 5: First Commit**

```powershell
git commit -m "Initial commit - Sistem Login & Register Terenkripsi"
```

Output:
```
[master (root-commit) abc1234] Initial commit - Sistem Login & Register Terenkripsi
 XX files changed, XXXX insertions(+)
```

---

### **STEP 6: Rename Branch ke Main**

```powershell
git branch -M main
```

---

### **STEP 7: Add Remote Repository**

Copy URL dari GitHub (dari Step 2), misal:
```
https://github.com/username/pertemuan12.git
```

Tambahkan sebagai remote:

```powershell
git remote add origin https://github.com/username/pertemuan12.git
```

Ganti `username` dengan username GitHub Anda!

---

### **STEP 8: Push ke GitHub**

```powershell
git push -u origin main
```

**Pertama kali akan minta credential:**
- Di-redirect ke browser untuk login GitHub
- Atau minta Personal Access Token

Gunakan **Personal Access Token** (recommended):

1. Buka: https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Berikan nama: `pertemuan12-push`
4. Pilih scope:
   - ✅ `repo` (full control)
   - ✅ `workflow` (actions)
5. Klik **"Generate token"**
6. **Copy token** (hanya muncul 1 kali!)
7. Paste sebagai password di prompt git

---

## 🔄 VERIFIKASI

Setelah push, buka GitHub dan verifikasi:

```
https://github.com/username/pertemuan12
```

Seharusnya terlihat semua files sudah terupload! ✅

---

## 📦 STRUKTUR YANG AKAN TERUPLOAD

```
pertemuan12/
├── server-auth/
│   ├── server.js                    ✅ Backend Express
│   └── test-api.js                  ✅ Test file
├── client-auth/
│   ├── src/app/
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── guard/
│   │   │   └── auth.guard.ts
│   │   ├── login/
│   │   ├── register/
│   │   └── home/
│   ├── package.json                 ✅ Dependencies
│   └── angular.json
├── package.json                     ✅ Root dependencies
├── README.md                        ✅ Documentation
├── MODUL_PRAKTIKUM.md              ✅ Module docs
├── DATABASE_SETUP.sql              ✅ Database schema
└── GIT_SETUP.sh                    ✅ Git instructions
```

---

## 🔐 KEAMANAN: Jangan Upload Sensitive Data!

### ❌ Jangan Upload:
- `.env` file (credentials)
- `node_modules/` folder
- `.git/credentials`
- API keys

### ✅ Sudah ada `.gitignore`?

Jika belum, buat file `.gitignore`:

```powershell
# Di folder C:\xampp\htdocs\p12, buat file .gitignore
@"
node_modules/
.env
.env.local
.DS_Store
*.log
.git/
dist/
build/
"@ | Out-File -Encoding utf8 .gitignore
```

Kemudian:
```powershell
git add .gitignore
git commit -m "Add .gitignore"
git push
```

---

## 📝 COMMAND SUMMARY

```powershell
# 1. Setup user info (once)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 2. Navigate to project
cd C:\xampp\htdocs\p12

# 3. Initialize repo
git init

# 4. Stage all files
git add .

# 5. First commit
git commit -m "Initial commit"

# 6. Rename to main
git branch -M main

# 7. Add remote (ganti USERNAME)
git remote add origin https://github.com/USERNAME/pertemuan12.git

# 8. Push to GitHub
git push -u origin main
```

---

## ⚠️ TROUBLESHOOTING

### Error: "fatal: not a git repository"
```
✅ Solusi: Jalankan `git init` dulu
```

### Error: "Permission denied" 
```
✅ Solusi: Gunakan Personal Access Token, bukan password
```

### Error: "The remote origin already exists"
```
✅ Solusi: 
git remote remove origin
git remote add origin https://github.com/USERNAME/pertemuan12.git
```

### Sudah push? Update file lalu push lagi:
```powershell
git add .
git commit -m "Update: Deskripsi perubahan"
git push origin main
```

---

## 🎉 SELESAI!

Project sudah terupload ke GitHub! 🚀

Bisa bagikan link: `https://github.com/USERNAME/pertemuan12`

---

**Butuh bantuan? Tanyakan di sini!** 💬
