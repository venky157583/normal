/* ==================================
   PERSONAL SETTINGS
================================== */

const SETTINGS = {
  password: "CHANGE_ME",

  photoCaption:
    "My favourite memory will always have you in it. 💖",

  letter:
    "Unna pathi ninaikkumbothu enakku varra santhoshathai " +
    "sila vaarthaigal-la solla mudiyathu. " +
    "Indha chinna surprise unakku special-ah irukkanum. 💜",

  remember:
    "Sila moments namakku appo normal-ah theriyalaam. " +
    "Aana konja naal kazhichu ninaichu paarkkumbothu, " +
    "avanga dhaan namma favourite memories aagidum. ✨",

  promise:
    "Un feelings-ai madhikkavum, un santhoshathai celebrate " +
    "pannavum, unakku nalla memories create aagavum " +
    "naan eppovum virumburen. ❤️",

  date:
    "Calendar-la irukkura dates mattum illa; " +
    "namakku special-ah irukkura ovvoru naalum oru memory dhaan. 🌙"
};


/* ==================================
   ELEMENTS
================================== */

const applicationPage = document.getElementById("applicationPage");
const successPage = document.getElementById("successPage");
const surprisePage = document.getElementById("surprisePage");
const fireworkScene = document.getElementById("fireworkScene");

const revealPhoto = document.getElementById("revealPhoto");
const photoCaption = document.getElementById("photoCaption");

const whistleSound = document.getElementById("whistleSound");
const explosionSound = document.getElementById("explosionSound");
const birthdayMusic = document.getElementById("birthdayMusic");


/* ==================================
   AUDIO HELPERS
================================== */

function playAudio(audio) {
  if (!audio) return;

  audio.currentTime = 0;

  const result = audio.play();

  if (result && typeof result.catch === "function") {
    result.catch(() => {
      console.info(
        "Audio could not autoplay. User interaction may be needed."
      );
    });
  }
}
/* ==================================
   APPLICATION SUBMISSION
================================== */

document.getElementById("applicationForm")
.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!this.reportValidity()) return;

  // Start the song immediately after Submit.
  if (birthdayMusic) {
    birthdayMusic.currentTime = 0;

    birthdayMusic.play().catch(() => {
      console.info("Unable to play music automatically.");
    });
  }

  applicationPage.classList.add("hidden");
  successPage.classList.add("hidden");
  fireworkScene.classList.remove("hidden");

  window.scrollTo(0, 0);

  startFireworkExperience();
});
/* ==================================
   FIREWORK CANVAS
================================== */

const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrame = null;
let fireworkTimer = [];
let rocket = null;
let burstDone = false;
let experienceStarted = false;


function resizeFireworkCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeFireworkCanvas();

window.addEventListener("resize", resizeFireworkCanvas);


function launchHeart() {
  const x = window.innerWidth / 2;
  const bottom = window.innerHeight + 20;
  const top = window.innerHeight * 0.36;

  rocket = {
    x: x,
    y: bottom,
    startY: bottom,
    targetY: top,
    started: performance.now(),
    duration: 1500
  };

  playAudio(whistleSound);
}


function burstHeart(x, y) {
  burstDone = true;

  const count = 420;

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;

    const hx = 16 * Math.pow(Math.sin(t), 3);

    const hy =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const scale = 8 + Math.random() * 2.5;

    particles.push({
      x: x + hx * scale,
      y: y - hy * scale,

      vx: hx * (0.015 + Math.random() * 0.045),
      vy: -hy * (0.015 + Math.random() * 0.045),

      life: 1,
      decay: 0.003 + Math.random() * 0.008,
      size: 1.3 + Math.random() * 2.5,
      hue: 280 + Math.random() * 65
    });
  }

  playAudio(explosionSound);

  setTimeout(() => {
    document.getElementById("fireworkMessage")
      .classList.add("show");
  }, 250);

  // Photo reveal after the heart-shaped burst.
  setTimeout(() => {
    revealPhoto.classList.add("show");

    photoCaption.textContent = SETTINGS.photoCaption;
    photoCaption.classList.add("show");

  }, 1500);

  setTimeout(() => {
    document.getElementById("exploreBtn")
      .classList.remove("hidden");
  }, 3300);
}


