fetch("http://192.168.1.31:5000/getCost/")
  .then((response) => response.json())
  .then((data) => console.log(data));
