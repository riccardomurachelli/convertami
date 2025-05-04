// TODO: controllare tutti i file che funzionino, da pdf a pptx non va
// Drag and drop handlers
const dropZone = document.getElementById('dropZone');

['dragover', 'dragenter'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
});

['dragleave', 'dragend'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(files[0]);
    document.getElementById('fileInput').files = dataTransfer.files;
    
    // Trigger change event
    const event = new Event('change');
    document.getElementById('fileInput').dispatchEvent(event);
  }
});

// Click handler
document.querySelector('.upload-content').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

const formatOptions = {
  image: {
    label: "Formati Immagine",
    formats: ["png", "jpg", "webp", "gif"]
  },
  audio: {
    label: "Formati Audio",
    formats: ["mp3", "wav", "aac", "flac", "ogg"]
  },
  video: {
    label: "Formati Video",
    formats: ["mp4", "avi", "mkv", "mov", "wmv"]
  },
  doc: {
    label: "Formati Documenti",
    formats: ["pdf", "docx", "txt", "odt", "xlsx", "pptx"]
  }
};

function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');
}

function updateProgress(percentage, status) {
  const fill = document.querySelector('.progress-fill');
  const text = document.querySelector('.progress-text');
  const statusElem = document.querySelector('.progress-status');
  
  fill.style.width = `${percentage}%`;
  text.textContent = `${Math.round(percentage)}%`;
  statusElem.textContent = status;
}

function populateFormats(fileExt) {
  const category = getFileCategory(fileExt);
  const { label, formats } = formatOptions[category];
  const filteredFormats = formats.filter(f => f !== fileExt);
  
  const select = document.getElementById('targetFormat');
  select.innerHTML = `<option value="" disabled selected>Seleziona formato</option>`;
  
  filteredFormats.forEach(format => {
    const option = document.createElement('option');
    option.value = format;
    option.textContent = format.toUpperCase();
    select.appendChild(option);
  });
}

function getFileCategory(ext) {
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image';
  if (['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return 'audio';
  if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(ext)) return 'video';
  return 'doc';
}

function convertFile() {
  const fileInput = document.getElementById('fileInput');
  const targetFormat = document.getElementById('targetFormat').value;
  const file = fileInput.files[0];
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (!targetFormat) {
    alert('Seleziona un formato di conversione');
    return;
  }

  showStep(3);
  updateProgress(0, 'Inizio conversione...');

  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);

  xhr.upload.addEventListener('progress', e => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 50;
      updateProgress(percent, 'Caricamento file...');
    }
  });

  xhr.addEventListener('progress', e => {
    if (e.lengthComputable) {
      const percent = 50 + (e.loaded / e.total) * 50;
      updateProgress(percent, 'Conversione in corso...');
    }
  });

  xhr.responseType = 'blob';
  xhr.open('POST', `/api/convert/${getFileCategory(ext)}`, true);

  xhr.onload = function() {
    if (xhr.status === 200) {
      updateProgress(100, 'Conversione completata!');
      const blob = xhr.response;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showStep(1);
      }, 1000);
    } else {
      throw new Error('Conversione fallita');
    }
  };

  xhr.onerror = function() {
    alert('Errore durante la conversione');
    showStep(2);
  };

  xhr.send(formData);
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  
  // Carica il contatore
  fetch('/api/stats')
    .then(response => response.json())
    .then(data => {
      document.getElementById('conversionCount').textContent = data.total;
    })
    .catch(() => console.log('Errore nel caricamento delle statistiche'));

  fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
      const ext = this.files[0].name.split('.').pop().toLowerCase();
      populateFormats(ext);
      showStep(2);
    }
  });
});