function animateFirework(now) {
  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  // Rocket travels upward.
  if (rocket && !burstDone) {
    const progress = Math.min(
      (now - rocket.started) / rocket.duration,
      1
    );

    const ease = 1 - Math.pow(1 - progress, 2);

    rocket.y =
      rocket.startY -
      (rocket.startY - rocket.targetY) * ease;

    // Rocket trail.
    for (let i = 0; i < 20; i++) {
      const alpha = 1 - i / 20;

      ctx.beginPath();

      ctx.fillStyle="rgba(255,110,225," + (alpha * 0.7) + ")";
      ctx.arc(
        rocket.x + (Math.random() - 0.5) * 5,
        rocket.y + i * 7,
        3.8 * alpha,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    // Rocket head.
    ctx.beginPath();

    ctx.fillStyle = "#fff0ff";
    ctx.shadowColor = "#ff5bda";
    ctx.shadowBlur = 24;

    ctx.arc(rocket.x, rocket.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    if (progress >= 1) {
      const x = rocket.x;
      const y = rocket.targetY;

      rocket = null;

      burstHeart(x, y);
    }
  }

  // Animate particles.
  particles = particles.filter(p => p.life > 0);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    p.vx *= 0.99;
    p.vy *= 0.99;
    p.vy += 0.012;

    p.life -= p.decay;

    ctx.beginPath();

    ctx.fillStyle =
      "hsla(" + p.hue + ",100%,75%," + Math.max(p.life, 0) + ")";

    ctx.shadowColor =
      "hsl(" + p.hue + ",100%,70%)";
    ctx.shadowBlur = 12;

    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  if (!fireworkScene.classList.contains("hidden")) {
    animationFrame = requestAnimationFrame(animateFirework);
  }
}


function startFireworkExperience() {
  if (experienceStarted) return;

  experienceStarted = true;
  burstDone = false;

  particles = [];
  rocket = null;

  fireworkTimer.forEach(clearTimeout);
  fireworkTimer = [];

  revealPhoto.classList.remove("show");
  photoCaption.classList.remove("show");

  document.getElementById("fireworkMessage")
    .classList.remove("show");

  document.getElementById("exploreBtn")
    .classList.add("hidden");

  cancelAnimationFrame(animationFrame);

  resizeFireworkCanvas();

  animationFrame = requestAnimationFrame(animateFirework);

  fireworkTimer.push(
    setTimeout(launchHeart, 180)
  );
}


/* ==================================
   CONTINUE TO MEMORIES
================================== */

document.getElementById("exploreBtn")
.addEventListener("click", function() {
  fireworkScene.classList.add("hidden");
  surprisePage.classList.remove("hidden");

  experienceStarted = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


/* ==================================
   INTERACTIVE MEMORY BUTTONS
================================== */

const memoryResult = document.getElementById("memoryResult");

document.querySelectorAll(".memory-button")
.forEach(button => {
  button.addEventListener("click", function() {
    const type = this.dataset.type;

    memoryResult.classList.remove("hidden");

    if (type === "letter") {
      memoryResult.innerHTML = `
        <h3>💌 A Letter from My Heart</h3>
        <p>${escapeHTML(SETTINGS.letter)}</p>
      `;
    }

    if (type === "photo") {
      memoryResult.innerHTML = `
        <img src="assets/memory1.jpg" alt="Special memory">
        <h3>📸 One of My Favourite Moments</h3>
        <p>
          Indha photo oru memory mattum illa.
          Enakku romba special-ah irukkura oru moment. 💜
        </p>
      `;
    }

    if (type === "remember") {
      memoryResult.innerHTML = `
        <h3>🥹 Remember This?</h3>
        <p>${escapeHTML(SETTINGS.remember)}</p>
      `;
    }

    if (type === "song") {
      memoryResult.innerHTML = `
        <h3>🎵 Our Special Song</h3>
        <p>
          Indha song unakku oru special memory-ai
          ninaivupaduthattum. 💖
        </p>

        <button class="primary-btn" id="playSongButton">
          Play Music ♫
        </button>

        <button class="primary-btn" id="pauseSongButton"
          style="margin-left:8px;background:#57327e">
          Pause
        </button>
      `;

      document.getElementById("playSongButton")
        .addEventListener("click", () => playAudio(birthdayMusic));

      document.getElementById("pauseSongButton")
        .addEventListener("click", () => birthdayMusic.pause());
    }

    if (type === "promise") {
      memoryResult.innerHTML = `
        <h3>❤️ A Little Promise</h3>
        <p>${escapeHTML(SETTINGS.promise)}</p>
      `;
    }

    if (type === "date") {
      memoryResult.innerHTML = `
        <h3>🌙 Our Special Moments</h3>
        <p>${escapeHTML(SETTINGS.date)}</p>
      `;
    }

    memoryResult.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}


/* ==================================
   HIDDEN MESSAGE PASSWORD
================================== */

document.getElementById("passwordForm")
.addEventListener("submit", function(event) {
  event.preventDefault();

  const enteredPassword =
    document.getElementById("passwordInput").value;

  const error = document.getElementById("passwordError");
  const message = document.getElementById("secretMessage");

  if (enteredPassword === SETTINGS.password) {
    error.classList.add("hidden");
    message.classList.remove("hidden");

    message.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  } else {
    error.classList.remove("hidden");
    message.classList.add("hidden");
  }
});


/* ==================================
   REPLAY SURPRISE
================================== */

document.getElementById("replayBtn")
.addEventListener("click", function() {
  birthdayMusic.pause();
  birthdayMusic.currentTime = 0;

  surprisePage.classList.add("hidden");
  fireworkScene.classList.remove("hidden");

  window.scrollTo(0, 0);

  startFireworkExperience();
});


/* ==================================
   STAR BACKGROUND
================================== */

const starsCanvas = document.getElementById("stars");
const starsCtx = starsCanvas.getContext("2d");

let stars = [];


function createStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  starsCanvas.width = innerWidth * dpr;
  starsCanvas.height = innerHeight * dpr;

  starsCanvas.style.width = innerWidth + "px";
  starsCanvas.style.height = innerHeight + "px";

  starsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from({
    length: Math.min(130, Math.floor(innerWidth / 7))
  }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random() * 0.65 + 0.2,
    speed: Math.random() * 0.008 + 0.002
  }));
}


function drawStars() {
  starsCtx.clearRect(0, 0, innerWidth, innerHeight);

  for (const s of stars) {
    s.a += s.speed;

    const opacity =
      0.3 + Math.abs(Math.sin(s.a)) * 0.7;

    starsCtx.beginPath();

    starsCtx.fillStyle =
      `rgba(245,220,255,${opacity})`;

    starsCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starsCtx.fill();
  }

  requestAnimationFrame(drawStars);
}


createStars();
drawStars();

window.addEventListener("resize", createStars);