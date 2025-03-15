function convertFile() {
  const fileInput = document.getElementById("fileInput");
  const targetFormat = document.getElementById("targetFormat").value;
  const file = fileInput.files[0];
  
  if (!file) {
    alert("Seleziona un file");
    return;
  }
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("targetFormat", targetFormat);
  
  fetch("/api/convertFile", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Conversione fallita");
    }
    return response.blob();
  })
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  })
  .catch(err => {
    alert(err.message);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const targetFormatSelect = document.getElementById("targetFormat");
  targetFormatSelect.innerHTML = "";
  
  const groups = [
    { label: "Immagini", formats: ["png", "jpg", "webp", "gif"] },
    { label: "Audio", formats: ["mp3", "wav", "aac", "flac", "ogg"] },
    { label: "Video", formats: ["mp4", "avi", "mkv", "mov", "wmv"] },
    { label: "Documenti", formats: ["pdf", "docx", "txt", "odt", "xlsx", "pptx"] }
  ];
  
  groups.forEach(group => {
    let optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    group.formats.forEach(fmt => {
      let option = document.createElement("option");
      option.value = fmt;
      option.text = fmt.toUpperCase();
      optgroup.appendChild(option);
    });
    targetFormatSelect.appendChild(optgroup);
  });
});
