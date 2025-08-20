// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
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

app.get('/topTenGames', async (req, res) => {
    let sql = 'SELECT b.id, b.image, b.name, b.description, AVG(r.rating) AS score FROM boardgame b INNER JOIN review r ON b.id = r.boardGameId GROUP BY b.id ORDER BY score DESC LIMIT 10';

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results); // send data as JSON
    });
});

app.get('/search', (req, res) => {
    res.render('search', { currentUserId: req.session.userId || null });
});

app.get('/searchGames/all/:gameName/:playerCount/:playtime/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, playerCount, playerCount, playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/all/:gameName/:playerCount/:playtime/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, playerCount, playerCount, playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/three/titleCountContr/:gameName/:playerCount/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, playerCount, playerCount, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/three/titleCountContr/:gameName/:playerCount/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, playerCount, playerCount, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/three/titleCountTime/:gameName/:playerCount/:playtime', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [gameName, playerCount, playerCount, playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/three/titleCountTime/:gameName/:playerCount/:playtime', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [gameName, playerCount, playerCount, playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/three/titleTimeContr/:gameName/:playtime/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/three/titleTimeContr/:gameName/:playtime/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/three/countTimeContr/:playerCount/:playtime/:contributor', (req, res) => {
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [playerCount, playerCount, playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/three/countTimeContr/:playerCount/:playtime/:contributor', (req, res) => {
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [playerCount, playerCount, playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/two/titleCount/:gameName/:playerCount', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?`;
    db.query(sql, [gameName, playerCount, playerCount], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/two/titleCount/:gameName/:playerCount', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playerCount = req.params.playerCount;

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                WHERE b.name LIKE ?
                AND b.minplayers <= ?
                AND b.maxplayers >= ?`;
    db.query(sql, [gameName, playerCount, playerCount], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/two/titleContr/:gameName/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/two/titleContr/:gameName/:contributor', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND c.name LIKE ?`;
    db.query(sql, [gameName, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/two/titleTime/:gameName/:playtime', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playtime = req.params.playtime;

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.name LIKE ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [gameName, playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/two/titleTime/:gameName/:playtime', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";
    const playtime = req.params.playtime;

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.name LIKE ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [gameName, playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/two/countContr/:playerCount/:contributor', (req, res) => {
    const playerCount = req.params.playerCount;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?
                AND c.name LIKE ?`;
    db.query(sql, [playerCount, playerCount, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/two/countContr/:playerCount/:contributor', (req, res) => {
    const playerCount = req.params.playerCount;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?
                AND c.name LIKE ?`;
    db.query(sql, [playerCount, playerCount, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/two/countTime/:playerCount/:playtime', (req, res) => {
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [playerCount, playerCount, playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/two/countTime/:playerCount/:playtime', (req, res) => {
    const playerCount = req.params.playerCount;
    const playtime = req.params.playtime;

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?
                AND b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [playerCount, playerCount, playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/two/timeContr/:playtime/:contributor', (req, res) => {
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/two/timeContr/:playtime/:contributor', (req, res) => {
    const playtime = req.params.playtime;
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE b.minplaytime <= ?
                AND b.maxplaytime >= ?
                AND c.name LIKE ?`;
    db.query(sql, [playtime, playtime, contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/gameName/:gameName', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.name LIKE ?`;
    db.query(sql, [gameName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/gameName/:gameName', (req, res) => {
    const gameName = "%" + req.params.gameName + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                WHERE b.name LIKE ?`;
    db.query(sql, [gameName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/playerCount/:playerCount', (req, res) => {
    const playerCount = req.params.playerCount;

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?`;
    db.query(sql, [playerCount, playerCount], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/playerCount/:playerCount', (req, res) => {
    const playerCount = req.params.playerCount;

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                WHERE b.minplayers <= ?
                AND b.maxplayers >= ?`;
    db.query(sql, [playerCount, playerCount], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/contributor/:contributor', (req, res) => {
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE c.name LIKE ?`;
    db.query(sql, [contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/contributor/:contributor', (req, res) => {
    const contrName = "%" + req.params.contributor + "%";

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                INNER JOIN contributed_by cb ON b.id = cb.boardGameId
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE c.name LIKE ?`;
    db.query(sql, [contrName], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchGames/playtime/:playtime', (req, res) => {
    const playtime = req.params.playtime;

    let sql = `SELECT
                    b.id,
                    b.image,
                    b.name,
                    b.description
                FROM boardgame b
                WHERE b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/searchCount/playtime/:playtime', (req, res) => {
    const playtime = req.params.playtime;

    let sql = `SELECT COUNT(*) AS gameCount
                FROM boardgame b
                WHERE b.minplaytime <= ?
                AND b.maxplaytime >= ?`;
    db.query(sql, [playtime, playtime], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.get('/user', (req, res) => {
    const username = req.session?.username;

    const userSql = 'SELECT userId, username FROM user WHERE username = ?'; 
    db.query(userSql, [username], (err, user) => {
        if (err) throw err;

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

app.post('/review/add/:gameId', (req, res) => {
    const { gameId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.session.userId;

    // Use INSERT ... ON DUPLICATE KEY UPDATE
    //Updates existing review if the user already reviewed the game
    const sql = `
        INSERT INTO review (boardgameId, userId, rating, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
    `;

    db.query(sql, [gameId, userId, rating, comment], (err, results) => {
        if (err) {
            console.error('Error adding/updating review:', err);
            return res.status(500).send('Database error');
        }
        res.redirect(`/game/${gameId}`);
    });
});

app.get('/game/:id', (req, res) => {
    const boardgameId = req.params.id;

    const gameSql = "SELECT * FROM boardgame WHERE id = ?";
    const reviewsSql = `
        SELECT r.rating, r.comment, u.username
        FROM review r
        JOIN user u ON r.userId = u.userId
        WHERE r.boardgameId = ?`;

    db.query(gameSql, [boardgameId], (err, gameResults) => {
        if (err) throw err;
        const game = gameResults[0];

        db.query(reviewsSql, [boardgameId], (err, reviewResults) => {
            if (err) throw err;

            res.render('game', {
                gameId: boardgameId,
                game: game,
                reviews: reviewResults,
                currentUserId: req.session.userId || null
            });
        });
    });
});

app.get('/boardGameInfo/:id', async (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT * FROM boardgame b WHERE b.id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json(results); // send data as JSON
    });
});

app.get('/contributedBy/:id', async (req, res) => {
    console.log("reached");
    const id = req.params.id;
    let sql = `SELECT
                    c.name,
                    cb.isDesigner, cb.isArtist
                FROM contributed_by cb
                INNER JOIN creator c ON cb.creatorId = c.creatorId
                WHERE cb.boardGameId = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
