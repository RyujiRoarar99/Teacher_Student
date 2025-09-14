const express = require("express");
const pool = require("./db/db");
const {DATABASE_ERROR, EMAIL_EMPTY_ERROR, INVALID_EMAIL_ERROR} = require("./constants/constant")
const {create_teacher, delete_teacher, get_teachers} = require("./db_functions/teacher");
const {create_student, delete_student, unsuspend_student, get_students, suspend_student} = require("./db_functions/student");
const {get_teacher_student,register_students, retrieve_students, retrieve_notification} = require("./db_functions/teacher_student");
const { body, query, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

// ============================= TEACHER FUNCTIONS ==================================================
app.get("/teacher",async (req,res) => {
    try {
        const teachers = await get_teachers(pool);
        res.json(teachers);
    } catch(err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.post("/teacher", [body('email')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        await create_teacher(pool,email);
        res.status(201).json({message: "Teacher created successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.delete("/teacher", [body('email')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        await delete_teacher(pool,email);
        res.status(200).json({message: "Teacher deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

// ============================= STUDENT FUNCTIONS ==================================================
app.get("/student", async (req,res) => {
    try {   
        const students = await get_students(pool);
        res.json(students);
    } catch(err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.post("/student", [body('email')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        await create_student(pool,email);
        res.status(201).json({message: "Student created successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.delete("/student", [body('email')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        await delete_student(pool,email);
        res.status(200).json({message: "Student deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.post("/api/suspend", [body('student')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { student } = req.body;
        await suspend_student(pool,student);
        res.status(204).json({message: "Student suspended successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.post("/api/unsuspend", [body('student')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { student } = req.body;
        await unsuspend_student(pool,student);
        res.status(200).json({message: "Student unsuspended successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

// ============================= TEACHER-STUDENT FUNCTIONS ==================================================
app.get('/api/teacherstudent', async (req,res) => {
    try {
        const result = await get_teacher_student(pool);
        res.json({message: result});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.post('/api/register', [body('teacher')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail(), body('students')
    .isArray().withMessage("Requires an Array"), body('students.*')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { teacher, students } = req.body;
        const error = await register_students(pool,teacher,students);
        if (error) {
            res.status(400).json({message: error});
        }
        else {
            res.status(204).json({message: "All Students Registered"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.get('/api/commonstudents',[
    query('teacher').customSanitizer(value => (Array.isArray(value) ? value : [value]))
                    .isArray({ min: 1 }).withMessage("Email field must be not empty"),
    query('teacher.*').notEmpty().withMessage(EMAIL_EMPTY_ERROR) 
                    .isEmail().withMessage(INVALID_EMAIL_ERROR)
                    .normalizeEmail()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const teachers = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher];
        const result = await retrieve_students(pool,teachers);
        const formattedArray = [];
        for (const student of result) {
            formattedArray.push(student.student_email);
        }
        res.json({students: formattedArray});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

app.post('/api/retrievefornotifications',[body('teacher')
    .notEmpty().withMessage(EMAIL_EMPTY_ERROR)
    .isEmail().withMessage(INVALID_EMAIL_ERROR)
    .normalizeEmail()
], async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { teacher, notification } = req.body;
        const result = await retrieve_notification(pool,teacher);
        const notifArray = notification.split(" @");
        for (let i = 1; i < notifArray.length; i++) {
            if (!result.includes(notifArray[i])) {
                result.push(notifArray[i]);
            }
        }
        res.json({recipients: result});
    } catch (err) {
        console.error(err);
        res.status(500).send(DATABASE_ERROR);
    }
})

module.exports = app;