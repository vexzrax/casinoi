// Utilidad para mostrar y cerrar el modal de juegos
function showGame(game) {
  const modal = document.getElementById('game-modal');
  const content = document.getElementById('modal-content');
  modal.classList.remove('hidden');
  switch (game) {
    case 'ruleta':
      content.innerHTML = ruletaHTML();
      setTimeout(initRuleta, 100); // Esperar a que se añadan elementos
      break;
    case 'slot':
      content.innerHTML = slotHTML();
      setTimeout(initSlot, 100);
      break;
    case 'premios':
      content.innerHTML = premiosHTML();
      setTimeout(initPremios, 100);
      break;
    case 'imaginario':
      content.innerHTML = imaginarioHTML();
      setTimeout(initImaginario, 100);
      break;
  }
}

function closeModal() {
  document.getElementById('game-modal').classList.add('hidden');
  document.getElementById('modal-content').innerHTML = "";
}

// =================== JUEGO 1: RULETA ===================
function ruletaHTML() {
  return `
    <h2>Ruleta Clásica</h2>
    <canvas id="ruleta-canvas" width="320" height="320" style="margin-bottom:1rem;border-radius:50%;background:#fff0;"></canvas>
    <div>
      <label for="ruleta-apuesta">Tu apuesta (número 0-36): </label>
      <input id="ruleta-apuesta" type="number" min="0" max="36" value="7" style="width:55px;">
      <button onclick="girarRuleta()">Girar</button>
    </div>
    <div id="ruleta-resultado" style="margin-top:1rem;font-size:1.1rem;"></div>
  `;
}

function initRuleta() {
  drawRuleta();
}

function drawRuleta() {
  const canvas = document.getElementById('ruleta-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 135;
  const n = 37;
  const colores = ['#fff', '#222']; // blanco y negro alternados
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + (2 * Math.PI / n));
    ctx.closePath();
    ctx.fillStyle = (i === 0) ? '#22a' : colores[i % 2];
    ctx.fill();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + Math.PI / n);
    ctx.font = "bold 13px Helvetica";
    ctx.fillStyle = (i === 0) ? "#fff" : "#b9003c";
    ctx.textShadow = "0 0 7px #fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i, radius - 28, 0);
    ctx.restore();
  }
  // Dibuja el puntero
  ctx.save();
  ctx.translate(cx, cy - radius - 10);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(17, 0);
  ctx.lineTo(8.5, 17);
  ctx.closePath();
  ctx.fillStyle = "#e6004d";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function girarRuleta() {
  const apuesta = parseInt(document.getElementById('ruleta-apuesta').value);
  if (isNaN(apuesta) || apuesta < 0 || apuesta > 36) {
    document.getElementById('ruleta-resultado').innerHTML = "<span style='color:#e6004d;'>Apuesta inválida.</span>";
    return;
  }
  // Animación de giro
  const canvas = document.getElementById('ruleta-canvas');
  const ctx = canvas.getContext('2d');
  const n = 37;
  const duration = 2200;
  let start = null;
  let rotation = Math.random() * Math.PI * 2;
  let finalNum = Math.floor(Math.random() * n);
  let finalAngle = (finalNum / n) * 2 * Math.PI;

  function animateRuleta(ts) {
    if (!start) start = ts;
    let progress = Math.min((ts - start) / duration, 1);
    let rot = rotation + progress * (Math.PI * 8 + finalAngle - rotation);
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rot);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawRuleta();
    ctx.restore();
    if (progress < 1) {
      requestAnimationFrame(animateRuleta);
    } else {
      if (apuesta === finalNum) {
        document.getElementById('ruleta-resultado').innerHTML = 
          `<span style="color:#fff;text-shadow:0 1px 7px #fff;font-weight:bold;">¡Ganaste! El número fue ${finalNum}</span>`;
      } else {
        document.getElementById('ruleta-resultado').innerHTML = 
          `<span style="color:#e6004d;">Perdiste, salió el ${finalNum}</span>`;
      }
    }
  }
  requestAnimationFrame(animateRuleta);
}

// =================== JUEGO 2: TRAGAMONEDAS ===================
function slotHTML() {
  return `
    <h2>Tragamonedas Moderno</h2>
    <div id="slot-machine" style="margin-bottom:1.5rem;">
      <div id="slot-reels" style="display:flex;justify-content:center;gap:1.2rem;">
        <div class="reel"><span id="r0">🍒</span></div>
        <div class="reel"><span id="r1">🍋</span></div>
        <div class="reel"><span id="r2">🔔</span></div>
      </div>
    </div>
    <button onclick="tirarSlot()">Tirar Palanca</button>
    <div id="slot-resultado" style="margin-top:1rem;font-size:1.1rem;"></div>
  `;
}

function initSlot() {
  // Nada especial, los reels se actualizan al girar
}

const slotSymbols = ["🍒","🍋","🔔","💎","🍀","🍉","⭐"];

function tirarSlot() {
  const reels = [0,1,2].map(i => document.getElementById('r'+i));
  let resultado = [];
  let spins = 12;
  let delay = 80;
  let current = 0;
  let interval = setInterval(() => {
    for (let i=0;i<3;i++) {
      let sym = slotSymbols[Math.floor(Math.random()*slotSymbols.length)];
      reels[i].textContent = sym;
      resultado[i] = sym;
    }
    current++;
    if (current === spins) {
      clearInterval(interval);
      slotPremio(resultado);
    }
  }, delay);
}

