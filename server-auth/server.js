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

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_kampus'
});

// Handle database connection
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ MySQL Connected!');
});

// ENDPOINT REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password harus diisi!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter!' });
    }

    // Hash password
    console.log(`📝 Registrasi user: ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database
    const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Register error:', err.message);
        return res.status(400).json({ error: 'Username sudah digunakan!' });
      }
      console.log('✅ Register berhasil untuk user:', username);
      res.json({ message: 'Registrasi Berhasil!' });
    });
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ENDPOINT LOGIN
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password harus diisi!' });
    }

    console.log(`🔐 Login attempt untuk user: ${username}`);

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('❌ Login query error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        console.log('❌ User tidak ditemukan:', username);
        return res.status(401).json({ error: 'Username tidak ditemukan!' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        console.log('❌ Password salah untuk user:', username);
        return res.status(401).json({ error: 'Password salah!' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      console.log('✅ Login berhasil untuk user:', username);
      res.json({ message: 'Login Sukses', token: token });
    });
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => console.log('🚀 Server Auth berjalan di Port 3000'));