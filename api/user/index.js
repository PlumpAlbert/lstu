const User = require("../../objects/user");
const express = require("express");
const fs = require("fs");
const {query} = require("../../database");

const userRouter = express.Router();

userRouter.get("/", function (req, res) {
  const {id} = req.query;
  if (!id) {
    res.status(405).json({
      error: true,
      message:
        'Method "GET /api/user" is not allowed.\n\
      Perhaps you forgot to specify "id" parameter.'
    });
    return;
  }
  let queryString = fs.readFileSync(__dirname + "/getUser.sql", {
    encoding: "utf8"
  });
  let params = [id];
  query(queryString, params)
    .then(body => {
      if (body.rows.length === 0) {
        res.status(406).json({
          error: true,
          message: "User with `id`=" + id + " not found"
        });
        return;
      }
      const user = new User(body.rows[0]);
      res.status(200).json(user);
    })
    .catch(err => {
      console.error("[!] ERROR: %O", err);
      res.status(502).json({
        error: true,
        message: err
      });
    });
});

userRouter.post("/", function (req, res) {
  const {login, password, groupId} = req.query;
});

module.exports = userRouter;
