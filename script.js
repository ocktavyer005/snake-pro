// ======================================
// SNAKE PRO v2.0
// PART 1
// Variabel, Menu, Kontrol, Start Game
// ======================================

// =======================
// ELEMENT HTML
// =======================

const splash = document.getElementById("splash");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const playBtn = document.getElementById("playBtn");
const highScoreBtn = document.getElementById("highScoreBtn");
const pauseBtn = document.getElementById("pauseBtn");
const difficulty = document.getElementById("difficulty");
const musicBtn = document.getElementById("musicBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const restartPauseBtn = document.getElementById("restartPauseBtn");
const menuPauseBtn = document.getElementById("menuPauseBtn");

const controls = document.getElementById("controls");

const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

const gameOverPanel = document.getElementById("gameOver");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =======================
// SOUND
// =======================

const clickSound = new Audio("assets/sounds/click.mp3");
const eatSound = new Audio("assets/sounds/eat.mp3");
const gameOverSound = new Audio("assets/sounds/gameover.mp3");

const bgm = new Audio("assets/sounds/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.4;
window.addEventListener("load", () => {
  
  if (musicOn) {
    
    musicBtn.innerText = "🔊 MUSIC ON";
    
  } else {
    
    musicBtn.innerText = "🔇 MUSIC OFF";
    
  }
  
});
// =======================
// KONSTANTA
// =======================

const GRID = 20;
const SIZE = 360;

// =======================
// VARIABEL GAME
// =======================

let snake = [];
let food = {};
let bonusFood = null;
let particles = [];

let direction = "RIGHT";

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
let leaderboard =
  JSON.parse(localStorage.getItem("leaderboard")) || [];

let loop = null;

let foodPulse = 0;
let bonusTimer = 0;

let gameSpeed = 150;

let isPaused = false;

let soundOn = true;
let wrapMode = true;
let snakeSkin = 0;

// Ambil pengaturan musik yang tersimpan
let musicOn = localStorage.getItem("musicOn");

if (musicOn === null) {
  
  musicOn = true;
  
} else {
  
  musicOn = musicOn === "true";
  
}

// =======================
// SPLASH SCREEN
// =======================

setTimeout(() => {
  
  splash.classList.add("hidden");
  
  menu.classList.remove("hidden");
  
}, 3000);

// =======================
// PLAY SOUND
// =======================

function playSound(sound) {
  
  if (!soundOn) return;
  
  sound.pause();
  sound.currentTime = 0;
  
  sound.play().catch(err => {
    console.log(err);
  });
  
}

// =======================
// TOMBOL PLAY
// =======================

playBtn.onclick = () => {
  
  playSound(clickSound);
  
  if (musicOn) {
  
  bgm.currentTime = 0;
  bgm.play().catch(() => {});
  
}
  
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  
  gameOverPanel.classList.add("hidden");
  
  controls.style.display = "block";
  
  gameSpeed = Number(difficulty.value);
  
  startGame();
  
};

// =======================
// HIGH SCORE
// =======================

highScoreBtn.onclick = () => {
  
  playSound(clickSound);
  
  alert(
    "🏆 HIGH SCORE\n\n" +
    highScore
  );
  
};

// =======================
// START GAME
// =======================

function startGame() {

  snake = [
    {
      x: 180,
      y: 180
    }
  ];

  direction = "RIGHT";

  score = 0;

  scoreText.textContent = score;

  foodPulse = 0;

  bonusFood = null;

  isPaused = false;

  pauseBtn.innerText = "⏸ PAUSE";

  createFood();

  clearInterval(loop);

  loop = setInterval(update, gameSpeed);

}

// =======================
// BUAT MAKANAN
// =======================

function createFood() {
  
  food = {
    
    x: Math.floor(Math.random() * 18) * GRID,
    
    y: Math.floor(Math.random() * 18) * GRID
    
  };
  
}

// =======================
// BONUS FOOD
// =======================

function createBonusFood() {
  
  bonusFood = {
    
    x: Math.floor(Math.random() * 18) * GRID,
    
    y: Math.floor(Math.random() * 18) * GRID
    
  };
  
  bonusTimer = 80;
  
}
// =======================
// PARTIKEL
// =======================

function createParticles(x, y, color) {
  
  for (let i = 0; i < 12; i++) {
    
    particles.push({
      
      x: x + GRID / 2,
      y: y + GRID / 2,
      
      dx: (Math.random() - 0.5) * 6,
      dy: (Math.random() - 0.5) * 6,
      
      life: 20,
      
      color: color
      
    });
    
  }
  
}

// =======================
// KEYBOARD
// =======================

document.addEventListener("keydown", (e) => {
  
  if (e.key === "ArrowUp" && direction != "DOWN")
    direction = "UP";
  
  if (e.key === "ArrowDown" && direction != "UP")
    direction = "DOWN";
  
  if (e.key === "ArrowLeft" && direction != "RIGHT")
    direction = "LEFT";
  
  if (e.key === "ArrowRight" && direction != "LEFT")
    direction = "RIGHT";
  
});

// =======================
// =======================
// KONTROL ANDROID
// =======================

document.getElementById("up").onclick = () => {
  
  if (direction != "DOWN")
    direction = "UP";
  
};

document.getElementById("down").onclick = () => {
  
  if (direction != "UP")
    direction = "DOWN";
  
};

document.getElementById("left").onclick = () => {
  
  if (direction != "RIGHT")
    direction = "LEFT";
  
};

document.getElementById("right").onclick = () => {
  
  if (direction != "LEFT")
    direction = "RIGHT";
  
};
// =======================
// SWIPE CONTROL (RESPONSIF)
// =======================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function(e) {
  
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  
}, { passive: true });

