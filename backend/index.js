require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// --- MySQL connection pool ---
const pool = mysql.createPool({
  host: " https://nancy-kz71.onrender.com",
  port: 3306,
  user: "root",
  password: "Icare@02",
  database: "four",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- JWT Middleware ---
function auth(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (role && decoded.role !== role)
        return res.status(403).json({ error: 'Forbidden' });
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// ======================== AUTH ROUTES ========================

// Register
app.post('/api/register', async (req, res) => {
  const { username, full_name, password, role, stream } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, full_name, password_hash, role, stream) VALUES (?,?,?,?,?)',
      [username, full_name, hash, role || 'student', stream || null]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, stream: user.stream },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role, full_name: user.full_name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== FACULTIES ========================

app.get('/api/faculties', auth(), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faculties');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== COURSES ========================

app.get('/api/courses', auth(), async (req, res) => {
  const { faculty_id, q } = req.query;
  let sql = 'SELECT * FROM courses WHERE 1=1';
  const params = [];

  if (faculty_id) { sql += ' AND faculty_id=?'; params.push(faculty_id); }
  if (req.user.role === 'lecturer') {
    sql += ' AND assigned_lecturer=?';
    params.push(req.user.id);
  } else if (req.user.role === 'prl' || req.user.role === 'student') {
    sql += ' AND stream=?';
    params.push(req.user.stream);
  }
  if (q) { sql += ' AND name LIKE ?'; params.push(`%${q}%`); }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PL adds a course
app.post('/api/courses', auth('pl'), async (req, res) => {
  const { faculty_id, name, code, stream } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO courses (faculty_id, name, code, stream) VALUES (?,?,?,?)',
      [faculty_id, name, code, stream]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PL assigns lecturer
app.put('/api/courses/:id', auth('pl'), async (req, res) => {
  const { lecturer_id } = req.body;
  try {
    await pool.query(
      'UPDATE courses SET assigned_lecturer=? WHERE id=?',
      [lecturer_id, req.params.id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== CLASSES ========================

app.get('/api/classes', auth(), async (req, res) => {
  const { course_id, q } = req.query;
  let sql = 'SELECT * FROM classes WHERE 1=1';
  const params = [];

  if (course_id) { sql += ' AND course_id=?'; params.push(course_id); }
  if (req.user.role === 'lecturer') {
    sql += ' AND course_id IN (SELECT id FROM courses WHERE assigned_lecturer=?)';
    params.push(req.user.id);
  } else if (req.user.role === 'prl' || req.user.role === 'student') {
    sql += ' AND course_id IN (SELECT id FROM courses WHERE stream=?)';
    params.push(req.user.stream);
  }
  if (q) { sql += ' AND name LIKE ?'; params.push(`%${q}%`); }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Lecturer adds a class
app.post('/api/classes', auth('lecturer'), async (req, res) => {
  const { course_id, name, venue, scheduled_time, total_registered } = req.body;
  const [courseRows] = await pool.query(
    'SELECT id FROM courses WHERE id=? AND assigned_lecturer=?',
    [course_id, req.user.id]
  );
  if (courseRows.length === 0)
    return res.status(403).json({ error: 'Forbidden' });

  try {
    const [result] = await pool.query(
      'INSERT INTO classes (course_id, name, venue, scheduled_time, total_registered) VALUES (?,?,?,?,?)',
      [course_id, name, venue || null, scheduled_time || null, total_registered || 0]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== USERS BY ROLE ========================

app.get('/api/users', auth(), async (req, res) => {
  const { role, q } = req.query;
  let sql = 'SELECT id, username, full_name, role, stream FROM users WHERE 1=1';
  const params = [];

  if (role) { sql += ' AND role=?'; params.push(role); }
  if (q) { sql += ' AND full_name LIKE ?'; params.push(`%${q}%`); }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== LECTURE REPORTS ========================

app.post('/api/reports', auth('lecturer'), async (req, res) => {
  const r = req.body;
  try {
    // Convert empty strings to NULL for numeric fields
    const classId = r.class_id || null;
    const courseId = r.course_id || null;

    const [result] = await pool.query(
      `INSERT INTO lectures
      (class_id, course_id, lecturer_id, week_of_reporting, lecture_date, topic_taught, learning_outcomes, recommendations, actual_students_present, venue, scheduled_time)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        classId,
        courseId,
        req.user.id,
        r.week_of_reporting,
        r.lecture_date,
        r.topic_taught,
        r.learning_outcomes,
        r.recommendations,
        r.actual_students_present,
        r.venue,
        r.scheduled_time,
      ]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get reports
app.get('/api/reports', auth(), async (req, res) => {
  const q = req.query.q;
  let sql = `
    SELECT lectures.*, courses.name AS course_name, courses.code AS course_code,
           users.full_name AS lecturer_name, classes.name AS class_name, classes.total_registered, classes.venue, classes.scheduled_time
    FROM lectures
    LEFT JOIN courses ON lectures.course_id=courses.id
    LEFT JOIN classes ON lectures.class_id=classes.id
    LEFT JOIN users ON lectures.lecturer_id=users.id
    WHERE 1=1
  `;
  const params = [];

  if (req.user.role === 'lecturer') {
    sql += ' AND lectures.lecturer_id=?'; params.push(req.user.id);
  } else if (req.user.role === 'prl' || req.user.role === 'student' || req.user.role === 'pl') {
    if (req.user.stream) {
      sql += ' AND courses.stream=?'; params.push(req.user.stream);
    }
  }
  if (q) {
    sql += ' AND (courses.name LIKE ? OR users.full_name LIKE ? OR lectures.topic_taught LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  sql += ' ORDER BY lectures.created_at DESC LIMIT 200';

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== RATINGS ========================

app.post('/api/ratings', auth(), async (req, res) => {
  const { target_id, target_type, rating, comment } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO ratings (user_id, target_id, target_type, rating, comment) VALUES (?,?,?,?,?)',
      [req.user.id, target_id, target_type, rating, comment]
    );

    // Notify lecturer if rated
    if (target_type === 'lecturer') {
      await pool.query(
        'INSERT INTO notifications (user_id, message) VALUES (?,?)',
        [target_id, 'You have been rated by a user.']
      );
    }
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get ratings
app.get('/api/ratings', auth(), async (req, res) => {
  const { target_id, target_type } = req.query;
  let sql = `
    SELECT ratings.*, users.full_name AS user_name
    FROM ratings
    LEFT JOIN users ON ratings.user_id=users.id
    WHERE 1=1
  `;
  const params = [];

  if (req.user.role === 'lecturer' && !target_id) {
    sql += ' AND target_id=? AND target_type=?';
    params.push(req.user.id, 'lecturer');
  } else {
    if (target_id) { sql += ' AND target_id=?'; params.push(target_id); }
    if (target_type) { sql += ' AND target_type=?'; params.push(target_type); }
  }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== NOTIFICATIONS ========================

app.get('/api/notifications', auth(), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== EXPORT REPORTS TO EXCEL ========================

app.get('/api/reports/export', auth(), async (req, res) => {
  const q = req.query.q;
  let sql = `
    SELECT lectures.*, courses.name AS course_name, courses.code AS course_code,
           users.full_name AS lecturer_name, classes.name AS class_name, classes.total_registered, classes.venue, classes.scheduled_time
    FROM lectures
    LEFT JOIN courses ON lectures.course_id=courses.id
    LEFT JOIN classes ON lectures.class_id=classes.id
    LEFT JOIN users ON lectures.lecturer_id=users.id
    WHERE 1=1
  `;
  const params = [];

  if (req.user.role === 'lecturer') {
    sql += ' AND lectures.lecturer_id=?'; params.push(req.user.id);
  } else if (req.user.role === 'prl' || req.user.role === 'student' || req.user.role === 'pl') {
    if (req.user.stream) {
      sql += ' AND courses.stream=?'; params.push(req.user.stream);
    }
  }
  if (q) {
    sql += ' AND (courses.name LIKE ? OR users.full_name LIKE ? OR lectures.topic_taught LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  try {
    const [rows] = await pool.query(sql, params);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reports');

    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      worksheet.addRow(headers);
      rows.forEach(row => worksheet.addRow(headers.map(h => row[h] || '')));
    }

    res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== START SERVER ========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
