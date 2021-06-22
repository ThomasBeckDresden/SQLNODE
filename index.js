require("dotenv").config();
const express = require("express");
const indexRouter = require("./indexRouter.js");
const app = express();
app.use(express.json());
app.use("/", indexRouter);
const port = 3000;
