function navigateTo(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

const canvas = document.querySelector(".visualizer");
const ctx = canvas.getContext("2d");

function playTrack(url, title) {
  playTrack("assets/audio/tuCancion.mp3", "Nombre de la canción");


  const audio = new Audio(url);
  audio.crossOrigin = "anonymous";
  audio.play();
  triggerCelebration();

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctxCelebrate.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);


  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
      const h = dataArray[i];
      ctx.fillStyle = `hsl(${i * 10}, 100%, 50%)`;
      ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
    }

    drawFooterVisualizer(dataArray);
  }

  animate();
}

// 🎉 Modo Fiesta
const celebrationCanvas = document.getElementById("celebration-canvas");
const ctxCelebrate = celebrationCanvas.getContext("2d");
celebrationCanvas.width = window.innerWidth;
celebrationCanvas.height = window.innerHeight;

let particles = [];

function triggerCelebration() {
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: celebrationCanvas.width / 2,
      y: celebrationCanvas.height / 2,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * 8,
      speedY: (Math.random() - 0.5) * 8,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      life: 100
    });
  }
}

function animateCelebration() {
  ctxCelebrate.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
  requestAnimationFrame(animateCelebration);
  ctxCelebrate.fillStyle = "rgba(0,0,0,0.1)";
  ctxCelebrate.fillRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

  particles.forEach((p, index) => {
    ctxCelebrate.beginPath();
    ctxCelebrate.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctxCelebrate.fillStyle = p.color;
    ctxCelebrate.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    if (p.life <= 0) particles.splice(index, 1);
  });
}
animateCelebration();

// Visualizer del player inferior
const footerCanvas = document.getElementById("footerVisualizer");
const footerCtx = footerCanvas.getContext("2d");

