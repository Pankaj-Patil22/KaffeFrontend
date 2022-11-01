const feedback_id = localStorage.getItem("feedback_id");
if (feedback_id == null) {
  window.location.href = "http://43.206.120.217/home/";
}

function renderOverallRating(feedback_id) {
  console.log("renderOverallRating", feedback_id);
  getOverallFeedback(feedback_id).then((data) => {
    let overall_feedback_div = document.getElementById("overall_feedback");
    let newOverall = document.createElement("div");
    newOverall.setAttribute(
      "style",
      "margin: 40px 0px; padding: 40px 50px; border-radius: 20px; border: none; box-shadow: 1px 5px 10px 1px rgb(144, 200, 220); width:50rem;"
    );
    newOverall.setAttribute("class", "justify-content-center card gy-5");
    let first_div = document.createElement("div");
    let h1 = document.createElement("h1");
    h1.innerHTML = "Overall Rating:";
    h1.setAttribute("style", "text-align: center;");
    first_div.appendChild(h1);
    let input = document.createElement("input");
    let divInput = document.createElement("div");
    divInput.setAttribute("style", "text-align: center;");
    input.setAttribute("type", "range");
    input.setAttribute("max", "5");
    console.log("data rating", data.rating);
    input.setAttribute("value", data.rating);
    input.setAttribute("disabled", true);
    divInput.appendChild(input);
    let span = document.createElement("span");
    span.innerHTML = data.rating;
    divInput.appendChild(span);
    first_div.appendChild(divInput);

    let second_div = document.createElement("div");
    second_div.className = "overall-review";
    second_div.setAttribute("style", "text-align: center;");
    let text = document.createElement("p");
    text.innerHTML = "<strong>Review: </strong>" + data.review;
    text.setAttribute("disabled", true);
    second_div.appendChild(text);

    newOverall.appendChild(first_div);
    newOverall.appendChild(second_div);
    overall_feedback_div.appendChild(newOverall);
  });
}

function renderItemsFeedback(feedback_id) {
  console.log("renderItemsFeedback", feedback_id);
  getItemsFeedback(feedback_id).then((data) => {
    let main_div = document.getElementById("items_feedback");
    const menu_items = getMenuItems();
    data.forEach((item) => {
      menu_items.then((menu_item) => {
        menu_item.forEach((menu_item) => {
          console.log("menu_item id ", menu_item);
          console.log("item id ", item.item_id);
          if (menu_item.item_id == item.item_id) {
            console.log("item rating", item.rating);
            const item_div = document.createElement("div");
            item_div.className = "row justify-content-around";
            item_div.setAttribute("style", "width:50rem");
            item_div.innerHTML = `
            <div id=${item.item_id} style ="margin: 40px 0px; padding: 40px 50px; border-radius: 20px; border: none; box-shadow: 1px 5px 10px 1px rgb(144, 200, 220); width:80%;" class="justify-content-center card gy-5">
                <div class="item-image">
                <img src="${menu_item.image}" alt="item image" style="width: 300px;height: 350px;"/>
                </div>
                <div class="item-name"><strong>${menu_item.name}</strong></div>
                <div class="item-rating">
                    <input type="range" id="item_rating_${item.item_id}" name="item_rating" value="${item.rating}" min="0" max="5" disabled/>
                    <span id="item_rating_value_${item.item_id}">${item.rating}</span>
                </div>
                <div class="overall-review">
                </div>
                <p><strong>Review: </strong>${item.review}</p>
                </div>`;
            main_div.appendChild(item_div);
          }
        });
      });
    });
  });
}

async function getMenuItems() {
  return await fetch(
    `http://43.206.120.217/get_items_in_order/${localStorage.getItem(
      "order_id"
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

async function getOverallFeedback(overall_feedback_id) {
  let url = "http://43.206.120.217/get_overall_feedback/" + overall_feedback_id;
  return await fetchData(url);
}

async function getItemsFeedback(overall_feedback_id) {
  let url = "http://43.206.120.217/get_items_feedback/" + overall_feedback_id;
  console.log("getItemsFeedback", url);
  return await fetchData(url);
}

async function fetchData(url) {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

renderOverallRating(feedback_id);
renderItemsFeedback(feedback_id);
