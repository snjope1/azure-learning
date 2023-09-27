const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./customers.db');

app.use(cors());

app.use(bodyParser.json());

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, age INTEGER NOT NULL)");
});

app.use(express.static('public'));

app.get('/customers', (req, res) => {
  db.all("SELECT * FROM customers", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/customers', (req, res) => {
  const { name, age } = req.body;
  db.run(`INSERT INTO customers (name, age) VALUES (?, ?)`, [name, age], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID });
  });
});

app.put('/customers/:id', (req, res) => {
  const { name, age } = req.body;
  db.run(`UPDATE customers SET name = ?, age = ? WHERE id = ?`, [name, age, req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ changes: this.changes });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
