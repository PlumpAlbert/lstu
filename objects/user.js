const Group = require("./group");

class User {
  constructor(row) {
    this.id = row.user_id;
    this.login = row.user_login;
    this.password = row.user_password;
    this.admin = row.user_admin;
    this.group = new Group({ 
      group_id: row.group_id,
      group_name: row.group_name
    });
  }
}

module.exports = User;