canvas.addEventListener("touchmove", function(e) {
  
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  
  const dx = x - touchStartX;
  const dy = y - touchStartY;
  
  // Sensitivitas (10 pixel)
  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
    return;
  }
  
  if (Math.abs(dx) > Math.abs(dy)) {
    
    if (dx > 0 && direction != "LEFT") {
      direction = "RIGHT";
    }
    
    if (dx < 0 && direction != "RIGHT") {
      direction = "LEFT";
    }
    
  } else {
    
    if (dy > 0 && direction != "UP") {
      direction = "DOWN";
    }
    
    if (dy < 0 && direction != "DOWN") {
      direction = "UP";
    }
    
  }
  
  // Reset titik awal agar swipe berikutnya lebih cepat
  touchStartX = x;
  touchStartY = y;
  
}, { passive: true });
// ======================================
// PART 2
// UPDATE GAME & GAME OVER
// ======================================

function update() {
  
  let headX = snake[0].x;
  let headY = snake[0].y;
  
  switch (direction) {
    
    case "UP":
      headY -= GRID;
      break;
      
    case "DOWN":
      headY += GRID;
      break;
      
    case "LEFT":
      headX -= GRID;
      break;
      
    case "RIGHT":
      headX += GRID;
      break;
      
  }
  
  // ==========================
// WRAP MODE / TABRAK DINDING
// ==========================

if (wrapMode) {
  
  if (headX < 0) headX = SIZE - GRID;
  if (headX >= SIZE) headX = 0;
  
  if (headY < 0) headY = SIZE - GRID;
  if (headY >= SIZE) headY = 0;
  
} else {
  
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= SIZE ||
    headY >= SIZE
  ) {
    
    return gameOver();
    
  }
  
}
  
  // ==========================
  // TABRAK BADAN
  // ==========================
  
  for (let i = 0; i < snake.length; i++) {
    
    if (
      snake[i].x === headX &&
      snake[i].y === headY
    ) {
      
      return gameOver();
      
    }
    
  }
  
  // ==========================
  // TAMBAH KEPALA
  // ==========================
  
  snake.unshift({
    
    x: headX,
    y: headY
    
  });
  
  // ==========================
  // MAKAN APEL
  // ==========================
  
  if (
    headX === food.x &&
    headY === food.y
  ) {
    
    score++;
    
    scoreText.textContent = score;
    
    playSound(eatSound);

if (navigator.vibrate)
  navigator.vibrate(20);

// Buat partikel merah
createParticles(food.x, food.y, "#ff3333");

createFood();
    
    // Munculkan bonus setiap 5 score
    if (
      score % 5 === 0 &&
      bonusFood === null
    ) {
      
      createBonusFood();
      console.log("BONUS MUNCUL");
      
    }
    
    // Level
    if (
      score % 10 === 0 &&
      gameSpeed > 60
    ) {
      
      gameSpeed -= 10;
      
      clearInterval(loop);
      
      loop = setInterval(update, gameSpeed);
      
    }
    
  }
  
  // ==========================
  // BONUS FOOD
  // ==========================
  
  else if (
    
    bonusFood &&
    headX === bonusFood.x &&
    headY === bonusFood.y
    
  ) {
    
    score += 5;
    
    scoreText.textContent = score;
    
    playSound(eatSound);

if (navigator.vibrate)
  navigator.vibrate(60);

// Buat partikel emas
createParticles(bonusFood.x, bonusFood.y, "gold");

bonusFood = null;
    
  }
  
  // ==========================
  // TIDAK MAKAN
  // ==========================
  
  else {
    
    snake.pop();
    
  }
  
  // ==========================
  // BONUS TIMER
  // ==========================
  
  if (bonusFood) {
    
    bonusTimer--;
    
    if (bonusTimer <= 0) {
      
      bonusFood = null;
      
    }
    
  }
  
  // ==========================
  // HIGH SCORE
  // ==========================
  
  if (score > highScore) {
    
    highScore = score;
    
    localStorage.setItem(
      "snakeHighScore",
      highScore
    );
    
  }
  // ==========================
