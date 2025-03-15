const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Serve la cartella 'public' come contenuto statico
app.use(express.static('public'));
app.use(express.json());

// Endpoint API per la conversione di valute (con tassi fissi di esempio)
const currencyRates = {
  EUR: 1,
  USD: 1.1,
  GBP: 0.9
};

app.get('/api/currency', (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  const amt = parseFloat(amount);
  if (isNaN(amt)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  const rateFrom = currencyRates[from];
  const rateTo = currencyRates[to];
  if (!rateFrom || !rateTo) {
    return res.status(400).json({ error: 'Unsupported currency' });
  }
  // Conversione: da "from" a EUR e poi da EUR a "to"
  const result = (amt / rateFrom) * rateTo;
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
