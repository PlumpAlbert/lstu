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

/**
 * Method for updating week title and background color
 */
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
  const groupId = queryParams.get("group") ? queryParams.get("group") : "1";
  let dayIndex = dayNameToDayIndex(locationHash);
  if (dayIndex === 0) {
    dayIndex = today.getDay();
    window.location.replace("#" + dayIndexToDayName(dayIndex));
  }

  const groupName = $(".app-header__menu-container .app-header__group-name");

  if (groupId !== "1") groupName.html("М-АС-20");
  groupName.click(function (e) {
    const {innerHTML} = e.target;
    if (innerHTML === "ПИ-17") {
      window.location.assign("?group=3" + window.location.hash);
    } else {
      window.location.assign("?group=1" + window.location.hash);
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
    window.schedule = schedule;
    updateWeekType();
    displaySchedule();
  });
});

window.onhashchange = displaySchedule;
