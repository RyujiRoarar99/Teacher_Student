CREATE DATABASE IF NOT EXISTS school;
CREATE DATABASE IF NOT EXISTS test;

USE school;

CREATE TABLE teachers (
  email VARCHAR(100) PRIMARY KEY
);

CREATE TABLE students (
  email VARCHAR(100) PRIMARY KEY,
  suspended BOOLEAN NOT NULL
);

CREATE TABLE teacher_student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_email VARCHAR(100),
    student_email VARCHAR(100),
    CONSTRAINT ts_email UNIQUE (teacher_email,student_email)
);

INSERT INTO teachers (email) VALUES ('teacherken@gmail.com'), ('teacherjoe@gmail.com');
INSERT INTO students (email, suspended) VALUES ('studentjon@gmail.com',FALSE), ('studenthon@gmail.com',FALSE);