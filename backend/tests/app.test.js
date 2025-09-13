const request = require("supertest");
const app = require("../app");
const pool = require("../db/db");

beforeAll(async() => {
    try{
        await pool.query("CREATE TABLE IF NOT EXISTS teachers (email VARCHAR(100) PRIMARY KEY)");
        await pool.query("TRUNCATE teachers");
        await pool.query("CREATE TABLE IF NOT EXISTS students (email VARCHAR(100) PRIMARY KEY,suspended BOOLEAN NOT NULL)");
        await pool.query("TRUNCATE students");
        await pool.query("CREATE TABLE IF NOT EXISTS teacher_student (id INT AUTO_INCREMENT PRIMARY KEY,teacher_email VARCHAR(100),student_email VARCHAR(100),CONSTRAINT ts_email UNIQUE (teacher_email,student_email))");
        await pool.query("TRUNCATE teacher_student");
        await pool.query("INSERT INTO teachers (email) VALUES ('teacherken@gmail.com'), ('teacherjoe@gmail.com')");
        await pool.query("INSERT INTO students (email, suspended) VALUES ('studentjon@gmail.com',FALSE), ('studenthon@gmail.com',FALSE), ('commonstudent1@gmail.com',FALSE)");
        await pool.query("INSERT INTO teacher_student (teacher_email,student_email) VALUES ('teacherken@gmail.com','commonstudent1@gmail.com'),('teacherjoe@gmail.com','commonstudent1@gmail.com')");
    } catch(err) {
        console.error(err);
        throw err;
    }
});

afterAll(async()=> {
    await pool.end();
});

describe("GET /teacher", () => {
  it("Should return teachers from DB", async () => {
    const res = await request(app).get("/teacher");

    expect(res.status).toBe(200);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: "teacherken@gmail.com" }),
        expect.objectContaining({ email: "teacherjoe@gmail.com" }),
      ])
    );
  });
});

describe("GET /student", () => {
  it("Should return students from DB", async () => {
    const res = await request(app).get("/student");

    expect(res.status).toBe(200);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: "studentjon@gmail.com", suspended: 0 }),
        expect.objectContaining({ email: "studenthon@gmail.com", suspended: 0 }),
        expect.objectContaining({ email: "commonstudent1@gmail.com", suspended: 0 }),
      ])
    );
  });
});

describe("GET /api/teacherstudent", () => {
  it("Should return all teacher student relationship from DB", async () => {
    const res = await request(app).get("/api/teacherstudent");

    expect(res.status).toBe(200);

    expect(res.body.message).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: 2, student_email: "commonstudent1@gmail.com", teacher_email: "teacherjoe@gmail.com" }),
            expect.objectContaining({ id: 1, student_email: "commonstudent1@gmail.com", teacher_email: "teacherken@gmail.com" })
        ])
    );
  });
});

describe("POST /api/register", () => {
  it("Should be able to register student to teacher", async () => {
    const body = {teacher:"teacherken@gmail.com", students:["studentjon@gmail.com","studenthon@gmail.com"]}
    const res = await request(app).post("/api/register").send(body);

    expect(res.status).toBe(204);
  });
});

describe("GET /api/commonstudents", () => {
  it("Should be able to get common students (1)", async () => {
    const res = await request(app).get("/api/commonstudents")
                                .query({teacher: ["teacherken@gmail.com"]});

    expect(res.status).toBe(200);
    expect(res.body.students).toEqual(
        expect.arrayContaining([
            "commonstudent1@gmail.com",
            "studentjon@gmail.com",
            "studenthon@gmail.com"
        ])
    );
  });
});

describe("GET /api/commonstudents", () => {
  it("Should be able to get common students (2)", async () => {
    const res = await request(app).get("/api/commonstudents")
                                .query({teacher: ["teacherken@gmail.com","teacherjoe@gmail.com"]});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        students: [
            "commonstudent1@gmail.com",
            ],
        }
    );
  });
});

describe("POST /api/suspend", () => {
  it("Should be able to suspend a selected student", async () => {
    const body = {student:"studentjon@gmail.com"};
    const res = await request(app).post("/api/suspend").send(body);

    expect(res.status).toBe(204);
  });
});

describe("POST /api/retrievefornotifications", () => {
  it("Should be able to receive notifications for tagged student and not suspended students under a teacher", async () => {
    const body = {teacher:"teacherken@gmail.com",notification:"Hello Students! @studentagnes@gmail.com @studentmiche@gmail.com"};
    const res = await request(app).post("/api/retrievefornotifications").send(body);

    expect(res.status).toBe(200);
    expect(res.body.recipients).toEqual(
        expect.arrayContaining([
            "studenthon@gmail.com",
            "commonstudent1@gmail.com",
            "studentagnes@gmail.com",
            "studentmiche@gmail.com"
        ])
    );
  });
});