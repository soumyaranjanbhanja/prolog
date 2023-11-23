const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 1400;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sa1$####',
  database: 'Mma1',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const jwtSecretKey = '1234';

app.post('/api/Signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const [selectResults] = await db.promise().query('SELECT * FROM user5 WHERE email = ?', [email]);

    if (selectResults.length > 0) {
      
      return res.status(409).json({ message: 'Email already in use' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    await db.promise().query('INSERT INTO user5 (email, password) VALUES (?, ?)', [email, hashedPassword]);

   
    const token = jwt.sign({ email }, jwtSecretKey, { expiresIn: '20s' });

    res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Error during signup', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

app.post('/api/Login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    
    const [results] = await db.promise().query('SELECT * FROM user5 WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Login failed: User not found' });
    }

    
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Login failed: Invalid password' });
    }

   
    const token = jwt.sign({ email: user.email }, jwtSecretKey, { expiresIn: '20s' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
