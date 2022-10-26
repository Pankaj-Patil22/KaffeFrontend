console.log("You have connected...");

yourGlobalVariable = [];

tablePrices = {};

tableSessions = {};

async function getTablePrices() {
  await fetch("http://127.0.0.1:5000/tables/price")
    .then((Response) => Response.json())
    .then((data) => {
      console.log(data.prices);
      localStorage.setItem("tablePrices", JSON.stringify(data.prices));
      tablePrices = data.prices;
    });
  console.log(tablePrices);
}

async function getTableSessions() {
  await fetch("http://127.0.0.1:5000/getTableSessions")
    .then((Response) => Response.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("tableSessions", JSON.stringify(data));
      tableSessions = data;
    });
  console.log(tableSessions);
}

function updateTable(date, timeslot) {
  // considering date is given in format yyyy-mm-dd
  dateArr = date.split("-");
  url =
    "http://127.0.0.1:5000/tables/" +
    dateArr[0] +
    "/" +
    dateArr[1] +
    "/" +
    dateArr[2] +
    "/" +
    timeslot;
  console.log("fetching url", url);
  fetch(url)
    .then((Response) => Response.json())
    .then((data) => {
      console.log("inside date change", data);
      Object.entries(data.table_reservation).forEach(([key, value]) => {
        if (value == 1) {
          document.querySelector("." + key).removeAttribute("disabled", "");
          // console.log("inside date change remove disabled", key);
        } else if (value == 0) {
          document.querySelector("." + key).setAttribute("disabled", "");
          // console.log("inside date change set disabled", key);
        }
      });
    });
}

function getCurrentHour() {
  var today = new Date();
  return today.getHours();
}

function getDateInFormat() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
}

function handleChange(checkbox) {
  totalPrice = 0;
  if (checkbox.checked == true) {
    yourGlobalVariable.push(checkbox.id);
  } else {
    yourGlobalVariable = yourGlobalVariable.filter(
      (item) => item !== checkbox.id
    );
  }
  if (yourGlobalVariable.length != 0) {
    console.log(yourGlobalVariable, "this is the data generation");
    localStorage.setItem("choosentables", JSON.stringify(yourGlobalVariable));
    yourGlobalVariable.forEach((element) => {
      totalPrice += tablePrices[element - 1];
      document.getElementById("totalPriceInfo").innerText =
        "Total Amount: " + totalPrice;
      localStorage.setItem("totalPriceOfTable", totalPrice);
    });
    document.getElementById("tableInfo").innerText =
      "Table No. Selected: " + yourGlobalVariable;
    document.getElementById("tableSubmit").removeAttribute("disabled", "");
  } else {
    document.getElementById("tableInfo").innerText = "No tables selected!";
    document.getElementById("totalPriceInfo").innerText = "";
    document.getElementById("tableSubmit").setAttribute("disabled", "");
  }
}

function getAvailableTimmings() {
  today = getDateInFormat();
  hour = getCurrentHour();
  const notes = document.querySelectorAll(".time");

  if (document.getElementById("datefield").value == today) {
    notes.forEach((note) => {
      if (hour < note.classList[1]) {
        document
          .getElementById("time-" + note.classList[1])
          .removeAttribute("disabled", "");
      } else if (hour >= note.classList[1]) {
        document
          .getElementById("time-" + note.classList[1])
          .setAttribute("disabled", "");
      }
    });
  } else {
    notes.forEach((note) => {
      document
        .getElementById("time-" + note.classList[1])
        .removeAttribute("disabled", "");
    });
  }

  for (let note of notes) {
    if (
      document.getElementById("time-" + note.classList[1]).disabled == false
    ) {
      document.getElementById("selectTS").value = document.getElementById(
        "time-" + note.classList[1]
      ).value;
      break;
    } else {
      document.getElementById("selectTS").value = "--";
    }
  }
  localStorage.setItem(
    "choosenDate",
    document.getElementById("datefield").value
  );
  console.log("choosen date", localStorage.getItem("choosenDate"));

  localStorage.setItem(
    "choosenTimeSlot",
    document.getElementById("selectTS").value
  );
  console.log(
    "choosen time slot id",
    localStorage.getItem("choosenTimeSlotTime")
  );

  localStorage.setItem(
    "choosenTimeSlotTime",
    tableSessions[document.getElementById("selectTS").value]
  );
  console.log("choosen time slot ", localStorage.getItem("choosenTimeSlot"));
}

