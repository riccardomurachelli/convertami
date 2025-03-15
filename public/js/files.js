const fileUnits = {
    "Bytes": 1,
    "KB": 1024,
    "MB": 1024 * 1024,
    "GB": 1024 * 1024 * 1024
  };
  
  function populateFileUnits() {
    const fileFrom = document.getElementById("fileFrom");
    const fileTo = document.getElementById("fileTo");
    fileFrom.innerHTML = "";
    fileTo.innerHTML = "";
    
    for (let unit in fileUnits) {
      let optionFrom = document.createElement("option");
      optionFrom.value = unit;
      optionFrom.text = unit;
      fileFrom.appendChild(optionFrom);
      
      let optionTo = document.createElement("option");
      optionTo.value = unit;
      optionTo.text = unit;
      fileTo.appendChild(optionTo);
    }
  }
  
  function convertFiles() {
    let value = parseFloat(document.getElementById("inputSize").value);
    let from = document.getElementById("fileFrom").value;
    let to = document.getElementById("fileTo").value;
    if (isNaN(value)) {
      alert("Inserisci un valore numerico");
      return;
    }
    
    let bytes = value * fileUnits[from]; // converto in bytes
    let result = bytes / fileUnits[to]; // converto nel formato target
    
    document.getElementById("result").innerText = `Risultato: ${result.toFixed(2)} ${to}`;
  }
  
  document.addEventListener("DOMContentLoaded", populateFileUnits);
  