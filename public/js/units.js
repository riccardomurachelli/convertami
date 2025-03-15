const units = {
    length: {
      "Metri": 1,
      "Chilometri": 0.001,
      "Miglia": 0.000621371,
      "Pollici": 39.3701
    },
    weight: {
      "Chilogrammi": 1,
      "Grammi": 1000,
      "Libbre": 2.20462,
      "Once": 35.274
    },
    temperature: {
      "Celsius": "C",
      "Fahrenheit": "F"
    }
  };
  
  function populateUnits() {
    const category = document.getElementById("category").value;
    const unitFrom = document.getElementById("unitFrom");
    const unitTo = document.getElementById("unitTo");
    unitFrom.innerHTML = "";
    unitTo.innerHTML = "";
    
    for (let unit in units[category]) {
      let optionFrom = document.createElement("option");
      optionFrom.value = unit;
      optionFrom.text = unit;
      unitFrom.appendChild(optionFrom);
      
      let optionTo = document.createElement("option");
      optionTo.value = unit;
      optionTo.text = unit;
      unitTo.appendChild(optionTo);
    }
  }
  
  function convertUnits() {
    const category = document.getElementById("category").value;
    let value = parseFloat(document.getElementById("inputValue").value);
    let from = document.getElementById("unitFrom").value;
    let to = document.getElementById("unitTo").value;
    let result;
    
    if (category === "temperature") {
      if (from === "Celsius" && to === "Fahrenheit") {
        result = (value * 9/5) + 32;
      } else if (from === "Fahrenheit" && to === "Celsius") {
        result = (value - 32) * 5/9;
      } else {
        result = value;
      }
    } else {
      // Per lunghezza e peso, utilizziamo i fattori di conversione
      let factorFrom = units[category][from];
      let factorTo = units[category][to];
      result = value * (factorTo / factorFrom);
    }
    
    document.getElementById("result").innerText = `Risultato: ${result.toFixed(2)}`;
  }
  
  document.addEventListener("DOMContentLoaded", populateUnits);
  