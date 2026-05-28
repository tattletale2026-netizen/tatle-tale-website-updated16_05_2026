// Tatle Tale dynamic workshop dates
// Automatically calculates upcoming workshop dates from today's date.

(function () {
  function formatDate(date) {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  function nthWeekday(year, month, weekday, nth) {
    const date = new Date(year, month, 1);
    const offset = (weekday - date.getDay() + 7) % 7;
    date.setDate(1 + offset + (nth - 1) * 7);
    return date;
  }

  function nextNthWeekday(weekday, nth, timeText) {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();

    for (let i = 0; i < 14; i++) {
      const candidate = nthWeekday(year, month, weekday, nth);
      candidate.setHours(23, 59, 59, 999);

      if (candidate >= now) {
        return "Next session: " + formatDate(candidate) + " · " + timeText;
      }

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }

    return "";
  }

  function nextWeeklyDates(weekday, count, timeText) {
    const now = new Date();
    const dates = [];
    const first = new Date(now);
    const daysAhead = (weekday - now.getDay() + 7) % 7;
    first.setDate(now.getDate() + daysAhead);

    for (let i = 0; i < count; i++) {
      const candidate = new Date(first);
      candidate.setDate(first.getDate() + (i * 7));
      dates.push(formatDate(candidate) + " · " + timeText);
    }

    return "Upcoming sessions: " + dates.join(" | ");
  }

  function nextBestSession(options) {
    const now = new Date();
    let best = null;

    options.forEach(function (option) {
      let year = now.getFullYear();
      let month = now.getMonth();

      for (let i = 0; i < 14; i++) {
        const candidate = nthWeekday(year, month, option.weekday, option.nth);
        candidate.setHours(23, 59, 59, 999);

        if (candidate >= now) {
          if (!best || candidate < best.date) {
            best = { date: candidate, time: option.time };
          }
          break;
        }

        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      }
    });

    return best ? "Next session: " + formatDate(best.date) + " · " + best.time : "";
  }

  const rules = {
    "permission-session-date": function () {
      return nextBestSession([
        { weekday: 3, nth: 1, time: "11–12:30pm" },
        { weekday: 3, nth: 3, time: "6:30–8pm" }
      ]);
    },
    "recipe-date": function () {
      return nextNthWeekday(4, 2, "12–2pm");
    },
    "slow-sentence-date": function () {
      return nextNthWeekday(6, 2, "2–4pm");
    },
    "week-look-date": function () {
      return nextNthWeekday(6, 1, "11–12:30pm");
    },
    "belinda-fabric-date": function () {
      return nextWeeklyDates(4, 4, "12–2pm");
    }
  };

  Object.keys(rules).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = rules[id]();
  });
})();
