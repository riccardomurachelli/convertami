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
  },
  filesize: {
    "Bytes": 1,
    "KB": 1024,
    "MB": 1048576,
    "GB": 1073741824,
    "TB": 1099511627776
  },
  speed: {
    "m/s": 1,
    "km/h": 3.6,
    "mph": 2.23694
  },
  area: {
    "m²": 1,
    "km²": 0.000001,
    "Acres": 0.000247105
  },
  volume: {
    "Litri": 1,
    "Millilitri": 1000,
    "Galloni": 0.264172
  }
};

let currentCategory = "length";

function populateUnits(category) {
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

function switchCategory(category) {
  currentCategory = category;
  populateUnits(category);
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`tab-${category}`).classList.add('active');
}

function convertUnits() {
  let value = parseFloat(document.getElementById("inputValue").value);
  let from = document.getElementById("unitFrom").value;
  let to = document.getElementById("unitTo").value;
  let result;
  
  if (currentCategory === "temperature") {
    if (from === "Celsius" && to === "Fahrenheit") {
      result = (value * 9/5) + 32;
    } else if (from === "Fahrenheit" && to === "Celsius") {
      result = (value - 32) * 5/9;
    } else {
      result = value;
    }
  } else if (currentCategory === "filesize") {
    // Per filesize, il calcolo usa: valore * (factorFrom / factorTo)
    let factorFrom = units[currentCategory][from];
    let factorTo = units[currentCategory][to];
    result = value * (factorFrom / factorTo);
  } else {
    let factorFrom = units[currentCategory][from];
    let factorTo = units[currentCategory][to];
    result = value * (factorTo / factorFrom);
  }
  
  document.getElementById("result").innerText = `Risultato: ${result.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", function() {
  switchCategory("length");
});
