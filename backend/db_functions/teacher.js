const get_teachers = async (pool) => {
    const [results] = await pool.query("SELECT * FROM teachers");
    return results;
}

const create_teacher = async (pool,email) => {
    await pool.query('INSERT INTO teachers (email) VALUES (?)',[email]);
}

const delete_teacher = async (pool, email) => {
    await pool.query('DELETE FROM teachers WHERE email=?',[email]);
}

module.exports = {get_teachers,create_teacher,delete_teacher};