// AUTO SAVE
// ==========================

localStorage.setItem(
  "saveGame",
  JSON.stringify({
    snake: snake,
    food: food,
    direction: direction,
    score: score
  })
);
  draw();
  
}

// ======================================
// GAME OVER
// ======================================

function gameOver() {
  
  clearInterval(loop);
  
  bgm.pause();
bgm.currentTime = 0;
  
  playSound(gameOverSound);
  
  if (navigator.vibrate)
    navigator.vibrate([150, 80, 150]);
  
  finalScore.textContent = score;
  leaderboard.push(score);

leaderboard.sort((a, b) => b - a);

leaderboard = leaderboard.slice(0, 10);

localStorage.setItem(
  "leaderboard",
  JSON.stringify(leaderboard)
);
  
  controls.style.display = "none";
  
  gameOverPanel.classList.remove("hidden");
  
}
// ======================================
// PART 3
// DRAW GAME
// ======================================

function draw() {
  
  // ==========================
  // Background Gradasi
  // ==========================
  
  let bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  
  bg.addColorStop(0, "#081421");
  bg.addColorStop(1, "#1d3f5f");
  
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  
  // ==========================
  // Grid
  // ==========================
  
  ctx.strokeStyle = "#24445e";
  
  for (let i = 0; i <= SIZE; i += GRID) {
    
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, SIZE);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(SIZE, i);
    ctx.stroke();
    
  }
  
  // ==========================
  // APEL
  // ==========================
  
  foodPulse += 0.15;
  
  let radius = 8 + Math.sin(foodPulse) * 2;
  
  ctx.shadowColor = "red";
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.fillStyle = "#ff3333";
  ctx.arc(
    food.x + GRID / 2,
    food.y + GRID / 2,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  // tangkai
  
  ctx.beginPath();
  ctx.strokeStyle = "#5b3a29";
  ctx.lineWidth = 2;
  ctx.moveTo(food.x + 10, food.y + 4);
  ctx.lineTo(food.x + 10, food.y);
  ctx.stroke();
  
  // daun
  
  ctx.beginPath();
  ctx.fillStyle = "#00cc55";
  ctx.arc(
    food.x + 14,
    food.y + 3,
    2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // ==========================
  // BONUS FOOD
  // ==========================
  
  console.log(bonusFood);
  if (bonusFood) {
    
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 20;
    
    ctx.beginPath();
    ctx.fillStyle = "gold";
    
    ctx.arc(
      bonusFood.x + 10,
      bonusFood.y + 10,
      9,
      0,
      Math.PI * 2
    );
    
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(
      "★",
      bonusFood.x + 5,
      bonusFood.y + 14
    );
    
  }
  
  // ==========================
  // ULAR
  // ==========================
  
  for (let i = 0; i < snake.length; i++) {
    
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 12;
    
    let headColor = "#00ff66";
let bodyColor = "#00bb66";

if (snakeSkin === 1) {
  headColor = "#33aaff";
  bodyColor = "#0077ff";
}

if (snakeSkin === 2) {
  headColor = "#ff5555";
  bodyColor = "#cc2222";
}

if (snakeSkin === 3) {
  headColor = "#ffd700";
  bodyColor = "#d4af37";
}

ctx.fillStyle = (i == 0) ? headColor : bodyColor;
    
    ctx.beginPath();
    
    ctx.arc(
      snake[i].x + 10,
      snake[i].y + 10,
      8,
      0,
      Math.PI * 2
    );
    
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    if (i == 0) {
      
      drawEyes(snake[i]);
      
      drawTongue(snake[i]);
      
    }
    // ==========================
// PARTIKEL
// ==========================

for (let i = particles.length - 1; i >= 0; i--) {
  
  let p = particles[i];
  
  ctx.fillStyle = p.color;
  
  ctx.globalAlpha = p.life / 20;
  
  ctx.beginPath();
  
  ctx.arc(
    p.x,
    p.y,
    3,
    0,
    Math.PI * 2
  );
  
  ctx.fill();
  
  ctx.globalAlpha = 1;
  
  p.x += p.dx;
  p.y += p.dy;
  
  p.life--;
  
  if (p.life <= 0) {
    
    particles.splice(i, 1);
    
  }
  
}
    
  }
  
}
// ======================================
// PART 4
// Mata, Lidah, Tombol, Pause
// ======================================

// ==========================
// Mata Ular
// ==========================

function drawEyes(head) {
  
  ctx.fillStyle = "black";
  
  let eye1X, eye1Y;
  let eye2X, eye2Y;
  
  switch (direction) {
    
    case "RIGHT":
      eye1X = head.x + 13;
      eye1Y = head.y + 6;
      eye2X = head.x + 13;
      eye2Y = head.y + 14;
      break;
      
    case "LEFT":
      eye1X = head.x + 7;
      eye1Y = head.y + 6;
      eye2X = head.x + 7;
      eye2Y = head.y + 14;
      break;
      
    case "UP":
      eye1X = head.x + 6;
      eye1Y = head.y + 7;
      eye2X = head.x + 14;
      eye2Y = head.y + 7;
      break;
      
    case "DOWN":
      eye1X = head.x + 6;
      eye1Y = head.y + 13;
      eye2X = head.x + 14;
      eye2Y = head.y + 13;
      break;
      
  }
  
  ctx.beginPath();
  ctx.arc(eye1X, eye1Y, 2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(eye2X, eye2Y, 2, 0, Math.PI * 2);
  ctx.fill();
  
}

// ==========================
// Lidah Ular
// ==========================

function drawTongue(head) {
  
  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 2;
  
  if (direction === "RIGHT") {
    
    tongue(head.x + 20, head.y + 10, 6, 0);
    
  }
  
  else if (direction === "LEFT") {
    
    tongue(head.x, head.y + 10, -6, 0);
    
  }
  
  else if (direction === "UP") {
    
    tongueVertical(head.x + 10, head.y, -6);
    
  }
  
  else if (direction === "DOWN") {
    
    tongueVertical(head.x + 10, head.y + 20, 6);
    
  }
  
}

function tongue(x, y, dx, dy) {
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y - 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + 2);
  ctx.stroke();
  
}

function tongueVertical(x, y, dy) {
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 2, y + dy);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 2, y + dy);
  ctx.stroke();
  
}

