// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');

const db = mysql.createPool({
    host: '147.219.74.241',
    port: 3306,
    database: 'boardgames',
    user: 'boardgame',
    password: 'uwmadison',
    waitForConnections: true,
});

// Create Express app
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'uwmadison', resave: false, saveUninitialized: false}));

// Routes
app.get('/', (req, res) => {
    res.render('main', { currentUserId: req.session.userId || null });
});

app.get('/search', (req, res) => {
    res.render('search', { currentUserId: req.session.userId || null });
});

app.get('/user', (req, res) => {
    const username = req.session?.username;

    const userSql = 'SELECT userId, username FROM user WHERE username = ?'; 
    db.query(userSql, [username], (err, user) => {
        if (err) throw err;
        if (user.length === 0) {
            return res.status(404).send('User not found');
        }

        const reviewsSql =
        `SELECT 
            r.boardgameId, r.rating, r.comment, r.userId,
            b.name, b.image
        FROM review r
        JOIN boardgame b ON r.boardgameId = b.id
        WHERE r.userId = ?`;

        db.query(reviewsSql, [user[0].userId], (err, reviews) => {
            if (err) throw err;

            // Render user profile with reviews
            res.render('user', {
                user: user[0],
                reviews: reviews,
                currentUserId: req.session.userId || null
            });
        });
    });
});

app.get('/signup', (req, res) => {
    res.render('signup', { currentUserId: req.session.userId || null });
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
    res.render('login', { currentUserId: req.session.userId || null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const loginSql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(loginSql, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.userId = results[0].userId;
            req.session.username = results[0].username;
            console.log('User logged in successfully:', results);
            res.redirect(`/user?username=${username}`);
        } else {
            res.render('login', { error: 'Invalid username or password', currentUserId: null});
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
    });
});

app.post('/review/edit/:userId/:boardgameId', (req, res) => {
    const { userId, boardgameId } = req.params;
    const { rating, comment } = req.body;

    const updateSql = 'UPDATE review SET rating = ?, comment = ? WHERE userId = ? AND boardgameId = ?';
    db.query(updateSql, [rating, comment, userId, boardgameId], (err, results) => {
        if (err) throw err;
        res.redirect('/user');
    });
});

app.post('/review/delete/:userId/:boardgameId', (req, res) => {
    const { userId, boardgameId } = req.params;

    const deleteSql = 'DELETE FROM review WHERE userId = ? AND boardgameId = ?';
    db.query(deleteSql, [userId, boardgameId], (err, results) => {
        if (err) throw err;
        res.redirect('/user');
    });
});

app.get('/game', (req, res) => {
    res.render('game', { currentUserId: req.session.userId || null });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
