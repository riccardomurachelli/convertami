const units = {
  length: { base: 'Metri', measures: { Metri:1, Centimetri:100, Millimetri:1000, Micrometri:1e6, Chilometri:0.001, Miglia:0.000621371, Piedi:3.28084, Iarde:1.09361, Pollici:39.3701, Nodi:0.000539957 } },
  weight: { base: 'Chilogrammi', measures: { Chilogrammi:1, Grammi:1000, Milligrammi:1e6, Tonellate:0.001, Libbre:2.20462, Once:35.274, Pietre:0.157473 } },
  temperature: { base:'Celsius', measures:{ Celsius:'C', Fahrenheit:'F', Kelvin:'K', Rankine:'R', Reaumur:'Re' } },
  filesize: { base:'Bytes', measures:{ Bytes:1, KB:1024, MB:1048576, GB:1073741824, TB:1099511627776 } },
  speed: { base:'m/s', measures:{ 'm/s':1, 'km/h':3.6, mph:2.23694, Knot:0.539957 } },
  area: { base:'m²', measures:{ 'm²':1, 'cm²':1e4, 'km²':1e-6, Ettari:1e-4, Acri:2.47105e-4 } },
  volume: { base:'Litri', measures:{ Litri:1, Millilitri:1000, 'm³':0.001, GalloniUS:0.264172, GalloniUK:0.219969, OnceFluidUS:33.814 } },
  time: { base:'Secondi', measures:{ Secondi:1, Minuti:1/60, Ore:1/3600, Giorni:1/86400, Settimane:1/604800, Mesi:1/2.63e6, Anni:1/3.154e7 } },
  angle: { base:'Gradi', measures:{ Gradi:1, Radianti:0.0174533, GradiGon:1.11111 } },
  energy: { base:'Joule', measures:{ Joule:1, Kilojoule:0.001, Caloria:0.239006, Kilocaloria:0.000239006, kWh:2.77778e-7 } },
  power: { base:'Watt', measures:{ Watt:1, Kilowatt:0.001, Horsepower:0.00134102 } },
  pressure: { base:'Pascal', measures:{ Pascal:1, kPa:0.001, Bar:1e-5, atm:9.86923e-6, psi:0.000145038 } },
  frequency: { base:'Hz', measures:{ Hz:1, kHz:0.001, MHz:1e-6, GHz:1e-9 } }
};

let currentCategory = 'length';
const history = [];

function init() {
  document.querySelectorAll('.tab-button').forEach(btn => btn.addEventListener('click', () => switchCategory(btn.dataset.category)));
  document.getElementById('convertBtn').addEventListener('click', convertUnits);
  document.getElementById('swapBtn').addEventListener('click', swapUnits);
  document.getElementById('precision').addEventListener('change', convertUnits);
  switchCategory('length');
}

function populateUnits(category) {
  const { measures } = units[category];
  ['unitFrom','unitTo'].forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = '';
    Object.keys(measures).forEach(u => {
      const opt = document.createElement('option');
      opt.value = u;
      opt.text = u;
      sel.appendChild(opt);
    });
  });
}

function switchCategory(category) {
  document.getElementById("controlloNascosti").classList.add("visible");
  currentCategory = category;
  populateUnits(category);
  document.querySelectorAll('.tab-button').forEach(b => b.classList.toggle('active', b.dataset.category === category));
  document.getElementById('result').innerText = '';
  clearError();

}

function swapUnits() {
  const from = document.getElementById('unitFrom');
  const to = document.getElementById('unitTo');
  [from.value, to.value] = [to.value, from.value];
}

function convertUnits() {
  const v = parseFloat(document.getElementById('inputValue').value);
  const f = document.getElementById('unitFrom').value;
  const t = document.getElementById('unitTo').value;
  const p = parseInt(document.getElementById('precision').value);
  if (isNaN(v)) { showError('Inserisci un numero valido'); return; }
  clearError();
  let res;
  if (currentCategory === 'temperature') {
    res = convertTemperature(v, f, t);
  } else {
    const m = units[currentCategory].measures;
    res = v * (m[t] / m[f]);
  }
  document.getElementById('result').innerText = `Risultato: ${res.toFixed(p)}`;
  addHistory({ category: currentCategory, value: v, from: f, to: t, cifre: p, result: res });
  document.getElementById("history").classList.add("visible");

}

function convertTemperature(val, from, to) {
  let c;
  switch (from) {
    case 'Fahrenheit': c = (val - 32) * 5/9; break;
    case 'Kelvin': c = val - 273.15; break;
    case 'Rankine': c = (val - 491.67) * 5/9; break;
    default: c = val;
  }
  switch (to) {
    case 'Fahrenheit': return (c * 9/5) + 32;
    case 'Kelvin':     return c + 273.15;
    case 'Rankine':    return (c + 273.15) * 9/5;
    default:           return c;
  }
}

function showError(msg) {
  const e = document.getElementById('error'); e.innerText = msg; e.style.display = 'block';
}
function clearError() {
  document.getElementById('error').style.display = 'none';
}

function addHistory(e) {
  history.push(e);
  localStorage.setItem('convHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList'); list.innerHTML = '';
  history.slice(-5).reverse().forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.value} ${e.from} → ${e.result.toFixed(e.cifre)} ${e.to}`;
    list.appendChild(li);
  });
}

function exportHistory() {
  const csv = history.map(e => `${e.category},${e.value},${e.from},${e.result},${e.to}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'history.csv'; a.click();
}