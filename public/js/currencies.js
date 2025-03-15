async function fetchCurrencies() {
  try {
    const response = await fetch('/api/currencies');
    const data = await response.json();
    if (data.currencies) {
       populateCurrencies(data.currencies);
    } else {
       console.error("Error fetching currencies");
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

function populateCurrencies(currencyList) {
   const currencyFrom = document.getElementById("currencyFrom");
   const currencyTo = document.getElementById("currencyTo");
   currencyFrom.innerHTML = "";
   currencyTo.innerHTML = "";
   currencyList.forEach(currency => {
      let optionFrom = document.createElement("option");
      optionFrom.value = currency;
      optionFrom.text = currency;
      currencyFrom.appendChild(optionFrom);
      
      let optionTo = document.createElement("option");
      optionTo.value = currency;
      optionTo.text = currency;
      currencyTo.appendChild(optionTo);
   });
}

async function convertCurrency() {
  let amount = document.getElementById("inputAmount").value;
  let from = document.getElementById("currencyFrom").value;
  let to = document.getElementById("currencyTo").value;
  
  if (!amount) {
    alert("Inserisci un importo");
    return;
  }
  
  try {
    const response = await fetch(`/api/currency?from=${from}&to=${to}&amount=${amount}`);
    const data = await response.json();
    if(data.result !== undefined) {
      document.getElementById("result").innerText = `Risultato: ${data.result.toFixed(2)} ${to}`;
    } else {
      document.getElementById("result").innerText = `Errore: ${data.error}`;
    }
  } catch (error) {
    document.getElementById("result").innerText = "Errore nella conversione.";
  }
}

document.addEventListener("DOMContentLoaded", fetchCurrencies);
