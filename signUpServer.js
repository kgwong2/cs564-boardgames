
// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

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
    // In a real application, you would validate and process the signup data here
    // For this example, we'll just redirect to the login page
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/game', (req, res) => {
    res.render('game');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});