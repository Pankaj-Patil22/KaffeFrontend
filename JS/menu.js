let menuData = [];
let items_placed = {};

function moveToPlacedSelection(item_id, price, name) {
  items_placed[item_id] = {
    itemId: item_id,
    quantity: 1,
    price: price,
    name: name,
    totalPrice: price,
  };

  let item = document.getElementById("item-" + item_id);
  item.remove();

  let quantityComp = document.createElement("p");
  quantityComp.setAttribute("id", "quantity-" + item_id);
  quantityComp.innerText = "Quantity: " + 1;

  item.appendChild(quantityComp);
  let plusBtn = document.createElement("button");
  plusBtn.setAttribute("id", "plus-" + item_id);
  plusBtn.addEventListener("click", () => {
    increaseQuantity(item_id);
    document.getElementById("quantity-" + item_id).innerText =
      "Quantity: " + items_placed[item_id].quantity;
    document.getElementById("price-" + item_id).innerText =
      "Price: " + items_placed[item_id].totalPrice;
  });
  plusBtn.innerHTML = "+";

  let minusBtn = document.createElement("button");
  minusBtn.setAttribute("id", "minus-" + item_id);
  minusBtn.addEventListener("click", () => {
    let success = decreaseQuantity(item_id, price, name);
    if (success) {
      document.getElementById("quantity-" + item_id).innerText =
        "Quantity: " + items_placed[item_id].quantity;
      document.getElementById("price-" + item_id).innerText =
        "Price: " + items_placed[item_id].totalPrice;
    }
  });
  minusBtn.innerHTML = "-";

  item.appendChild(plusBtn);
  item.appendChild(minusBtn);
  let placedContainer = document.getElementById("placedConatiner");
  placedContainer.appendChild(item);
  let a = document.getElementById(item_id);
  a.remove();
  document
    .getElementById("proceedToCheckoutID")
    .removeAttribute("disabled", "");
}

async function fetchMenuData() {
  let url = "http://43.206.120.217/getMenu/";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderMenuData() {
  menuData = await fetchMenuData();
  console.log(menuData);
  let html = "";
  for (let item of menuData) {
    let htmlSegment = `<div class="card gy-5" style="max-width: 18rem;" id="${
      "item-" + item.item_id
    }">
        <div><img src="${
          item.image
        }"  width="200" height="200" class="card-img-top" alt="..."></div>
        <div><h5 class="card-title">${item.name}</h5></div>
                        <div><p class="card-text">${item.description}</p></div>
                        <div><strong><p id="${
                          "price-" + item.item_id
                        }">Price: ${item.price}</p></strong></div>
                        <div><button class="btn btn-dark" id='${
                          item.item_id
                        }'>Add to Cart</button></div>
                        </div>`;
    html += htmlSegment;
  }

  let container = document.getElementById("notPlacedConatiner");
  container.innerHTML = html;
  for (let item of menuData) {
    document.getElementById(item.item_id).addEventListener("click", () => {
      moveToPlacedSelection(item.item_id, item.price, item.name);
    });
  }
}

async function renderRaj() {
  menuData = await fetchMenuData();
  console.log(menuData);
  for (let item of menuData) {
    let div = document.createElement("div");
    div.setAttribute("class", "card gy-5");
    div.setAttribute(
      "style",
      "max-width: 18rem; margin: 40px 0px; padding: 40px 50px; border-radius: 20px; border: none;"
    );
    div.setAttribute("id", "item-" + item.item_id);
    let divImg = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", item.image);
    img.setAttribute("width", "200");
    img.setAttribute("height", "200");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("alt", "...");
    divImg.appendChild(img);
    div.appendChild(divImg);
    let divName = document.createElement("div");
    let h5 = document.createElement("h5");
    h5.setAttribute("style", "text-transform:capitalize; min-height:40px");
    h5.setAttribute("class", "card-title");
    h5.innerText = item.name;
    divName.appendChild(h5);
    div.appendChild(divName);
    let divDescription = document.createElement("div");
    let p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.innerText = item.description;
    divDescription.appendChild(p);
    divDescription.setAttribute(
      "style",
      "height:70px; overflow:hidden;text-overflow: ellipsis;"
    );
    divDescription.setAttribute("onmouseover", "this.style.overflow='auto'");
    divDescription.setAttribute("onmouseout", "this.style.overflow='hidden'");
    div.appendChild(divDescription);
    let strong = document.createElement("strong");
    let pp = document.createElement("p");
    pp.setAttribute("id", "price-" + item.item_id);
    pp.innerText = "Price: " + item.price;
    strong.appendChild(pp);
    div.appendChild(strong);
    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-dark");
    button.setAttribute("id", item.item_id);
    button.innerText = "Add to Cart";
    div.appendChild(button);
    document.getElementById("notPlacedConatiner").appendChild(div);
  }

  for (let item of menuData) {
    document.getElementById(item.item_id).addEventListener("click", () => {
      moveToPlacedSelection(item.item_id, item.price, item.name);
    });
  }
}

function increaseQuantity(item_id) {
  if (items_placed[item_id].quantity >= 10) return;

  items_placed[item_id].quantity += 1;
  items_placed[item_id].totalPrice =
    items_placed[item_id].price * items_placed[item_id].quantity;
  console.log(items_placed[item_id].price);
  document
    .getElementById("proceedToCheckoutID")
    .removeAttribute("disabled", "");
}

function decreaseQuantity(item_id, price, name) {
  if (items_placed[item_id].quantity > 1) {
    items_placed[item_id].quantity -= 1;
    items_placed[item_id].totalPrice =
      items_placed[item_id].price * items_placed[item_id].quantity;
    return true;
  } else {
    delete items_placed[item_id];
    let item = document.getElementById("item-" + item_id);
    item.removeChild(document.getElementById("quantity-" + item_id));
    item.removeChild(document.getElementById("plus-" + item_id));
    item.removeChild(document.getElementById("minus-" + item_id));
    let addToCartButton = document.createElement("button");
    addToCartButton.setAttribute("id", item_id);
    addToCartButton.setAttribute("class", "btn btn-dark");
    addToCartButton.innerText = "Add to Cart";
    addToCartButton.addEventListener("click", () => {
      moveToPlacedSelection(item_id, price, name);
    });
    item.appendChild(addToCartButton);
    item.remove();
    let container = document.getElementById("notPlacedConatiner");
    container.appendChild(item);

    let selectedContainerLength =
      document.getElementById("placedConatiner").childNodes.length;
    if (selectedContainerLength == 1) {
      document
        .getElementById("proceedToCheckoutID")
        .setAttribute("disabled", "");
    }
    return false;
  }
}

function proceedToCheckout() {
  localStorage.setItem("item_placed", JSON.stringify(items_placed));
  localStorage.setItem("firstname12", "Alen");

  localStorage.setItem("isMenuBooked", true);
  if (localStorage.getItem("isTableBooked") != "true")
    window.location.href = "http://43.206.120.217/tables";
  else window.location.href = "http://43.206.120.217/checkout";
}

document.getElementById("proceedToCheckoutID").addEventListener("click", () => {
  proceedToCheckout();
});

document.getElementById("proceedToCheckoutID").innerText =
  localStorage.getItem("isTableBooked") != "true"
    ? "Book Table"
    : "Proceed to Checkout";

renderRaj();
localStorage.setItem("firstname", "Alen");
