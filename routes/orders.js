const express = require("express");
const router = express.Router();
const pool = require("../db");

router
  .route("/")
  .get((req, res) => {
    pool
      .query("SELECT * FROM orders")
      .then((data) => res.json(data.rows))
      .catch((err) => res.sendStatus(500));
  })
  .post((req, res) => {
    console.log(req.body);
    const { price, date, user_id } = req.body;
    const postOneOrder = {
      text: `INSERT INTO orders (price, date, user_id) 
            VALUES ($1,$2,$3)
            RETURNING *`,
      values: [price, date, user_id],
    };
    pool
      .query(postOneOrder)
      .then((data) => res.status(201).json(data.rows))
      .catch((err) => res.sendStatus(500));
  });
router
  .route("/:id")
  .get((req, res) => {
    const id = req.params.id;
    const getOneOrder = {
      text: "SELECT * FROM orders WHERE id=$1;",
      values: [id],
    };
    pool
      .query(getOneOrder)
      .then((data) => res.json(data.rows))
      .catch((err) => res.sendStatus(500));
  })
  .put((req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    const id = req.params.id;
    const { price, date, user_id } = req.body;
    const updateOneOrder = {
      text: `
    UPDATE orders 
    SET price=$1, date=$2, user_id=$3 
    WHERE id=$4 
    RETURNING *;`,
      values: [price, date, user_id, id],
    };
    pool
      .query(updateOneOrder)
      .then((data) => res.json(data.rows))
      .catch((err) => res.sendStatus(500));
  })
  .delete((req, res) => {
    const id = req.params.id;
    const deleteOneOrder = {
      text: `
    DELETE FROM orders
    WHERE id=$1
    RETURNING *;
    `,
      values: [id],
    };
    pool
      .query(deleteOneOrder)
      .then((data) => {
        if (!data.rows.length) {
          return res.status(404).send("Nothing here");
        }
        return res.status(200).send(data.rows);
      })

      .catch((err) => res.sendStatus(500));
  });

module.exports = router;
