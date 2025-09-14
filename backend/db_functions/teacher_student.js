const get_teacher_student = async (pool) => {
    const [results] = await pool.query("SELECT * FROM teacher_student");
    return results;
}

const register_students = async (pool,teacher,students) => {
    let toAdd = ""
    for (let i = 0; i<students.length; i++) {
        if (i != 0) {
            toAdd += ",";
        }
        toAdd += "('" + teacher + "','" + students[i] + "')";
    }
    const completeQuery = "INSERT INTO teacher_student (teacher_email,student_email) VALUES " + toAdd;
    await pool.query(completeQuery);
}

const retrieve_students = async (pool,teachers) => {
    let toFind = "";
    let noOfTeacher = teachers.length
    for (let i = 0; i<noOfTeacher; i++) {
        if (i != 0) {
            toFind += " OR";
        }
        toFind += " teacher_email='"+teachers[i]+"'";
    }
    const [results] = await pool.query("SELECT student_email FROM teacher_student WHERE"+toFind + " GROUP BY student_email HAVING COUNT(DISTINCT teacher_email)=" + noOfTeacher);
    return results;
}

const retrieve_notification = async (pool,teacher) => {
    const [results] = await pool.query("SELECT ts.student_email FROM teacher_student ts JOIN students s ON ts.student_email = s.email WHERE s.suspended = 0 AND ts.teacher_email=?",[teacher]);
    const formattedArray = [];
    for (const student of results) {
        formattedArray.push(student.student_email)
    }
    return formattedArray;
}

module.exports = {get_teacher_student, register_students, retrieve_students, retrieve_notification};