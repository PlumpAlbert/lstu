const Group = require("../../objects/group");
const express = require("express");
const {query} = require("../../database");

const groupRouter = express.Router();

groupRouter.get('/', function(req, res) {
  const {id} = req.query;
  const queryString = 'SELECT * FROM "group" WHERE group_id = $1;';
  let params = [id];
  query(queryString, params)
    .then(body => {
      const group = new Group(body.rows[0]);
      group.updateSchedule().then(() => {
        res.status(200).json(group);
      });
    }).catch(err => res.status(502).json(err));
});

module.exports = groupRouter;
