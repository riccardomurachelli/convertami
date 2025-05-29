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

async function fetchUpdatedTime() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const data = await response.json();
    if (data.time_last_updated) {
      // time_last_updated è un intero in secondi, lo moltiplichiamo per 1000 per ottenere millisecondi
      const date = new Date(data.time_last_updated * 1000);
      
      // Opzioni per il formato data e ora (es. 29/05/2025 – 14:23:07)
      const options = {
        day:   '2-digit',
        month: '2-digit',
        year:  'numeric',
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      
      return date.toLocaleString('it-IT', options);
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

  const updatedSpan = document.getElementById("last-updated");
  const updatedTime = await fetchUpdatedTime();
  updatedSpan.innerHTML = `Aggiornate al: <em>${updatedTime}</em>`;
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
    const conversionRate = rates[to];
    const result = numericAmount * conversionRate;

    resultElement.innerText = `Risultato: ${result.toFixed(2)} ${to}`;
  } catch (error) {
    console.error("Errore nella conversione:", error);
    resultElement.innerText = "Errore durante la conversione. Riprova più tardi.";
  }
}

document.addEventListener("DOMContentLoaded", populateCurrencies);