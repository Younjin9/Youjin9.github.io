const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root1234',
    database: 'teststudents'
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log('Connected to the database');
});

module.exports = conn;