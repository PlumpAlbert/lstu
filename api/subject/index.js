const Subject = require("../../objects/subject");
const express = require("express");
const { query } = require("../../database");

const subjectRouter = express.Router();

subjectRouter.get("/", function (req, res) {
  const { id } = req.params;
  let queryString, params;
  if (!id) {
    queryString = "SELECT * FROM subject;";
    params = undefined
  } else {
    queryString = "SELECT * FROM subject WHERE subject_id = $1;";
    params = [id];
  }
  query(queryString, params).then(body => {
    const subjects = body.rows.map(row => new Subject(row));
    if (subjects.length === 1) {
      res.status(200).json(subjects[0]);
      return;
    }
    res.status(200).json(subjects);
  }).catch(err => {
    console.error("[!] ERROR: %O", err);
    res.status(502).json({
      error: true,
      message: err
    });
  });
});

module.exports = subjectRouter;
