function saveSpecialInstructions(){
    localStorage.setItem(
      "choosenSpecialInstructions",
      document.getElementById("specialInstructionsTA").value
    );
  }