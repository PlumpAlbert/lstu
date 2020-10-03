const express = require("express");
const dotenv = require("dotenv");
const subjectRouter = require("./api/subject");
const userRouter = require("./api/user");

const configPath =
  process.env.NODE_ENV === "development" ? ".env.local" : ".env";
dotenv.config({path: configPath});

const app = express();

app.use("/api/subject", subjectRouter);
app.use("/api/user", userRouter);
app.use(express.static('./static'))

app.listen(process.env["PORT"], process.env["HOST"] || "localhost", () => {
  console.log(
    `Example app listening at http://${process.env["HOST"]}:${process.env["PORT"]}`
  );
});