function slotPremio(resultado) {
  const res = document.getElementById('slot-resultado');
  if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
    res.innerHTML = `<span style="color:#fff;text-shadow:0 2px 9px #fff;font-weight:bold;">¡Jackpot! ${resultado[0]} ${resultado[1]} ${resultado[2]}</span>`;
  } else if (resultado[0] === resultado[1] || resultado[1] === resultado[2] || resultado[0] === resultado[2]) {
    res.innerHTML = `<span style="color:#fff;text-shadow:0 1px 7px #fff;">Premio menor: ${resultado.join(' ')}</span>`;
  } else {
    res.innerHTML = `<span style="color:#e6004d;">Sin premio: ${resultado.join(' ')}</span>`;
  }
}

// =================== JUEGO 3: RULETA DE PREMIOS ===================
function premiosHTML() {
  return `
    <h2>Ruleta de Premios</h2>
    <canvas id="premios-canvas" width="320" height="320" style="margin-bottom:1rem;border-radius:50%;background:#fff0;"></canvas>
    <button onclick="girarPremios()">Girar Ruleta</button>
    <div id="premios-resultado" style="margin-top:1rem;font-size:1.1rem;"></div>
  `;
}

const premios = [
  {label:"100 monedas", color:"#ffe600"},
  {label:"Suerte extra", color:"#00e68a"},
  {label:"Nada", color:"#e6004d"},
  {label:"200 monedas", color:"#00c0ff"},
  {label:"Premio misterioso", color:"#b9003c"},
  {label:"Multiplica x2", color:"#b2ff2b"},
  {label:"Nada", color:"#e6004d"},
  {label:"300 monedas", color:"#ff9500"}
];

function initPremios() {
  drawPremios(0);
}

function drawPremios(offset=0) {
  const canvas = document.getElementById('premios-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 120;
  const n = premios.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < n; i++) {
    const angle = ((i + offset) / n) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + (2 * Math.PI / n));
    ctx.closePath();
    ctx.fillStyle = premios[i].color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + Math.PI / n);
    ctx.font = "bold 13px Helvetica";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(premios[i].label, radius - 22, 0);
    ctx.restore();
  }
  // Dibuja el puntero
  ctx.save();
  ctx.translate(cx, cy - radius - 10);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(17, 0);
  ctx.lineTo(8.5, 17);
  ctx.closePath();
  ctx.fillStyle = "#e6004d";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function girarPremios() {
  const n = premios.length;
  const duration = 1900;
  let start = null;
  let rotation = Math.random() * Math.PI * 2;
  let finalNum = Math.floor(Math.random() * n);
  let finalAngle = (finalNum / n) * 2 * Math.PI;

  function animatePremios(ts) {
    if (!start) start = ts;
    let progress = Math.min((ts - start) / duration, 1);
    let rot = rotation + progress * (Math.PI * 6 + finalAngle - rotation);
    drawPremios(rot * n / (2*Math.PI));
    if (progress < 1) {
      requestAnimationFrame(animatePremios);
    } else {
      document.getElementById('premios-resultado').innerHTML =
        `<span style="color:#fff;text-shadow:0 1px 7px #fff;font-weight:bold;">${premios[finalNum].label}</span>`;
    }
  }
  requestAnimationFrame(animatePremios);
}

// =================== JUEGO 4: DADO ELEMENTAL ===================
function imaginarioHTML() {
  return `
    <h2>Dado Elemental</h2>
    <div style="font-size:4rem;margin-bottom:0.7rem;" id="dado-display">⚡</div>
    <button onclick="lanzarDado()">Lanzar dado mágico</button>
    <div id="dado-resultado" style="margin-top:1rem;font-size:1.1rem;"></div>
    <div style="margin-top:2rem;font-size:1rem;">
      <b>Elementos:</b> <span style="color:#ffe600">☀️ Fuego</span>
      <span style="color:#00c0ff">💧 Agua</span>
      <span style="color:#b2ff2b">🍃 Aire</span>
      <span style="color:#e6004d">🌑 Oscuridad</span>
      <span style="color:#ffa500">⚡ Relámpago</span>
      <span style="color:#b9003c">🪨 Tierra</span>
    </div>
  `;
}

const elementos = [
  {icon:"☀️", nombre:"Fuego", color:"#ffe600", desc:"Te llenas de energía ardiente."},
  {icon:"💧", nombre:"Agua", color:"#00c0ff", desc:"La suerte fluye a tu favor."},
  {icon:"🍃", nombre:"Aire", color:"#b2ff2b", desc:"La fortuna sopla suavemente."},
  {icon:"🌑", nombre:"Oscuridad", color:"#e6004d", desc:"Un misterio envuelve tu destino."},
  {icon:"⚡", nombre:"Relámpago", color:"#ffa500", desc:"El azar te electrifica."},
  {icon:"🪨", nombre:"Tierra", color:"#b9003c", desc:"La estabilidad te acompaña."}
];

function initImaginario() { /* nada especial */ }

function lanzarDado() {
  const dado = document.getElementById('dado-display');
  const res = document.getElementById('dado-resultado');
  let tiradas = 18;
  let delay = 50;
  let current = 0;
  let interval = setInterval(() => {
    let el = elementos[Math.floor(Math.random()*elementos.length)];
    dado.textContent = el.icon;
    dado.style.color = el.color;
    current++;
    if (current===tiradas) {
      clearInterval(interval);
      let final = elementos[Math.floor(Math.random()*elementos.length)];
      dado.textContent = final.icon;
      dado.style.color = final.color;
      res.innerHTML = `<span style="color:${final.color};text-shadow:0 1px 7px #fff;font-weight:bold;">${final.nombre}: ${final.desc}</span>`;
    }
  }, delay);
}