function timmingsAdjust(hour, today) {
  timeslot = document.getElementById("selectTS").value;
  console.log("today maybe", today);

  if (hour >= 8 && hour <= 20) {
    if (document.getElementById("datefield").value == getDateInFormat()) {
      document.getElementById("datefield").setAttribute("min", today);
    }
    updateTable(today, timeslot);
  }

  if (hour < 8) {
    updateTable(today, 1);
  }

  if (hour > 20) {
    var day = new Date();
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    passNextdayDD = nextDay.getDate();
    passNextdayMM = nextDay.getMonth() + 1;

    if (passNextdayDD < 10) {
      passNextdayDD = "0" + passNextdayDD;
    }

    if (passNextdayMM < 10) {
      passNextdayMM = "0" + passNextdayMM;
    }

    passNextDay =
      nextDay.getFullYear() + "-" + passNextdayMM + "-" + passNextdayDD;
    if (document.getElementById("datefield").value == getDateInFormat()) {
      document.getElementById("datefield").setAttribute("min", passNextDay);
    }
    document.getElementById("datefield").value = passNextDay;
    getAvailableTimmings();
  }
}

function updateDataFirstRun() {
  hour = getCurrentHour();
  today = getDateInFormat();

  getAvailableTimmings();

  timmingsAdjust(hour, today);

  localStorage.setItem(
    "choosenDate",
    document.getElementById("datefield").value
  );
  console.log("choosen date first run", localStorage.getItem("choosenDate"));

  localStorage.setItem(
    "choosenTimeSlot",
    document.getElementById("selectTS").value
  );
  console.log("choosen time slot id", localStorage.getItem("choosenTimeSlot"));

  localStorage.setItem(
    "choosenTimeSlotTime",
    tableSessions[document.getElementById("selectTS").value]
  );
  console.log(
    "choosen time slot ",
    localStorage.getItem("choosenTimeSlotTime")
  );

  updateTable(
    document.getElementById("datefield").value,
    document.getElementById("selectTS").value
  );

  resetTableSelection();
  document
    .getElementById("selectTS")
    .setAttribute("onchange", "updateData(this)");
  document
    .getElementById("datefield")
    .setAttribute("onchange", "updateData(this)");
}

function updateData(change) {
  hour = parseInt(document.getElementById("selectTS").value) + 7;
  todayNew = document.getElementById("datefield").value;

  console.log("today new", today);
  if (change.id == "datefield") {
    getAvailableTimmings();
  }
  console.log("today old", today);
  timmingsAdjust(hour, todayNew);

  localStorage.setItem(
    "choosenDate",
    document.getElementById("datefield").value
  );
  console.log("choosen date update data", localStorage.getItem("choosenDate"));

  localStorage.setItem(
    "choosenTimeSlot",
    document.getElementById("selectTS").value
  );
  console.log("choosen time slot id", localStorage.getItem("choosenTimeSlot"));

  localStorage.setItem(
    "choosenTimeSlotTime",
    tableSessions[document.getElementById("selectTS").value]
  );
  console.log(
    "choosen time slot ",
    localStorage.getItem("choosenTimeSlotTime")
  );

  // updateTable(
  //   document.getElementById("datefield").value,
  //   document.getElementById("selectTS").value
  // );

  resetTableSelection();
}

function resetTableSelection() {
  yourGlobalVariable = [];
  localStorage.setItem("choosentables", JSON.stringify(yourGlobalVariable));

  arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  arr.forEach((element) => {
    document.getElementById(element).checked = false;
  });
  document.getElementById("tableInfo").innerText = "No tables selected!";
  document.getElementById("totalPriceInfo").innerText = "";
  document.getElementById("tableSubmit").setAttribute("disabled", "");
}

function proocedToMenu() {
  console.log("prooced to menu");
  console.log(
    "choosenDate proceed to menu",
    localStorage.getItem("choosenDate")
  );
  console.log("choosenTimeSlot", localStorage.getItem("choosenTimeSlot"));
  console.log("choosentables", localStorage.getItem("choosentables"));

  // this doesnt work it takes by default the first date
  if (localStorage.getItem("choosenDate") == null) {
    alert("Please select a date");
    return;
  }

  // this doesnt work it takes by default the first time slot
  if (localStorage.getItem("choosenTimeSlot") == null) {
    alert("Please select a time slot");
    return;
  }
  if (
    localStorage.getItem("choosentables") == null ||
    localStorage.getItem("choosentables") == "[]"
  ) {
    alert("Please select a table");
    return;
  }

  // for menu page to check before adding items to cart if the tables are booked or not
  localStorage.setItem("isTableBooked", true);
  if (localStorage.getItem("isMenuBooked") == "true") {
    window.location.href = "checkoutTemp.html";
  } else {
    window.location.href = "menu.html";
  }
}

let date = new Date();
document.getElementById("datefield").value =
  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

document
  .getElementById("datefield")
  .setAttribute(
    "min",
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );

getTablePrices();
getTableSessions();
// updateData();
