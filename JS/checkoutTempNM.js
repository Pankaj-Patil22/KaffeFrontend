function addQuantDish(element) {
  let totalDishesPrice = 0;
  let quant = document.getElementById("cnt" + element.id);

  if (parseInt(quant.innerText) >= 10) return;

  let price = document.getElementById("pricePerId" + element.id);
  let total = document.getElementById("priceQuantId" + element.id);
  let transData = localStorage.getItem("item_placed");
  transData = JSON.parse(transData);
  quant.innerText = parseInt(quant.innerText) + 1;
  total.innerText = parseInt(quant.innerText) * parseInt(price.innerText);
  transData[element.id].quantity = parseInt(quant.innerText);
  transData[element.id].totalPrice = parseInt(total.innerText);
  upadteLocalStorage(totalDishesPrice, element, transData);
  console.log(transData[element.id]);
  localStorage.setItem("item_placed", JSON.stringify(transData));
}

function minusQuantDish(element) {
  let totalDishesPrice = 0;
  let quant = document.getElementById("cnt" + element.id);
  let price = document.getElementById("pricePerId" + element.id);
  let total = document.getElementById("priceQuantId" + element.id);
  let transData = localStorage.getItem("item_placed");
  transData = JSON.parse(transData);
  quant.innerText = parseInt(quant.innerText) - 1;
  if (parseInt(quant.innerText) == 0) {
    document.getElementById("itemDiv" + element.id).innerHTML = "";
    delete transData[element.id];
    console.log(Object.keys(transData).length);
    if (Object.keys(transData).length == 0) {
      window.location.href = "http://43.206.120.217/menu";
    }
  } else if (parseInt(quant.innerText) > 0) {
    total.innerText = parseInt(quant.innerText) * parseInt(price.innerText);
  }
  localStorage.setItem("item_placed", JSON.stringify(transData));
  transData[element.id].quantity = parseInt(quant.innerText);
  transData[element.id].totalPrice = parseInt(total.innerText);
  upadteLocalStorage(totalDishesPrice, element, transData);
  console.log(transData[element.id]);
  localStorage.setItem("item_placed", JSON.stringify(transData));
}

function saveSpecialInstructions() {
  localStorage.setItem(
    "choosenSpecialInstructions",
    document.getElementById("specialInstructionsTA").value
  );
}

function upadteLocalStorage(totalDishesPrice, element, transData) {
  Object.values(transData).forEach((ele) => {
    totalDishesPrice += parseInt(ele.totalPrice);
  });
  localStorage.setItem("totalDishesPrice", totalDishesPrice);
  console.log(localStorage.getItem("totalDishesPrice"));
  transData[element.id].total_dishes_price = totalDishesPrice;

  document.getElementById("tableSubtotalId").innerText =
    localStorage.getItem("totalPriceOfTable");
  document.getElementById("menuSubtotalId").innerText =
    localStorage.getItem("totalDishesPrice");
  document.getElementById("totalPTP").innerText =
    parseInt(localStorage.getItem("totalPriceOfTable")) +
    parseInt(localStorage.getItem("totalDishesPrice"));
}
