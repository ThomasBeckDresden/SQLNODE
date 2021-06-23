const express = require("express");
const router = express.Router();
const pool = require("../db");

router
  .route("/")
  .get((req, res) => {
    pool
      .query("SELECT * FROM users")
      .then((data) => res.json(data.rows))
      .catch((err) => res.sendStatus(500));
  })
  .post((req, res) => {
    console.log(req.body);
    const { first_name, last_name, age } = req.body;
    const postOneUser = {
      text: `INSERT INTO users (first_name, last_name, age) 
            VALUES ($1,$2,$3)
            RETURNING *`,
      values: [first_name, last_name, age],
    };
    pool
      .query(postOneUser)
      .then((data) => res.status(201).json(data.rows))
      .catch((err) => res.sendStatus(500));
  });
router
  .route("/:id")
  .get((req, res) => {
    const id = req.params.id;
    const getOneUser = {
      text: "SELECT * FROM users WHERE id=$1;",
      values: [id],
    };
    pool
      .query(getOneUser)
      .then((data) => res.json(data.rows))
      .catch((err) => res.sendStatus(500));
  })
  .put((req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    const id = req.params.id;
    const { first_name, last_name, age } = req.body;
    const updateOneUser = {
      text: `
    UPDATE users 
    SET first_name=$1, last_name=$2, age=$3 
    WHERE id=$4 
    RETURNING *;`,
      values: [first_name, last_name, age, id],
    };
    pool
      .query(updateOneUser)
      .then((data) => res.json(data.rows))
      .catch((err) => res.sendStatus(500));
  })
  .delete((req, res) => {
    const id = req.params.id;
    const deleteOneUser = {
      text: `
    DELETE FROM users
    WHERE id=$1
    RETURNING *;
    `,
      values: [id],
    };
    pool
      .query(deleteOneUser)
      .then((data) => {
        if (!data.rows.length) {
          return res.status(404).send("Nothing here");
        }
        return res.status(200).send(data.rows);
      })

      .catch((err) => res.sendStatus(500));
  });

module.exports = router;
