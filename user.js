// Import required modules
const express = require('express');
const app = express();
const port = 3000;

// Route to serve the HTML content
app.get('/', (req, res) => {
    // Set the response content type to HTML
    res.contentType('text/html');

    // Send the HTML response
    res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <h1>User Name</h1><br>
    <h2>Reviews by User</h2>
</body>
</html>
    `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});