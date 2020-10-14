/**
 * @typedef ISubject
 * @property {string} title
 * Subject's title
 * @property {string} time
 * Start time of the subject
 * @property {0|1|2} type
 * Subject's type
 * @property {string} class
 * Name of the class where subject take place
 * @property {string} teacher
 * Name of the teacher
 * @property {0 | 1} weekType
 * Type of the week
 */

/**
 * Function that converts `ISubject.type` to className
 * @param {0 | 1 | 2} type
 * @returns {string}
 */
function subjectTypeToClassName(type) {
  switch (type) {
    case 0:
      return "lecture";
    case 1:
      return "practice";
    case 2:
      return "lab";
  }
}

/**
 * Function that converts `ISubject.type` to string representation
 * @param {0 | 1 | 2} type
 * @returns {string}
 */
function subjectTypeToString(type) {
  switch (type) {
    case 0:
      return "Лекция";
    case 1:
      return "Практика";
    case 2:
      return "Лабораторная";
  }
}

/**
 * Represents `date` as time string
 * @param {Date} date
 */
function dateToTimeString(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Function to create DOM element from `subject` object
 * @param {ISubject} subject
 * @returns {HTMLElement}
 */
function createSubject(subject) {
  const startTime = new Date(Date.parse(subject.time));
  const endTime = new Date(Number(startTime) + 1.5 * 60 * 60 * 1000);

  const header = $("<div>", {
    class: "subject-header"
  }).append(
    $("<span>", {
      class: "subject-header__time"
    }).text(`${dateToTimeString(startTime)} - ${dateToTimeString(endTime)}`),
    $("<span>", {
      class: "subject-header__class"
    }).text(`${subjectTypeToString(subject.type)} в ${subject.class}`)
  );
  const title = $("<span>", {
    class: "subject-title"
  }).text(subject.title);
  const teacher = $("<span>", {
    class: "subject-teacher"
  }).text(subject.teacher);

  const element = $("<div>", {
    class: "subject flex-row " + subjectTypeToClassName(subject.type)
  }).append($("<div>", {class: "flex-col"}).append(header, title, teacher));
  return element;
}

/**
 * Function that creates element with image and text
 * @param {string} image Path to the image to use
 * @param {string} text Text to display
 * @returns {HTMLElement}
 */
function createEmptyMessage(image, text) {
  return $("<p>", {class: "empty-message"}).append(
    $("img", {
      class: "empty-message__icon",
      src: image
    }),
    $("<span>", {class: "empty-message__text"}).text(text)
  );
}

/**
 * Function to render schedule for current day
 */
function displaySchedule() {
  const wrapper = $("#subjects-wrapper");
  wrapper.empty();

  const groupId = queryParams.get("group") ? queryParams.get("group") : "1";
  const weekDay = window.location.hash.slice(1).toLowerCase();
  const weekType = sessionStorage.getItem("weekType");
  const dayIndex = dayNameToDayIndex(weekDay);

  if (!schedule) {
    wrapper.append(
      createEmptyMessage(
        "assets/images/sad-emoji.png",
        "Не удалось загрузить расписание"
      )
    );
  } else if (!schedule[dayIndex]) {
    wrapper.append(
      createEmptyMessage("assets/images/face.svg", "Сегодня пар нет")
    );
  }
  const currentDaySchedule = window.schedule[dayIndex].filter(
    s => s.weekType === weekType
  );
  if (currentDaySchedule.length === 0) {
    wrapper.append(
      createEmptyMessage("assets/images/face.svg", "Сегодня пар нет")
    );
  }
  currentDaySchedule.forEach(s => {
    wrapper.append(createSubject(s));
  });
}