// ==========================
// Tombol Pause
// ==========================

if (pauseBtn) {
  
  pauseBtn.onclick = () => {
    
    playSound(clickSound);
    
    clearInterval(loop);
    
    isPaused = true;
    
    pauseMenu.classList.remove("hidden");
    
  };
  
}

// ==========================
// Restart
// ==========================

restartBtn.onclick = () => {
  
  playSound(clickSound);

gameOverPanel.classList.add("hidden");

controls.style.display = "block";

if (musicOn) {
  
  bgm.currentTime = 0;
  bgm.play().catch(() => {});
  
}

startGame();
  
};

// ==========================
// Menu
// ==========================

menuBtn.onclick = () => {
  
  playSound(clickSound);
  
  bgm.pause();
bgm.currentTime = 0;
  
  clearInterval(loop);
  
  gameOverPanel.classList.add("hidden");
  
  game.classList.add("hidden");
  
  menu.classList.remove("hidden");
  
};
// ==========================
// MENU PAUSE
// ==========================

resumeBtn.onclick = () => {
  
  playSound(clickSound);
  
  pauseMenu.classList.add("hidden");
  
  isPaused = false;
  
  loop = setInterval(update, gameSpeed);
  
};

restartPauseBtn.onclick = () => {
  
  playSound(clickSound);
  
  pauseMenu.classList.add("hidden");
  
  controls.style.display = "block";
  
  gameOverPanel.classList.add("hidden");
  
  if (musicOn) {
    
    bgm.currentTime = 0;
    bgm.play().catch(() => {});
    
  }
  
  startGame();
  
};

menuPauseBtn.onclick = () => {
  
  playSound(clickSound);
  
  clearInterval(loop);
  
  bgm.pause();
  bgm.currentTime = 0;
  
  pauseMenu.classList.add("hidden");
  
  game.classList.add("hidden");
  
  menu.classList.remove("hidden");
  
};

