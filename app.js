const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');


// Create an Express app
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));





// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydatabase',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

// Define a GET route to retrieve the word from the database
app.get('/api/word', (req, res) => {
  connection.query('SELECT word FROM words LIMIT 1', (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }

    const word = results[0].word;
    res.json({ word });
  });
});

// Define routes
app.post('/update', (req, res) => {
  const newWord = req.body.word;

  const query = 'UPDATE words SET word = ?';
  connection.query(query, newWord, (err, result) => {
    if (err) throw err;
    console.log('Word updated successfully');
    res.redirect('/');
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
