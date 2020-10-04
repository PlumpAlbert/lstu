const Subject = require("../../objects/subject");
const fs = require("fs");
const express = require("express");
const {query} = require("../../database");

const subjectRouter = express.Router();

function wrapPerWeeks(subjects) {
  /** @type {Object.<string, Subject[]>} */
  const week = {};
  for (let i = 0; i < subjects.length; i++) {
    const s = subjects[i];
    if (!week[s.weekDay]) {
      week[s.weekDay] = [];
    }
    week[s.weekDay].push(s);
  }
  Object.keys(week).map(key => {
    if (!week.hasOwnProperty(key)) return;
    week[key] = week[key].sort(function (a, b) {
      return a.time - b.time;
    });
  });
  return week;
}

function errorHandler(res) {
  return function (err) {
    console.error("[!] ERROR: %O", err);
    res.status(502).json({
      error: true,
      message: err
    });
  };
}

/**
 * @param {number} id
 * @param {import('express').Response} res
 */
function getSubjectById(id, res) {
  let queryString = "SELECT * FROM subject WHERE subject_id = $1;";
  let params = [id];
  query(queryString, params)
    .then(body => {
      res.status(200).json(new Subject(body.rows[0]));
    })
    .catch(errorHandler(res));
}

function getAllSubject(res) {
  let queryString = "SELECT * FROM subject;";
  query(queryString, undefined)
    .then(body => {
      const subjects = body.rows.map(row => new Subject(row));
      const week = wrapPerWeeks(subjects);
      res.status(200).json(week);
    })
    .catch(errorHandler(res));
}

function getSubjectsByGroupId(groupId, res) {
  const queryString = fs.readFileSync(__dirname + "/getSubjectsByGroupId.sql", {
    encoding: "utf8"
  });
  const params = [groupId];
  query(queryString, params)
    .then(body => {
      const subjects = body.rows.map(row => new Subject(row));
      const week = wrapPerWeeks(subjects);
      res.status(200).json(week);
    })
    .catch(errorHandler(res));
}

subjectRouter.get("/", function (req, res) {
  const {id, groupId} = req.query;
  if (id) getSubjectById(id, res);
  else if (groupId) getSubjectsByGroupId(groupId, res);
  //else getAllSubject(res);
});

module.exports = subjectRouter;
