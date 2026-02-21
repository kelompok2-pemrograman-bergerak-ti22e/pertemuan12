const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // PENTING: Untuk Enkripsi Password
const jwt = require('jsonwebtoken'); // PENTING: Untuk Token
const app = express();
app.use(cors());
app.use(bodyParser.json());
const SECRET_KEY = "kunci_rahasia_akses"; // Kunci untuk validasi token
// 1. KONEKSI DATABASE
const db = mysql.createConnection({
host: 'localhost', user: 'root', password: '', database: 'db_kampus'
});
// 2. ENDPOINT REGISTER (Mendaftar Akun)
app.post('/api/register', async (req, res) => {
const { username, password } = req.body;
// Enkripsi Password dengan Bcrypt (10 rounds)
const hashedPassword = await bcrypt.hash(password, 10);
// Simpan ke MySQL
const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
db.query(sql, [username, hashedPassword], (err, result) => {
if (err) return res.status(400).json({ error: 'Username sudah digunakan!'
});
res.json({ message: 'Registrasi Berhasil!' });
});
});
// 3. ENDPOINT LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi!' });
  }
  
  // Cari user di Database
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    // Cek error dari database
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Username tidak ditemukan!' });
    }
    
    const user = results[0];
    
    // Cek kecocokan password yang diinput dengan yang di-enkripsi di DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password salah!' });
    }
    
    // Jika Benar, Buat Token JWT (Berlaku 1 jam)
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    res.json({ message: 'Login Sukses', token: token });
  });
});
app.listen(3000, () => console.log('Server Auth Jalan di Port 3000'));