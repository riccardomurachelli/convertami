async function fetchCurrencies() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const data = await response.json();
    if (data.rates) {
      return Object.keys(data.rates);
    } else {
      console.error("Error fetching currencies");
      return [];
    }
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
}

async function fetchUpdatedTime(){
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const data = await response.json();
    if (data.time_last_updated) {
      return new Date(data.time_last_updated).toLocaleString();
    } else {
      console.error("Error fetching update time");
      return "N/A";
    }
  } catch (error) {
    console.error("Error: ", error);
    return "N/A";
  }
}

async function populateCurrencies() {
  const currencyList = await fetchCurrencies();
  const currencyFrom = document.getElementById("currencyFrom");
  const currencyTo = document.getElementById("currencyTo");
  
  // Pulisci le liste prima di popolare
  currencyFrom.innerHTML = '';
  currencyTo.innerHTML = '';

  // Aggiungi opzioni per ogni valuta
  currencyList.forEach(currency => {
    const optionFrom = new Option(currency, currency);
    const optionTo = new Option(currency, currency);
    currencyFrom.add(optionFrom);
    currencyTo.add(optionTo);
  });

  // Imposta valori di default
  currencyFrom.value = 'EUR';
  currencyTo.value = 'USD';
}

async function convertCurrency() {
  const amount = document.getElementById("inputAmount").value;
  const from = document.getElementById("currencyFrom").value;
  const to = document.getElementById("currencyTo").value;
  const resultElement = document.getElementById("result");

  if (!amount) {
    alert("Inserisci un importo");
    return;
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    alert("Importo non valido");
    return;
  }

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/' + from);
    if (!response.ok) {
      throw new Error("Errore nella richiesta di conversione");
    }
    const data = await response.json();
    const rates = data.rates;

    if (!rates[from] || !rates[to]) {
      resultElement.innerText = "Una o più valute selezionate non sono valide";
      return;
    }

    // Calcola il tasso di conversione
    const conversionRate = (rates[to] * rates[from]);
    const result = numericAmount * conversionRate;

    resultElement.innerText = `Risultato: ${result.toFixed(2)} ${to}`;
  } catch (error) {
    console.error("Errore nella conversione:", error);
    resultElement.innerText = "Errore durante la conversione. Riprova più tardi.";
  }
}

document.addEventListener("DOMContentLoaded", populateCurrencies);