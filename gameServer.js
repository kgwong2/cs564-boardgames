// Import modules
const express = require('express');
const path = require('path');
const mysql = require('mysql2');

// Create Express app
const app = express();
const port = 3000;

// Set up connections
let db = mysql.createConnection({
    host: "147.219.74.241",
    port: 3306,
    user: "boardgame",
    password: "uwmadison",
    database: "boardgames"
});

db.query(
  'SELECT * FROM `boardgame` WHERE `id` = 13',
  function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

// db.connect(err => {
//     if (err) throw err;
//     console.log('MySQL Connected...');
// });

app.get('/boardGameInfo', (req, res) => {
    let sql = 'SELECT b.name FROM boardgame b WHERE b.id = 13';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results); // send data as JSON
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});