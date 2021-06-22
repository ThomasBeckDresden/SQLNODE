const express = require("express");
const app = express();
app.use(express.json());
const indexRouter = express.Router();

const { Pool } = require("pg");
const pool = new Pool();

app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log("listening");
});

app.get("/exercise", (req, res) => {
  res.status(200).send("Hi there");
});

app.get("/time", (req, res) => {
  // pool.query("SELECT NOW()", (err, data) => {
  //   if (err) {
  //     return res.sendStatus(500);
  //   }
  //   res.send(data.rows[0].now);
  // });
  pool
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch((err) => res.sendStatus(500));
});

app.get("/", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const getOneUser = {
    text: "SELECT * FROM users WHERE id=$1;",
    values: [id],
  };
  pool
    .query(getOneUser)
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.post("/", (req, res) => {
  console.log(req.body);
  const { first_name, last_name, age } = req.body;
  const postOneUser = {
    text: "INSERT INTO users (first_name, last_name, age) VALUES ($1,$2,$3);",
    values: [first_name, last_name, age],
  };
  pool
    .query(postOneUser)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(500));
});

app.put("/:id", (req, res) => {
  const id = req.params.id;
});

app.delete("/:id", (req, res) => {});
module.exports = indexRouter;
