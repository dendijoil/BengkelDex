"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4002;
const router = require("./routes/index");
const handlingError = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use(handlingError);

// module.exports = app
app.listen(port, () => console.log(`This app is listening to port: ${port}`));
