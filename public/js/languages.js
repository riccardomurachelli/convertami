/**
 * languages.js
 * Gestione lingue, traduzione tramite Google Translate API gratuita,
 * swap, cronologia ed esportazione CSV per Convertami
 */

// 1. Lista lingue supportate (codice: nome)
const LANGUAGES = {
    af: "Afrikaans",
    sq: "Albanese",
    am: "Amarico",
    ar: "Arabo",
    hy: "Armeno",
    az: "Azero",
    eu: "Basco",
    be: "Bielorusso",
    bn: "Bengalese",
    bs: "Bosniaco",
    bg: "Bulgaro",
    ca: "Catalano",
    ceb: "Cebuano",
    ny: "Chichewa",
    zh: "Cinese (Semplificato)",
    "zh-CN": "Cinese (Semplificato)",
    "zh-TW": "Cinese (Tradizionale)",
    co: "Corso",
    hr: "Croato",
    cs: "Ceco",
    da: "Danese",
    nl: "Olandese",
    en: "Inglese",
    eo: "Esperanto",
    et: "Estone",
    fi: "Finlandese",
    fr: "Francese",
    fy: "Frisone",
    gl: "Galiziano",
    ka: "Georgiano",
    de: "Tedesco",
    el: "Greco",
    gu: "Gujarati",
    ht: "Creolo haitiano",
    ha: "Hausa",
    haw: "Hawaiano",
    he: "Ebraico",
    iw: "Ebraico (vecchio codice)",
    hi: "Hindi",
    hmn: "Hmong",
    hu: "Ungherese",
    is: "Islandese",
    ig: "Igbo",
    id: "Indonesiano",
    ga: "Irlandese",
    it: "Italiano",
    ja: "Giapponese",
    jw: "Giavanese",
    kn: "Kannada",
    kk: "Kazako",
    km: "Khmer",
    rw: "Kinyarwanda",
    ko: "Coreano",
    ku: "Curdo (Kurmanji)",
    ky: "Kirghiso",
    lo: "Lao",
    la: "Latino",
    lv: "Lettone",
    lt: "Lituano",
    lb: "Lussemburghese",
    mk: "Macedone",
    mg: "Malgascio",
    ms: "Malese",
    ml: "Malayalam",
    mt: "Maltese",
    mi: "Maori",
    mr: "Marathi",
    mn: "Mongolo",
    my: "Birmano",
    ne: "Nepalese",
    no: "Norvegese",
    or: "Odia",
    ps: "Pashtu",
    fa: "Persiano",
    pl: "Polacco",
    pt: "Portoghese",
    pa: "Punjabi",
    ro: "Romeno",
    ru: "Russo",
    sm: "Samoano",
    gd: "Gaelico scozzese",
    sr: "Serbo",
    st: "Sesotho",
    sn: "Shona",
    sd: "Sindhi",
    si: "Singalese",
    sk: "Slovacco",
    sl: "Sloveno",
    so: "Somalo",
    es: "Spagnolo",
    su: "Sundanese",
    sw: "Swahili",
    sv: "Svedese",
    tl: "Tagalog (Filippino)",
    tg: "Tagico",
    ta: "Tamil",
    tt: "Tataro",
    te: "Telugu",
    th: "Thailandese",
    tr: "Turco",
    tk: "Turkmeno",
    uk: "Ucraino",
    ur: "Urdu",
    ug: "Uiguro",
    uz: "Uzbeko",
    vi: "Vietnamita",
    cy: "Gallese",
    xh: "Xhosa",
    yi: "Yiddish",
    yo: "Yoruba",
    zu: "Zulu"
};

// 2. Popola i <select> delle lingue al caricamento della pagina
function populateLanguageSelects() {
    const sourceSelect = document.getElementById('sourceLang');
    const targetSelect = document.getElementById('targetLang');
    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';

    Object.entries(LANGUAGES).forEach(([code, name]) => {
        const opt1 = document.createElement('option');
        opt1.value = code;
        opt1.textContent = name;
        sourceSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = code;
        opt2.textContent = name;
        targetSelect.appendChild(opt2);
    });

    // Valori di default: da Italiano a Inglese
    sourceSelect.value = 'it';
    targetSelect.value = 'en';
}

