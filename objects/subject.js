class Subject {
  /**
   * @param {import('pg').QueryResultRow} row
   */
  constructor(row) {
    this.id = row.subject_id;
    this.title = row.subject_title;
    this.class = row.subject_class;
    this.type = row.subject_type;
    this.time = row.subject_time;
    this.teacher = row.subject_teacher;
    this.weekDay = row.subject_weekday;
    this.weekType = row.subject_weektype;
  }
}

module.exports = Subject;
