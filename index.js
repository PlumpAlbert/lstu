const express = require("express");
const dotenv = require("dotenv");

dotenv.config({path: ".env.local"});

const app = express();

app.route("/api");

app.listen(process.env["PORT"], process.env["HOST"], () => {
  console.log(
    `Example app listening at http://${process.env["HOST"]}:${process.env["PORT"]}`
  );
});
