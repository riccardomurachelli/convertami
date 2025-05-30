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
  
  // Mappatura dei codici valuta ai nomi completi
  const currencyNames = {
    "AED": "Dirham degli Emirati Arabi Uniti",
    "AFN": "Afghani",
    "ALL": "Lek Albanese",
    "AMD": "Dram Armeno",
    "ANG": "Fiorino delle Antille Olandesi",
    "AOA": "Kwanza Angolano",
    "ARS": "Peso Argentino",
    "AUD": "Dollaro Australiano",
    "AWG": "Fiorino di Aruba",
    "AZN": "Manat Azero",
    "BAM": "Marco Convertibile della Bosnia-Herzegovina",
    "BBD": "Dollaro di Barbados",
    "BDT": "Taka Bangladese",
    "BGN": "Lev Bulgaro",
    "BHD": "Dinaro del Bahrein",
    "BIF": "Franco del Burundi",
    "BMD": "Dollaro delle Bermuda",
    "BND": "Dollaro del Brunei",
    "BOB": "Boliviano",
    "BRL": "Real Brasiliano",
    "BSD": "Dollaro delle Bahamas",
    "BTN": "Ngultrum Bhutanese",
    "BWP": "Pula del Botswana",
    "BYN": "Rublo Bielorusso",
    "BZD": "Dollaro del Belize",
    "CAD": "Dollaro Canadese",
    "CDF": "Franco Congolese",
    "CHF": "Franco Svizzero",
    "CLP": "Peso Cileno",
    "CNY": "Renminbi Cinese",
    "COP": "Peso Colombiano",
    "CRC": "Colón Costaricano",
    "CUP": "Peso Cubano",
    "CVE": "Escudo del Capo Verde",
    "CZK": "Corona Ceca",
    "DJF": "Franco Gibutiano",
    "DKK": "Corona Danese",
    "DOP": "Peso Dominicano",
    "DZD": "Dinaro Algerino",
    "EGP": "Sterlina Egiziana",
    "ERN": "Nakfa Eritreo",
    "ETB": "Birr Etiope",
    "EUR": "Euro",
    "FJD": "Dollaro Figiano",
    "FKP": "Sterlina delle Falkland",
    "FOK": "Corona Færøer",
    "GBP": "Sterlina Britannica",
    "GEL": "Lari Georgiano",
    "GGP": "Sterlina di Guernsey",
    "GHS": "Cedi Ghanaiano",
    "GIP": "Sterlina di Gibilterra",
    "GMD": "Dalasi Gambiano",
    "GNF": "Franco Guineano",
    "GTQ": "Quetzal Guatemalteco",
    "GYD": "Dollaro della Guyana",
    "HKD": "Dollaro di Hong Kong",
    "HNL": "Lempira Honduregna",
    "HRK": "Kuna Croata",
    "HTG": "Gourde Haitiano",
    "HUF": "Fiorino Ungherese",
    "IDR": "Rupia Indonesiana",
    "ILS": "Nuovo Shekel Israeliano",
    "IMP": "Sterlina dell'Isola di Man",
    "INR": "Rupia Indiana",
    "IQD": "Dinaro Iracheno",
    "IRR": "Rial Iraniano",
    "ISK": "Corona Islandese",
    "JEP": "Sterlina di Jersey",
    "JMD": "Dollaro Giamaicano",
    "JOD": "Dinaro Giordano",
    "JPY": "Yen Giapponese",
    "KES": "Scellino Keniota",
    "KGS": "Som Kirghiso",
    "KHR": "Riel Cambogiano",
    "KID": "Dollaro di Kiribati",
    "KMF": "Franco Comoriano",
    "KRW": "Won Sudcoreano",
    "KWD": "Dinaro Kuwaitiano",
    "KYD": "Dollaro delle Isole Cayman",
    "KZT": "Tenge Kazako",
    "LAK": "Kip Laotiano",
    "LBP": "Lira Libanese",
    "LKR": "Rupia dello Sri Lanka",
    "LRD": "Dollaro Liberiano",
    "LSL": "Loti del Lesotho",
    "LYD": "Dinaro Libico",
    "MAD": "Dirham Marocchino",
    "MDL": "Leu Moldavo",
    "MGA": "Ariary Malgascio",
    "MKD": "Denar Macedone",
    "MMK": "Kyat di Myanmar",
    "MNT": "Tugrik Mongolo",
    "MOP": "Pataca di Macao",
    "MRU": "Ouguiya Mauritana",
    "MUR": "Rupia Mauriziana",
    "MVR": "Rufiyaa delle Maldive",
    "MWK": "Kwacha Malawiano",
    "MXN": "Peso Messicano",
    "MYR": "Ringgit Malese",
    "MZN": "Metical Mozambicano",
    "NAD": "Dollaro Namibiano",
    "NGN": "Naira Nigeriana",
    "NIO": "Córdoba Nicaraguense",
    "NOK": "Corona Norvegese",
    "NPR": "Rupia Nepalese",
    "NZD": "Dollaro Neozelandese",
    "OMR": "Rial Omanita",
    "PAB": "Balboa Panamense",
    "PEN": "Sol Peruviano",
    "PGK": "Kina della Papua Nuova Guinea",
    "PHP": "Peso Filippino",
    "PKR": "Rupia Pakistana",
    "PLN": "Złoty Polacco",
    "PYG": "Guaraní Paraguayo",
    "QAR": "Rial Qatariota",
    "RON": "Leu Rumeno",
    "RSD": "Dinaro Serbo",
    "RUB": "Rublo Russo",
    "RWF": "Franco Ruandese",
    "SAR": "Riyal Saudita",
    "SBD": "Dollaro delle Isole Salomone",
    "SCR": "Rupia delle Seychelles",
    "SDG": "Sterlina Sudanese",
    "SEK": "Corona Svedese",
    "SGD": "Dollaro di Singapore",
    "SHP": "Sterlina di Sant'Elena",
    "SLE": "Leone della Sierra Leone",
    "SLL": "Leone della Sierra Leone (vecchio)",
    "SOS": "Scellino Somalo",
    "SRD": "Dollaro Surinamese",
    "SSP": "Sterlina del Sud Sudan",
    "STN": "Dobra di São Tomé e Príncipe",
    "SYP": "Lira Siriana",
    "SZL": "Lilangeni dello Swaziland",
    "THB": "Baht Thailandese",
    "TJS": "Somoni Tagiko",
    "TMT": "Manat Turkmeno",
    "TND": "Dinaro Tunisino",
    "TOP": "Paʻanga Tongano",
    "TRY": "Lira Turca",
    "TTD": "Dollaro di Trinidad e Tobago",
    "TVD": "Dollaro Tuvaluano",
    "TWD": "Nuovo dollaro taiwanese",
    "TZS": "Scellino della Tanzania",
    "UAH": "Grivnia Ucraina",
    "UGX": "Scellino Ugandese",
    "USD": "Dollaro Americano",
    "UYU": "Peso Uruguaiano",
    "UZS": "Sum dell'Uzbekistan",
    "VES": "Bolívar Venezuelano",
    "VND": "Dong Vietnamita",
    "VUV": "Vatu di Vanuatu",
    "WST": "Tala Samoano",
    "XAF": "Franco CFA BEAC",
    "XCD": "Dollaro dei Caraibi Orientali",
    "XDR": "Diritti Speciali di Prelievo",
    "XOF": "Franco CFA BCEAO",
    "XPF": "Franco CFP",
    "YER": "Rial Yemenita",
    "ZAR": "Rand Sudafricano",
    "ZMW": "Kwacha Zambiano",
    "ZWL": "Dollaro Zimbabwese"
  };

  // Pulisci le liste prima di popolare
  currencyFrom.innerHTML = '';
  currencyTo.innerHTML = '';

  // Aggiungi opzioni per ogni valuta
  currencyList.forEach(currencyCode => {
    // Ottieni il nome completo o usa il codice se non presente
    const currencyName = currencyNames[currencyCode] || currencyCode;
    const displayText = `${currencyCode} - ${currencyName}`;
    
    const optionFrom = new Option(displayText, currencyCode);
    const optionTo = new Option(displayText, currencyCode);
    
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