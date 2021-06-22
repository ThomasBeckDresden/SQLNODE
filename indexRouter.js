const express = require("express");
const app = express();
const indexRouter = express.Router();
const { Pool } = require("pg");

const pool = new Pool();

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

app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log("listening");
});

app.get("/exercise", (req, res) => {
  res.status(200).send("Hi there");
});

module.exports = indexRouter;
