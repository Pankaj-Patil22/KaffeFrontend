async function fetchTransactionData(transaction_id) {
  let url = "http://13.233.161.125/getTansactionData/" + transaction_id;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderRaja(transaction_id) {
  //   transaction_id = localStorage.getItem("transaction_id");
  transactionData = await fetchTransactionData(transaction_id);
  console.log("transactionData", transactionData);
  document.getElementById("created_date_time").innerHTML =
    transactionData.created_date;

  leftData = document.getElementById("leftData");
  rightData = document.getElementById("rightData");

  addHtag("h4", leftData, "Booked table number: ", "text-align: left");
  addHtag(
    "h4",
    rightData,
    getTables(transactionData.tables),
    "text-align: right"
  );

  addHtag("h4", leftData, "Tables Total: ", "text-align: left");
  addHtag("h4", rightData, transactionData.table_total, "text-align: right");

  leftData.appendChild(document.createElement("hr"));
  rightData.appendChild(document.createElement("br"));

  transactionData.items_data.forEach((item) => {
    addHtag("h4", leftData, item.name, "text-align: left");
    addHtag(
      "h4",
      rightData,
      item.quantity + " X " + item.price,
      "text-align: right"
    );
  });

  addHtag("h4", leftData, "Order Total: ", "text-align: left");
  addHtag("h4", rightData, transactionData.order_total, "text-align: right");

  leftData.appendChild(document.createElement("hr"));
  rightData.appendChild(document.createElement("br"));

  addHtag("h4", leftData, "Total: ", "text-align: left");
  addHtag(
    "h4",
    rightData,
    "₹" +
      (parseInt(transactionData.order_total) +
        parseInt(transactionData.table_total)),
    "text-align: right"
  );
}

function getTables(tables) {
  let tableString = "";
  tables.forEach((table) => {
    tableString += table + ", ";
  });
  return tableString.slice(0, -2);
}
async function addHtag(tag, div, text, style) {
  let h = document.createElement(tag);
  h.innerHTML = text;
  h.setAttribute("style", style);
  div.appendChild(h);
}

renderRaja(localStorage.getItem("transaction_id"));
