console.log("You have connected...");

const user_id = 1;
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`;
}

async function fetchTransactionData() {
  let url = "http://43.206.120.217/getSuccessfullTransactions/" + user_id;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderRaj() {
  transactionData = await fetchTransactionData();
  console.log(transactionData);
  for (let transaction of transactionData) {
    let div = document.createElement("div");
    div.setAttribute("class", "card gy-5");
    div.setAttribute(
      "style",
      " margin: 40px 0px; padding: 40px 50px; border-radius: 20px; border: none; box-shadow: 1px 5px 10px 1px rgb(144, 200, 220); width:60%;"
    );
    div.setAttribute("id", "trans-" + transaction.id);

    let h5 = document.createElement("h5");
    h5.setAttribute("class", "card-title");
    h5.innerText = transaction.created;
    div.appendChild(h5);

    let p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.innerHTML =
      "<strong>Table Price: </strong>" +
      transaction.table_total +
      "<strong>  Order Price: </strong>" +
      transaction.order_total;
    div.appendChild(p);

    var d1 = new Date(); //"now"
    var d2 = new Date(transaction.created); // some date
    diff = convertMsToTime(Math.abs(d1 - d2));

    let timePeriodDiv = document.createElement("div");
    timePeriodDiv.setAttribute("style", "text-align:right;");
    timePeriodDiv.classList.add("justify-content-center");
    timePeriodDiv.innerHTML = "<strong>Placed </strong><p>" + diff + " ago</p>";
    div.appendChild(timePeriodDiv);

    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-dark");
    button.addEventListener("click", () => {
      localStorage.setItem("order_id", transaction.order_id);
      console.log("order_id: " + transaction.order_id);
      console.log("transaction_id: " + transaction.transaction_id);
      localStorage.setItem("transaction_id", transaction.transaction_id);
      window.location.href = "http://43.206.120.217/feedback";
    });

    if (transaction.feedback_id == null) {
      button.innerText = "Give Feedback";

      button.addEventListener("click", () => {
        localStorage.setItem("order_id", transaction.order_id);
        console.log("order_id: " + transaction.order_id);
        console.log("transaction_id: " + transaction.transaction_id);
        localStorage.setItem("transaction_id", transaction.transaction_id);
        window.location.href = "http://43.206.120.217/feedback";
      });
    } else {
      button.innerText = "View Feedback";
      localStorage.setItem("feedback_id", transaction.feedback_id);
      button.setAttribute("class", "btn btn-success");
      button.addEventListener("click", () => {
        console.log("feedback_id: " + transaction.feedback_id);
        localStorage.setItem("feedback_id", transaction.feedback_id);
        localStorage.setItem("order_id", transaction.order_id);
        window.location.href = "http://43.206.120.217/feedbackView";
      });
    }

    div.appendChild(button);
    document.getElementById("history").appendChild(div);
  }
}

renderRaj();