function drawFooterVisualizer(dataArray) {
  const width = footerCanvas.width;
  const height = footerCanvas.height;
  footerCtx.clearRect(0, 0, width, height);

  const barWidth = width / dataArray.length;
  for (let i = 0; i < dataArray.length; i++) {
    const h = dataArray[i] / 2;
    footerCtx.fillStyle = `rgb(0,255,255)`;
    footerCtx.fillRect(i * barWidth, height - h, barWidth - 1, h);
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

document.getElementById("createForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("playlistName").value;
  const theme = document.getElementById("playlistTheme").value;
  const audioFile = document.getElementById("audioFile").files[0];
  const coverFile = document.getElementById("coverFile").files[0];

  if (!audioFile || !coverFile) return alert("Faltan archivos");

  const audioURL = URL.createObjectURL(audioFile);
  const imgURL = URL.createObjectURL(coverFile);

  const playlist = document.createElement("div");
  playlist.className = `playlist ${theme}`;
  playlist.innerHTML = `
    <h3>${name}</h3>
    <div class="track-card" onclick="playTrack('${audioURL}', '${name}')">
      <img src="${imgURL}" alt="Portada" width="100" />
      <canvas class="visualizer" width="250" height="60"></canvas>
      <div class="info">
        <h4>${name}</h4>
      </div>
    </div>
  `;

  document.getElementById("library").appendChild(playlist);
  document.getElementById("createForm").reset();
  {
  e.preventDefault();

  const name = document.getElementById("playlistName").value;
  const theme = document.getElementById("playlistTheme").value;
  const audioURL = document.getElementById("audioSelect").value;
  const coverFile = document.getElementById("coverFile").files[0];

  if (!audioFile || !coverFile) return alert("Faltan archivos");
  const imgURL = URL.createObjectURL(coverFile);

  const playlistData = {
    name,
    theme,
    audioName: audioFile.name,
    coverName: coverFile.name
  };

  // Guardar en localStorage
  const existing = JSON.parse(localStorage.getItem("playlists") || "[]");
  existing.push(playlistData);
  localStorage.setItem("playlists", JSON.stringify(existing));

  renderPlaylist(audioURL, imgURL, name, theme);
  document.getElementById("createForm").reset();
  const style = document.getElementById("visualizerStyle").value;
}

function resetPlaylists() {
  localStorage.removeItem("playlists");
  location.reload();
}
function initCircularVisualizer(audioElement, canvasSelector) {
  const canvas = document.querySelector(canvasSelector);
  const ctx = canvas.getContext("2d");
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 60;

    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 2;
      const length = dataArray[i] * 0.6;
      const x = cx + Math.cos(angle) * (radius + length);
      const y = cy + Math.sin(angle) * (radius + length);
      const hue = (i * 360) / bufferLength;
      ctx.strokeStyle = `hsl(${hue},100%,60%)`;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
  draw();
}
});
let currentAudio = null;
let animationId = null;
let audioCtx, analyser, source;

function toggleAudio(button, src) {
  const trackCard = button.closest(".track-card");
  const canvas = trackCard.querySelector(".visualizer");
  const ctx = canvas.getContext("2d");
  const style = trackCard.getAttribute("data-style") || "bars";


  // Si es la misma canción y está sonando → pausa
  if (currentAudio && !currentAudio.paused && currentAudio.src.includes(src)) {
    currentAudio.pause();
    button.textContent = "▶️ Reproducir";
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // Detener la anterior
  if (currentAudio) {
    currentAudio.pause();
    cancelAnimationFrame(animationId);
    document.querySelectorAll(".track-card button").forEach(btn => {
      btn.textContent = "▶️ Pausa";
    });
    document.querySelectorAll(".visualizer").forEach(c => {
      const cctx = c.getContext("2d");
      cctx.clearRect(0, 0, c.width, c.height);
      const progress = trackCard.querySelector("progress");
const timeDisplay = trackCard.querySelector(".time-display");

currentAudio.addEventListener("loadedmetadata", () => {
  const duration = currentAudio.duration;
  timeDisplay.textContent = `00:00 / ${formatTime(duration)}`;
});

currentAudio.ontimeupdate = () => {
  const current = currentAudio.currentTime;
  const duration = currentAudio.duration;
  progress.value = (current / duration) * 100;
  timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
};

    });
  }

  currentAudio = new Audio(src);
  currentAudio.crossOrigin = "anonymous";
  currentAudio.play();
  button.textContent = "▶️ Reproducir";

  // Setup Web Audio
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source = audioCtx.createMediaElementSource(currentAudio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

 function animate() {
  animationId = requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (style === "circle") {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 40;
    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * 2 * Math.PI;
      const length = dataArray[i] * 0.4;
      const x = cx + Math.cos(angle) * (radius + length);
      const y = cy + Math.sin(angle) * (radius + length);
      const hue = (i * 360) / bufferLength;
      ctx.strokeStyle = `hsl(${hue},100%,60%)`;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  } else {
    // barras por defecto
    const barWidth = canvas.width / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];
      const barHeight = value * 0.6;
      const x = i * barWidth;
      ctx.fillStyle = `hsl(${i * 5}, 100%, 60%)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
    }
  }
}


  animate();

  currentAudio.onended = () => {
    button.textContent = "⏸️ Pausar";
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
function pauseAudio() {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio = new Audio(src);


    // Cambiar el texto del botón activo a “Reproducir”
    document.querySelectorAll(".track-card button").forEach(btn => {
      if (btn.classList.contains("playing")) {
        btn.textContent = "⏸️ Pausar";
        btn.classList.remove("playing", "synthwave", "lofi", "trap");
        card.setAttribute("data-style", style);
      }
    });

    // Opcional: detener visualizador también
    cancelAnimationFrame(animationId);
    document.querySelectorAll(".visualizer").forEach(c => {
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
    });
  }
}

document.getElementById("createForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("playlistName").value;
  const theme = document.getElementById("playlistTheme").value;
  const audioURL = document.getElementById("audioSelect").value;
  const defaultCover = getCoverForTheme(theme);
  function getCoverForTheme(theme) {
  switch (theme) {
    case "synthwave": return "Images/Synthwave.png";
    case "lofi": return "assets/img/portada-lofi.jpg";
    case "trap": return "assets/img/portada-trap.jpg";
    case "electronica": return "Images/logo.png";
    case "regueton": return "Images/logo.png";
    case "cumbia": return "Images/logo.png";
    default: return "Images/logo.png";
  }
}


  if (!audioURL || !theme || !name) {
    alert("Por favor completa todos los campos.");
    return;
  }

  renderPlaylist(audioURL, defaultCover, name, theme);
  this.reset();
});
function getCoverForTheme(theme) {
  switch (theme) {
    case "synthwave": return "Images/Synthwave.png";
    case "lofi": return "assets/img/portada-lofi.jpg";
    case "trap": return "assets/img/portada-trap.jpg";
    default: return "Images/logo.png";
  }
}

function renderPlaylist(audioURL, imgURL, name, theme) {
  const card = document.createElement("div");
  card.className = "track-card";
  card.innerHTML = `
    <img src="${imgURL}" alt="Portada" width="100" />
    <canvas class="visualizer" width="250" height="60"></canvas>
    <div class="info">
      <h4>${name}</h4>
      <button onclick="toggleAudio(this, '${audioURL}')">▶️ Reproducir</button>
      <button onclick="pauseAudio()">⏸️ Pausar Canción</button>
    </div>
  `;

  const target = document.querySelector(`#library .playlist.${theme}`);
  if (target) {
    target.appendChild(card);
  } else {
    const wrapper = document.createElement("div");
    wrapper.className = `playlist ${theme}`;
    wrapper.innerHTML = `<h3>${name}</h3>`;
    wrapper.appendChild(card);
    document.querySelector("#library").appendChild(wrapper);
  }
}
function renderPlaylist(audioURL, imgURL, name, theme) {
  const trackCard = document.createElement("div");
  trackCard.className = "track-card";
  trackCard.innerHTML = `
    <img src="${imgURL}" alt="Portada" width="100" />
    <canvas class="visualizer" width="250" height="60"></canvas>
    <div class="info">
      <h4>${name}</h4>
      <button onclick="toggleAudio(this, '${audioURL}')">▶️ Reproducir</button>
      <button onclick="pauseAudio()">⏸️ Pausar Canción</button>
    </div>
  `;
  const target = document.querySelector(`#library .playlist.${theme}`);
  target?.appendChild(trackCard);
}

function getCoverForTheme(theme) {
  switch (theme) {
    case "synthwave": return "Images/Synthwave.png";
    case "lofi": return "assets/img/portada-lofi.jpg";
    case "trap": return "assets/img/portada-trap.jpg";
    default: return "Images/logo.png";
  }
}

function renderPlaylist(audioURL, coverURL, name, theme) {
  const trackCard = document.createElement("div");
  trackCard.className = "track-card";
trackCard.innerHTML = `
  <img src="${coverURL}" alt="Portada" width="100" />
  <canvas class="visualizer" width="250" height="60"></canvas>
  <div class="info">
    <h4>${name}</h4>
    <button onclick="toggleAudio(this, '${audioURL}')">▶️ Reproducir</button>
    <button onclick="pauseAudio()">⏸️ Pausar Canción</button>
    <div class="player-info">
      <progress value="0" max="100"></progress>
      <span class="time-display">00:00 / 00:00</span>
    </div>
  </div>
`;


  const target = document.querySelector(`#library .playlist.${theme}`);
  if (target) {
    target.appendChild(trackCard);
  } else {
    const wrapper = document.createElement("div");
    wrapper.className = `playlist ${theme}`;
    wrapper.innerHTML = `<h3>${name}</h3>`;
    wrapper.appendChild(trackCard);
    document.querySelector("#library").appendChild(wrapper);
  }
}

function setVolume(slider) {
  if (currentAudio) {
    currentAudio.volume = slider.value;
  }
}
function filtrarCatalogo(busqueda) {
  const query = busqueda.toLowerCase();
  const canciones = document.querySelectorAll("#catalogo-canciones .song-card");

  canciones.forEach(card => {
    const texto = card.innerText.toLowerCase();
    if (texto.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
function filtrarCatalogo(busqueda) {
  const query = busqueda.toLowerCase();
  const canciones = document.querySelectorAll("#catalogo-canciones .song-card");

  canciones.forEach(card => {
    const texto = card.innerText.toLowerCase();
    if (texto.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
const progress = trackCard.querySelector("progress");
const timeDisplay = trackCard.querySelector(".time-display");

currentAudio.addEventListener("loadedmetadata", () => {
  const duration = currentAudio.duration || 0;
  timeDisplay.textContent = `00:00 / ${formatTime(duration)}`;
});

currentAudio.ontimeupdate = () => {
  if (!currentAudio || !progress || !timeDisplay || isNaN(currentAudio.duration)) return;
  const current = currentAudio.currentTime;
  const duration = currentAudio.duration;
  progress.value = (current / duration) * 100;
  timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
};

document.getElementById("playlistTheme").addEventListener("change", function () {
  const selectedGenre = this.value;
  const audioSelect = document.getElementById("audioSelect");

  Array.from(audioSelect.options).forEach(option => {
    if (!option.className) return; // deja la opción inicial
    option.style.display = option.classList.contains(selectedGenre) ? "block" : "none";
  });

  audioSelect.value = "";
});

window.addEventListener("DOMContentLoaded", () => {
  const audioSelect = document.getElementById("audioSelect");
  Array.from(audioSelect.options).forEach(option => {
    if (option.className) option.style.display = "none";
  });
});

function activarBassBoost() {
  const src = "Music/Electronica/bass-boosted-special.mp3";
  const dummy = document.createElement("button");
  dummy.closest = () => {
    const div = document.querySelector(".seccion-bass"); // Asegúrate de tener una clase o ID aquí
    return div;
  };
  toggleAudio(dummy, src);
}
function activarBassBoost() {
  const src = "Music/Electronica/bass-boosted-special.mp3";
  const button = document.querySelector(".bass-boosted button");
  toggleAudio(button, src);
}
function activarBassBoost() {
  const audio = new Audio("Music/Akkira.mp3");
  audio.crossOrigin = "anonymous";
  audio.play();
  initBassVisualizer(audio);
}

function initBassVisualizer(audio) {
  const canvas = document.getElementById("canvasBass");
  const ctx = canvas.getContext("2d");

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  function draw() {
    bassVisualizerId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // núcleo circular
    const bass = dataArray[1];
    const radius = 50 + bass * 0.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${bass * 2}, ${255 - bass}, 255, 0.4)`;
    ctx.shadowColor = `rgba(0,255,255,0.5)`;
    ctx.shadowBlur = 30 + bass / 2;
    ctx.fill();

    // líneas de onda radial
    const totalLines = 32;
    for (let i = 0; i < totalLines; i++) {
      const angle = (i / totalLines) * Math.PI * 2;
      const length = bass * (0.6 + Math.sin(i + bass / 20));
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + length);
      const y2 = centerY + Math.sin(angle) * (radius + length);

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsl(${angle * 180 / Math.PI + bass}, 100%, 60%)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  draw();
}

let bassAudio = null;
let bassVisualizerId = null;

function activarBassBoost() {
  if (bassAudio) {
    bassAudio.pause();
    cancelAnimationFrame(bassVisualizerId);
  }

  bassAudio = new Audio("Music/Akkira.mp3");
  bassAudio.crossOrigin = "anonymous";
  bassAudio.play();
  initBassVisualizer(bassAudio);
}

function pausarBassBoost() {
  if (bassAudio) {
    bassAudio.pause();
    cancelAnimationFrame(bassVisualizerId);
  }
}
