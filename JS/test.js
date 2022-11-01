fetch("http://43.206.120.217:5000/getCost/")
  .then((response) => response.json())
  .then((data) => console.log(data));