// ==========================
// Render Pertama
// ==========================

draw();
// ==========================
// TOMBOL MUSIC ON / OFF
// ==========================

musicBtn.onclick = () => {
  
  playSound(clickSound);
  
  if (musicOn) {
    
    musicOn = false;
    
    localStorage.setItem("musicOn", false);
    
    bgm.pause();
    
    musicBtn.innerText = "🔇 MUSIC OFF";
    
  } else {
    
    musicOn = true;
    
    localStorage.setItem("musicOn", true);
    
    bgm.play().catch(() => {});
    
    musicBtn.innerText = "🔊 MUSIC ON";
    
  }
  
};
// ==========================
// PANEL PENGATURAN
// ==========================

settingsBtn.onclick = () => {
  
  playSound(clickSound);
  
  settingsPanel.classList.remove("hidden");
  
};

closeSettings.onclick = () => {
  
  playSound(clickSound);
  
  settingsPanel.classList.add("hidden");
  
};
// ==========================
// WRAP MODE ON / OFF
// ==========================

const wrapBtn = document.getElementById("wrapBtn");

wrapBtn.innerText = "🌍 Wrap Mode : ON";

wrapBtn.onclick = () => {
  
  playSound(clickSound);
  
  wrapMode = !wrapMode;
  
  if (wrapMode) {
    
    wrapBtn.innerText = "🌍 Wrap Mode : ON";
    
  } else {
    
    wrapBtn.innerText = "🌍 Wrap Mode : OFF";
    
  }
  
};
// ==========================
// SKIN ULAR
// ==========================

const skinBtn = document.getElementById("skinBtn");

skinBtn.onclick = () => {
  
  playSound(clickSound);
  
  snakeSkin++;
  
  if (snakeSkin > 3) {
    snakeSkin = 0;
  }
  
  if (snakeSkin === 0) {
    skinBtn.innerText = "🎨 Skin : Hijau";
  }
  
  if (snakeSkin === 1) {
    skinBtn.innerText = "🎨 Skin : Biru";
  }
  
  if (snakeSkin === 2) {
    skinBtn.innerText = "🎨 Skin : Merah";
  }
  
  if (snakeSkin === 3) {
    skinBtn.innerText = "🎨 Skin : Emas";
  }
  
};
// ==========================
// LEADERBOARD
// ==========================

const leaderboardBtn = document.getElementById("leaderboardBtn");

leaderboardBtn.onclick = () => {
  
  playSound(clickSound);
  
  if (leaderboard.length === 0) {
    
    alert("Belum ada skor tersimpan.");
    
    return;
    
  }
  
  let text = "🏆 TOP 10 SCORE\n\n";
  
  for (let i = 0; i < leaderboard.length; i++) {
    
    text += (i + 1) + ". " + leaderboard[i] + "\n";
    
  }
  
  alert(text);
  
};
// ==========================
// CONTINUE GAME
// ==========================

const continueBtn = document.getElementById("continueBtn");

continueBtn.onclick = () => {
  
  playSound(clickSound);
  
  const save = JSON.parse(localStorage.getItem("saveGame"));
  
  if (!save) {
    
    alert("Belum ada permainan yang disimpan.");
    
    return;
    
  }
  
  menu.classList.add("hidden");
  settingsPanel.classList.add("hidden");
  game.classList.remove("hidden");
  
  snake = save.snake;
  food = save.food;
  direction = save.direction;
  score = save.score;
  
  scoreText.textContent = score;
  
  clearInterval(loop);
  loop = setInterval(update, gameSpeed);
  
  controls.style.display = "block";
  
  draw();
  
};

// ==========================
// SERVICE WORKER
// ==========================

if ("serviceWorker" in navigator) {
  
  window.addEventListener("load", () => {
    
    navigator.serviceWorker.register("./sw.js")
      .then(() => {
        console.log("Service Worker berhasil didaftarkan.");
      })
      .catch((err) => {
        console.log("Service Worker gagal:", err);
      });
    
  });
  
}
// ==========================
// ABOUT PANEL
// ==========================

const aboutBtn = document.getElementById("aboutBtn");
const aboutPanel = document.getElementById("aboutPanel");
const closeAboutBtn = document.getElementById("closeAboutBtn");

aboutBtn.addEventListener("click", () => {
  aboutPanel.classList.remove("hidden");
});

closeAboutBtn.addEventListener("click", () => {
  aboutPanel.classList.add("hidden");
});