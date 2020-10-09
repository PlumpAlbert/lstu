const oneWeek = 1000 * 60 * 60 * 24 * 7;
const today = new Date();
let currentWeek;
const queryParams = new URLSearchParams(window.location.search);
if (today.getMonth() > 8) {
  const firstClassWeek = new Date(today.getFullYear(), 8, 1);
  const weekType = Math.floor((today - firstClassWeek) / oneWeek) % 2 === 1;
  sessionStorage.setItem("weekType", weekType ? "1" : "0");
  currentWeek = weekType ? "1" : "0";
} else {
  const firstClassWeek = new Date(today.getFullYear() - 1, 8, 1);
  const weekType = ((today - firstClassWeek) / oneWeek) % 2 === 1;
  sessionStorage.setItem("weekType", weekType ? "1" : "0");
  currentWeek = weekType ? "1" : "0";
}
const subjectTemplate = `<div class="subject flex-row">
        <div class="flex-col">
          <div class="subject-header">
            <span class="subject-header__time">#time</span>
            <span class="subject-header__class">#type в #class</span>
          </div>
          <div class="subject-title">#title</div>
          <div class="subject-teacher">#teacher</div>
        </div>
      </div>`;
const emptyBody = `<p class='empty-message'>
  <img src='/assets/images/face.svg' alt="hueta" class='empty-message__icon'/>
  <span class='empty-message__text'>Сегодня нет пар</span>
</p>`;
const noSchedule = `<p class='empty-message'>
  <img src='/assets/images/sad-emoji.png' class='empty-message__icon' />
  <span class='empty-message__text'>Не удалось загрузить расписание</span>
</p>`;

function displaySchedule() {
  const wrapper = $("#subjects-wrapper");
  wrapper.empty();
  const groupId = queryParams.get('group') ? queryParams.get('group') : '1';
  const schedule = JSON.parse(sessionStorage.getItem(`schedule-${groupId}`));
  const weekDay = window.location.hash.slice(1).toLowerCase();
  const dayIndex = dayNameToDayIndex(weekDay);
  if (!schedule) {
    wrapper.append(noSchedule);
    return;
  }
  const weekType = sessionStorage.getItem("weekType");
  if (!schedule[dayIndex]) {
    wrapper.append(emptyBody);
    return;
  }
  const currentDaySchedule = schedule[dayIndex].filter(s => s.weekType === weekType); 
  if (!currentDaySchedule.length) {
    wrapper.append(emptyBody);
    return;
  }
  schedule[dayIndex].map(subject => {
    if (weekType !== subject.weekType) return;
    const time = new Date(Date.parse(subject.time));
    const endTime = new Date(Number(time) + 1.5 * 60 * 60 * 1000);
    let type = undefined,
      className;
    switch (subject.type) {
      case 0: {
        type = "Лекция";
        className = "lecture";
        break;
      }
      case 1: {
        type = "Практика";
        className = "practice";
        break;
      }
      case 2: {
        type = "Лабораторная";
        className = "lab";
        break;
      }
    }

    let html = subjectTemplate
      .replace(
        "#time",
        `${time
          .getHours()
          .toString()
          .padStart(2, "0")}:${time
          .getMinutes()
          .toString()
          .padStart(2, "0")} - ${endTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${endTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      )
      .replace("#type", type)
      .replace("#class", subject.class)
      .replace("#title", subject.title)
      .replace("#teacher", subject.teacher);

    wrapper.append(html);
    let elements = wrapper.children(".subject");
    elements[elements.length - 1].className += " " + className;
  });
}

function updateWeekType() {
  const weekType = sessionStorage.getItem("weekType");
  const weekTitle = $(".app-header__week-container .week-type");
  if (weekType === "1") {
    document.body.classList.add("green");
    weekTitle.html("Зеленая неделя");
    if (currentWeek === "1") weekTitle.addClass("current-week");
    else weekTitle.removeClass("current-week");
  } else {
    document.body.classList.remove("green");
    weekTitle.html("Белая неделя");
    if (currentWeek === "0") weekTitle.addClass("current-week");
    else weekTitle.removeClass("current-week");
  }
  displaySchedule();
}

/**
 * Function that translates day name to a day index
 * @param {string} name
 * @returns {number} Index of the day
 */
function dayNameToDayIndex(name) {
  switch (name) {
    case "monday": {
      return 1;
    }
    case "tuesday": {
      return 2;
    }
    case "wednesday": {
      return 3;
    }
    case "thursday": {
      return 4;
    }
    case "friday": {
      return 5;
    }
    case "saturday": {
      return 6;
    }
    default:
      return 0;
  }
}

/**
 * Function that translates day index into day name
 * @param {number} dayIndex
 * @returns {string} Name of the day
 */
function dayIndexToDayName(dayIndex) {
  switch (dayIndex) {
    case 1: {
      return "monday";
    }
    case 2: {
      return "tuesday";
    }
    case 3: {
      return "wednesday";
    }
    case 4: {
      return "thursday";
    }
    case 5: {
      return "friday";
    }
    case 6: {
      return "saturday";
    }
    default:
      return 0;
  }
}

$(document).ready(function () {
  const locationHash = window.location.hash.slice(1).toLowerCase();
  const groupId = queryParams.get('group') ?  queryParams.get('group') : '1';
  let dayIndex = dayNameToDayIndex(locationHash);
  if (dayIndex === 0) {
    dayIndex = today.getDay();
    window.location.replace("#" + dayIndexToDayName(dayIndex));
  }

  const groupName = $('.app-header__menu-container .app-header__group-name');

  if (groupId !== '1')
    groupName.html('М-АС-20');
  groupName.click(function(e) {
    const {innerHTML} = e.target;
    if (innerHTML === 'ПИ-17') {
      window.location.assign('?group=3' + window.location.hash);
    } else {
      window.location.assign('?group=1' + window.location.hash);
    }
  });

  const days = $(".app-header__days-wrapper .day");
  days[dayIndex > 0 ? dayIndex - 1 : 0].classList.add("today");
  days.click(function ({target}) {
    const {dataset} = target;
    if (!target.className.includes("today")) {
      target.classList.add("today");
      const oldElem = $(`.day[data-day="${window.location.hash.slice(1)}"]`)[0];
      if (oldElem) {
        oldElem.classList.remove("today");
      }
    }
    window.location.replace("#" + dataset["day"]);
  });

  $(".material-icons.week-switch").click(function () {
    const weekType = sessionStorage.getItem("weekType") === "1" ? "0" : "1";
    sessionStorage.setItem("weekType", weekType);
    updateWeekType();
  });

  if (sessionStorage.getItem("schedule")) {
    updateWeekType();
    return;
  }
  $.ajax({
    url: `/api/subject?groupId=${groupId}`,
    method: "GET"
  }).done(function (schedule) {
    sessionStorage.setItem(`schedule-${groupId}`, JSON.stringify(schedule));
    updateWeekType();
  });
});

window.onhashchange = displaySchedule;
