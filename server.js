const express = require('express');
const axios = require('axios');
const path = require('path');
const cron = require('node-cron');
const cleanupJob = require('./utils/cleanup');
const stats = require('./utils/stats');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'img')));

/* --- ENDPOINTS PER LE VALUTE (unchanged) --- */
app.get('/api/currencies', async (req, res) => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    res.json({ currencies: Object.keys(response.data.rates) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching currencies list' });
  }
});
app.get('/api/currency', async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) return res.status(400).json({ error: 'Missing parameters' });
  const amt = parseFloat(amount);
  if (isNaN(amt)) return res.status(400).json({ error: 'Invalid amount' });
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    const rates = response.data.rates;
    if (!rates[from] || !rates[to]) return res.status(400).json({ error: 'Unsupported currency' });
    const result = (amt / rates[from]) * rates[to];
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});
// Coso per le cose delle cose :P (cosi chiamate statistiche)
app.get('/api/stats', (req, res) => {
  const total = stats.getTotalCount();
  res.json({ total: total });
});

/* --- MOUNT CONVERSION ROUTES --- */
app.use('/api/convert/image', require('./routes/images'));
app.use('/api/convert/video', require('./routes/video'));
app.use('/api/convert/doc', require('./routes/docs'));
app.get('/api/stats', (req, res) => res.json({ total: stats.getTotalCount() }));

// pulizia temp ogni 5 minuti
cron.schedule('*/5 * * * *', cleanupJob);

app.listen(port, () => console.log(`Server running on port ${port}`));
