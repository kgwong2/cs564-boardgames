// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '147.219.74.241',
    port: 3306,
    database: 'boardgames',
    user: 'boardgame',
    password: 'uwmadison'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Create Express app
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/user', (req, res) => {
    res.render('user');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const {newUserName, newPassword} = req.body;
    const checkUserSql = 'SELECT * FROM user WHERE username = ?';
    db.query(checkUserSql, [newUserName], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).send('Username already exists');
        }
        // Insert new user into database
        const insertUserSql = 'INSERT INTO user (username, password) VALUES (?, ?)';
        db.query(insertUserSql, [newUserName, newPassword], (err, results) => {
            if (err) throw err;
            console.log('User signed up successfully:', results);
        });
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const loginSql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(loginSql, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            console.log('User logged in successfully:', results);
            res.redirect('/user?username=${username}');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    });
});

app.get('/game', (req, res) => {
    res.render('game');
});

app.get('/boardGameInfo', async (req, res) => {
    // TODO dynamically set id
    let sql = 'SELECT * FROM boardgame b WHERE b.id = 13';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results); // send data as JSON
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
