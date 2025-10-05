CREATE DATABASE IF NOT EXISTS three;
USE three;
-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student','lecturer','prl','pl','admin') NOT NULL,
    stream VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- FACULTIES TABLE
CREATE TABLE IF NOT EXISTS faculties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL
);

-- COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    stream VARCHAR(100),
    assigned_lecturer INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_lecturer) REFERENCES users(id) ON DELETE SET NULL
);

-- CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_registered INT DEFAULT 0,
    venue VARCHAR(255),
    scheduled_time VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- LECTURES TABLE
CREATE TABLE IF NOT EXISTS lectures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    course_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    week_of_reporting INT NOT NULL,
    lecture_date DATE NOT NULL,
    topic_taught TEXT,
    learning_outcomes TEXT,
    recommendations TEXT,
    actual_students_present INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- RATINGS TABLE
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_id INT NOT NULL,
    target_type ENUM('course','class','lecturer','lecture') NOT NULL,
    rating INT,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO faculties (name, code) VALUES ('Engineering', 'ENG');
INSERT INTO faculties (name, code) VALUES ('Science', 'SCI');


INSERT INTO courses (faculty_id, name, code, stream) VALUES (1, 'Computer Science', 'CS101', 'IT');

