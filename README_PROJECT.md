
LUCT Faculty Reporting App - Full Version
=========================================

This full version includes:
- React frontend with separate pages for Student, Lecturer, PRL, PL (basic scaffolds)
- Node.js backend with MySQL connection (mysql2)
- JWT authentication for login/register
- Lecturer reporting form, reports list, search, Excel export
- MySQL schema in db/db.sql

Quick Start:
1. Install Node.js and XAMPP (MySQL).
2. Create MySQL database `luct_reporting` and import db/db.sql.
3. Backend:
   cd backend
   npm install
   # create .env file (see backend/.env.example)
   node index.js
4. Frontend:
   cd frontend
   npm install
   npm start
Login at http://localhost:3000 using role-specific pages.

