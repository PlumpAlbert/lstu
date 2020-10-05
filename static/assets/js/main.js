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

function displaySchedule() {
  $(".app-body.flex-col").empty();
  const schedule = JSON.parse(sessionStorage.getItem("schedule"));
  const weekDay = window.location.hash.slice(1).toLowerCase();
  let dayIndex = dayNameToDayIndex(weekDay);
  if (!schedule[dayIndex]) return;
  schedule[dayIndex].map(subject => {
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

    $(".app-body.flex-col").append(html);
    let elements = $(".app-body.flex-col .subject");
    elements[elements.length - 1].className += " " + className;
  });
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
$(document).ready(function () {
  const today = new Date();
  const dayIndex = today.getDay() - 1;
  const days = $(".app-header__days-wrapper .day");
  days[dayIndex > -1 ? dayIndex : 0].className += " today";
  days.click(function ({target}) {
    const {dataset} = target;
    window.location.assign("#" + dataset["day"]);
  });

  $.ajax({
    url: "/api/subject?groupId=1",
    method: "GET"
  }).done(function (schedule) {
    sessionStorage.setItem("schedule", JSON.stringify(schedule));
    displaySchedule();
  });
});

window.onhashchange = displaySchedule;