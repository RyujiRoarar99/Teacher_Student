const get_students = async (pool) => {
    const [results] = await pool.query("SELECT * FROM students");
    return results;
}

const create_student = async (pool, email) => {
    await pool.query('INSERT INTO students (email,suspended) VALUES (?,?)',[email,false]);
}

const delete_student = async (pool,email) => {
    await pool.query('DELETE FROM students WHERE email=?',[email]);
}

const suspend_student = async (pool,email) => {
    await pool.query('UPDATE students SET suspended=? WHERE email=?',[true,email]);
}

const unsuspend_student = async (pool,email) => {
    await pool.query('UPDATE students SET suspended=? WHERE email=?',[false,email]);
}

module.exports = {get_students, create_student, delete_student, suspend_student, unsuspend_student};