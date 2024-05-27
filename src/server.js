const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Data koneksi
const dataConnection = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "databasename",
};

let conn;

// Fungsi untuk menghubungkan ke database MySQL
const connectToDatabase = () => {
    conn = mysql.createConnection(dataConnection);
    conn.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err.code, err.fatal, err.stack);
            return;
        }
        console.log("Connection successfully established");
    });
};

// Middleware untuk menghubungkan ke database sebelum menangani setiap permintaan
app.use((req, res, next) => {
    if (!conn) {
        connectToDatabase();
    }
    next();
});

// Endpoint untuk melakukan query SELECT
app.get('/query', (req, res) => {
    const sql = "SELECT `name`, `id` FROM `tablename` WHERE id > ? LIMIT 0, 50";
    conn.query(sql, [0], (err, results, fields) => {
        if (err) {
            console.error('Error during query:', err.code);
            return res.status(500).send(err.code);
        }
        res.json(results);
    });
});

// Endpoint untuk melakukan query INSERT
app.post('/queryPost', (req, res) => {
    const post = { id: 1, title: 'Hello MySQL' };
    const sql = 'INSERT INTO posts SET ?';
    conn.query(sql, post, (err, results, fields) => {
        if (err) {
            console.error('Error during query:', err.code);
            return res.status(500).send(err.code);
        }
        res.json(results);
    });
});

// Menutup koneksi database ketika server dimatikan
const closeDatabaseConnection = () => {
    if (conn) {
        conn.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err.stack);
            }
            console.log('Database connection closed');
        });
    }
};

// Menangani proses penghentian server
process.on('SIGINT', () => {
    closeDatabaseConnection();
    process.exit();
});

// Menjalankan server Express
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
