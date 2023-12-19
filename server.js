const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql");

const msCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "forcheck",
});

msCon.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  msCon.query(
    "INSERT INTO users (user_name,user_email,user_password) VALUES (?,?,?)",
    [name, email, password],
    (err, resu) => {
      if (err) throw err;
      console.log("Data inserted");
      res.send({ message: "Register success" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  msCon.query(
    "SELECT * FROM users WHERE user_email = ? AND user_password = ?",
    [email, password],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "Invalid email or password" });
      }
    }
  );
});

app.post("/getUserData", (req, res) => {
  const { user_id } = req.body;
  msCon.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/save-note", (req, res) => {
  const { user_id, note_title, note } = req.body;
  msCon.query(
    "INSERT INTO notes (user_id,note_title,note) VALUES (?,?,?)",
    [user_id, note_title, note],
    (err, result) => {
      if (err) throw err;
      res.send({ message: "Note saved successfully" });
    }
  );
});

app.post("/getNotes", (req, res) => {
  const { user_id } = req.body;
  msCon.query(
    "SELECT * FROM notes WHERE user_id = ? ORDER BY noted_date DESC",
    [user_id],
    (err, resu) => {
      if (err) throw err;
      res.send(resu);
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