// 3. Inverte le lingue selezionate
function swapLanguages() {
    const sourceSelect = document.getElementById('sourceLang');
    const targetSelect = document.getElementById('targetLang');
    const tmp = sourceSelect.value;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = tmp;
}

// 4. Funzioni di gestione errori
function showError(msg) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
}

function hideError() {
    const errorDiv = document.getElementById('error');
    errorDiv.style.display = 'none';
}

// 5. Funzione principale per tradurre il testo con Google Translate
async function translateText() {
    hideError();
    const input = document.getElementById('inputText').value.trim();
    const from = document.getElementById('sourceLang').value;
    const to = document.getElementById('targetLang').value;
    const output = document.getElementById('outputText');

    // 5.1 Validazioni di base
    if (!input) {
        showError('Inserisci un testo da tradurre.');
        return;
    }
    if (from === to) {
        showError('Seleziona due lingue diverse.');
        return;
    }

    // 5.2 Messaggio provvisorio
    output.value = 'Traduzione in corso...';

    try {
        // Costruisco l’URL per Google Translate API gratuita
        // NB: il testo deve essere URI-encoded
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx` +
                    `&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(input)}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Errore API: ${response.status}`);
        }

        const data = await response.json();
        // Il JSON ha struttura simile a:
        // [
        //   [ ["testo tradotto parte1", "testo originale parte1", ...],
        //     ["testo tradotto parte2", "testo originale parte2", ...],
        //     ...
        //   ],
        //   null, "en", ...
        // ]
        // Quindi estraggo ogni sottosegmento [i][0] e lo concateno
        const segments = data[0];
        let translated = "";
        for (let i = 0; i < segments.length; i++) {
            translated += segments[i][0];
        }

        output.value = translated;
        addToHistory(input, translated, from, to);

    } catch (e) {
        output.value = '';
        console.error("Errore durante la chiamata a Google Translate:", e);
        showError('Impossibile completare la traduzione. Riprova più tardi.');
    }
}

// 6. Gestione cronologia traduzioni (max 5 voci)
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('convertami_history')) || [];
    } catch {
        return [];
    }
}

function setHistory(history) {
    localStorage.setItem('convertami_history', JSON.stringify(history));
}

function addToHistory(input, output, from, to) {
    let history = getHistory();
    history.unshift({
        input,
        output,
        from,
        to,
        date: new Date().toISOString()
    });
    if (history.length > 5) {
        history = history.slice(0, 5);
    }
    setHistory(history);
    renderHistory();
}

// 7. Renderizza la lista cronologia a schermo
function renderHistory() {
    const list = document.getElementById('historyList');
    const history = getHistory();
    list.innerHTML = '';

    if (history.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Nessuna traduzione recente.';
        list.appendChild(li);
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${LANGUAGES[item.from]} → ${LANGUAGES[item.to]}</strong>: 
            <span class="history-input">${item.input}</span> 
            <span class="history-arrow">→</span> 
            <span class="history-output">${item.output}</span>`;
        list.appendChild(li);
    });
}

// 8. Esporta cronologia in CSV
function exportHistory() {
    const history = getHistory();
    if (!history.length) return;

    // Creo l’array di righe (prima riga: header)
    const rows = [
        ['Data', 'Lingua di partenza', 'Lingua di destinazione', 'Testo originale', 'Traduzione']
    ];
    history.forEach(item => {
        rows.push([
            new Date(item.date).toLocaleString(),
            LANGUAGES[item.from],
            LANGUAGES[item.to],
            item.input.replace(/\n/g, ' '),
            item.output.replace(/\n/g, ' ')
        ]);
    });

    // Converto in CSV (gestendo le virgolette)
    const csv = rows
      .map(r => r.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    // Blob e download del file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'convertami_cronologia.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 9. Inizializzazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
    populateLanguageSelects();
    renderHistory();

    // Associo gli eventi ai pulsanti
    document.getElementById('swapBtn').addEventListener('click', swapLanguages);
    document.getElementById('translateBtn').addEventListener('click', translateText);
    document.getElementById('exportBtn').addEventListener('click', exportHistory);
});
