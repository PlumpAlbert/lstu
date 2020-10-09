const {getSubjectsByGroupId} = require('../api/subject');

class Group {
  /**
   * Constructs objects of this class
   * @param {any} row
   * Database row
   * @param {boolean} fetchSchedule
   * If truthy - fetch schedule for this group
   */
  constructor(row) {
    this.id = row.group_id;
    this.name = row.group_name;
    this.schedule = null;
  }

  async updateSchedule() {
    this.schedule = await getSubjectsByGroupId(this.id);
  }
}

module.exports = Group;
