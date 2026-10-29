/* ==================================
   PERSONAL SETTINGS
================================== */

const SETTINGS = {
  password: "kuchu mudi",

  photoCaption:
    "My favourite memory will always have you in it. 💖",

  remember:
    "intha porul niyabgam irukama nee enta aasa pattu " +
    "keta kandipa oru naal vangi tharuven maaa " +
    "vangi thanthi uh head la vachi alagu pakanum ✨",

  promise:
    "ne ennoda kaila intha bracelet ah farwell day annaiku  " +
    "maativittama kandipa ini itha kalatave maten " +
    "little suggestion," +
     "theriyama kalanthuta return nee maati vidunama kuchi mudi pls  (fun)",

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
VIDEO PLAY - BACKGROUND MUSIC CONTROL
================================== */

const memoryVideos = document.querySelectorAll("#videos video");
const activeVideos = new Set();
let resumeBirthdayMusic = false;

memoryVideos.forEach(video => {
video.addEventListener("play", () => {
if (activeVideos.size === 0) {
resumeBirthdayMusic =
birthdayMusic &&
!birthdayMusic.paused &&
!birthdayMusic.ended;

  if (birthdayMusic) {
    birthdayMusic.pause();
  }
}

activeVideos.add(video);

});

function handleVideoStop() {
activeVideos.delete(video);

if (activeVideos.size === 0 && resumeBirthdayMusic) {
  resumeBirthdayMusic = false;

  if (birthdayMusic) {
    birthdayMusic.play().catch(() => {
      console.info("Music resume requires user interaction.");
    });
  }
}

}

video.addEventListener("pause", handleVideoStop);
video.addEventListener("ended", handleVideoStop);
});


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

const buttonMemories = {
  letter: {
    title: "💌 A Letter from My Heart",
    image: "assets/letter.jpg",
    text: SETTINGS.letter
  },

  photo: {
    title: "📸 One of My Favourite Moments",
    image: "assets/bestmoment.jpg",
    text: "Indha photo oru memory mattum illa. Enakku romba special-ah irukkura oru moment. 💜"
  },

  remember: {
    title: "🥹 Remember This?",
    image: "assets/remember.jpg",
    text: SETTINGS.remember
  },

  promise: {
    title: "❤️ A Little Promise",
    image: "assets/promise.jpg",
    text: SETTINGS.promise
     },

  collegelast: {
  title: "💫 One Last Time",
  image: "assets/onelasttime.jpg",
  text: "Intha memories namakku eppovume special. One last time, indha beautiful moments-ah nenachu paaru. 💜"
},
 
};

document.querySelectorAll(".memory-button").forEach(button => {
  button.addEventListener("click", function() {
    const type = this.dataset.type;
    const memory = buttonMemories[type];

    if (!memory) return;

    memoryResult.replaceChildren();
    memoryResult.classList.remove("hidden");

    const image = document.createElement("img");
    image.src = memory.image;
    image.classList.toggle(
  "full-view-photo",
  type === "remember" || type === "collegelast"
);
    image.alt = memory.title;
    image.loading = "lazy";

    image.onerror = function() {
      this.classList.add("hidden");
    };

    memoryResult.appendChild(image);

    const heading = document.createElement("h3");
    heading.textContent = memory.title;
    memoryResult.appendChild(heading);

    const paragraph = document.createElement("p");
    paragraph.textContent = memory.text;
    memoryResult.appendChild(paragraph);

    if (type === "song") {
      const playButton = document.createElement("button");
      playButton.className = "primary-btn";
      playButton.textContent = "Play Music ♫";

      playButton.addEventListener("click", () => {
        playAudio(birthdayMusic);
      });

      const pauseButton = document.createElement("button");
      pauseButton.className = "primary-btn";
      pauseButton.textContent = "Pause Music";
      pauseButton.style.marginLeft = "8px";
      pauseButton.style.background = "#57327e";

      pauseButton.addEventListener("click", () => {
        if (birthdayMusic) birthdayMusic.pause();
      });

      memoryResult.appendChild(playButton);
      memoryResult.appendChild(pauseButton);
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
/* =========================================
CONSTELLATION OF MEMORIES - JAVASCRIPT
========================================= */

(function initConstellation() {
const galaxy = document.getElementById("constellationMemories");

// Section HTML-la add pannala na existing website-ai affect panna vendam.
if (!galaxy) return;

const canvas = document.getElementById("constellationCanvas");
const ctx = canvas.getContext("2d");

const stars = [...galaxy.querySelectorAll(".memory-star")];

const popup = document.getElementById("constellationPopup");
const popupTitle = document.getElementById("constellationPopupTitle");
const popupText = document.getElementById("constellationMemoryText");
const popupImage = document.getElementById("constellationMemoryImage");

const closeButton = document.getElementById("closeConstellationPopup");
const nextButton = document.getElementById("nextConstellationMemory");

const progress = document.getElementById("starsCollected");
const result = document.getElementById("constellationResult");
const instruction = document.getElementById("galaxyInstruction");

/*
CUSTOMIZE YOUR MEMORIES HERE.

Image paths:
assets/memory1.jpg
assets/memory2.jpg
assets/memory3.jpg

Ungaloda photos use panna, indha file names-ai
unga actual photo file names-ku match pannunga.
*/

const memories = [
  {
    title: "A Beautiful Beginning 🌱",
    text: "Every beautiful story begins with a little moment.intha sympol tha na first aasa pattu keta pic 💜",
    image: "assets/memory1.jpg"
  },
  {
    title: "Little Moments ✨",
    text: "intha  hair paathuthan na unna kuchi mudiney name vachen. ❤️",
    image: "assets/memory2.jpg"
  },
  {
    title: "A Favourite Memory 📸",
    text: "Indha photo oru memory... namma internship la happy ah irunthatha sollum 💖",
    image: "assets/memory3.jpg"
  },
  {
    title: "A Wish for You 💌",
    text: "unaku na first birthday gift ah kuduthuma, ithuku oru porattam nadanthathu maraka maten maa ✨",
    image: "assets/memory4.jpg"
  },
  {
    title: "Our Little Universe 🌌",
    text: "namma orey team eh RCB eesala illa, cup eppomey namakuthan 💜",
    image: "assets/memory5.jpg"
  },
 
];
const discovered = new Set();
let activeMemory = 0;
let animationId = null;
let resizeTimer = null;
let particles = [];

function safeImageSource(path) {
  if (!path || !/^assets\/[a-zA-Z0-9_.-]+$/.test(path)) {
    return "";
  }
  return path;
}

function updateProgress() {
progress.textContent = String(discovered.size);
if (discovered.size === stars.length) {
  result.classList.remove("hidden");
  instruction.textContent = "💖 You discovered every memory in this little universe!";
  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


}

function openMemory(index) {
if (index < 0 || index >= memories.length) return;

activeMemory = index;

const memory = memories[index];

popupTitle.textContent = memory.title;
popupText.textContent = memory.text;

const imagePath = safeImageSource(memory.image);

if (imagePath) {
  popupImage.onerror = () => {
    popupImage.classList.add("hidden");
    popupImage.removeAttribute("src");
  };

  popupImage.src = imagePath;
  popupImage.classList.toggle(
  "full-view-photo",
  [0, 2, 4].includes(index)
);
  popupImage.classList.remove("hidden");
} else {
  popupImage.classList.add("hidden");
  popupImage.removeAttribute("src");
}

popup.classList.remove("hidden");
document.body.style.overflow = "hidden";

closeButton.focus();

}

function closeMemory() {
popup.classList.add("hidden");
document.body.style.overflow = "";
}

stars.forEach((star, index) => {
star.addEventListener("click", () => {
discovered.add(index);
star.classList.add("discovered");

  updateProgress();
  openMemory(index);
});

});

closeButton.addEventListener("click", closeMemory);

popup.addEventListener("click", event => {
if (event.target === popup) {
closeMemory();
}
});

document.addEventListener("keydown", event => {
if (event.key === "Escape" && !popup.classList.contains("hidden")) {
closeMemory();
}
});

nextButton.addEventListener("click", () => {
closeMemory();
const nextUndiscovered = stars.findIndex(
  (star, index) => !discovered.has(index)
);

if (nextUndiscovered !== -1) {
  stars[nextUndiscovered].focus();
  openMemory(nextUndiscovered);
} else {
  result.classList.remove("hidden");
  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

});

/*
Animated background stars and constellation lines.
*/

function resizeCanvas() {
const rect = canvas.getBoundingClientRect();
const dpr = Math.min(window.devicePixelRatio || 1, 2);

canvas.width = Math.max(1, Math.round(rect.width * dpr));
canvas.height = Math.max(1, Math.round(rect.height * dpr));

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

particles = Array.from({ length: 65 }, () => ({
  x: Math.random() * rect.width,
  y: Math.random() * rect.height,
  radius: Math.random() * 1.5 + 0.3,
  alpha: Math.random() * 0.65 + 0.2,
  speed: Math.random() * 0.012 + 0.003
}));

}

function getStarCenter(element) {
const canvasRect = canvas.getBoundingClientRect();
const starRect = element.getBoundingClientRect();

return {
  x: starRect.left + starRect.width / 2 - canvasRect.left,
  y: starRect.top + starRect.height / 2 - canvasRect.top
};

}

function drawConstellation() {
if (!galaxy.isConnected) return;

const rect = canvas.getBoundingClientRect();

ctx.clearRect(0, 0, rect.width, rect.height);

// Background galaxy particles.
for (const particle of particles) {
  particle.alpha += particle.speed;

  const opacity = 0.18 + Math.abs(Math.sin(particle.alpha)) * 0.65;

  ctx.beginPath();
  ctx.fillStyle = `rgba(225, 196, 255, ${opacity})`;
  ctx.arc(
    particle.x,
    particle.y,
    particle.radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Connect only the stars that have been discovered.
const discoveredStars = stars
  .map((element, index) => ({
    index,
    element,
    point: getStarCenter(element)
  }))
  .filter(item => discovered.has(item.index));

if (discoveredStars.length > 1) {
  ctx.save();
  ctx.strokeStyle = "rgba(240, 177, 255, 0.8)";
  ctx.lineWidth = 1.6;
  ctx.shadowColor = "#d77cff";
  ctx.shadowBlur = 10;

  ctx.beginPath();

  discoveredStars.forEach((item, index) => {
    if (index === 0) {
      ctx.moveTo(item.point.x, item.point.y);
    } else {
      ctx.lineTo(item.point.x, item.point.y);
    }
  });

  if (discovered.size === stars.length) {
    // Connect all discovered stars into a heart-like outline.
    ctx.lineTo(
      discoveredStars[0].point.x,
      discoveredStars[0].point.y
    );
  }

  ctx.stroke();
  ctx.restore();
}

animationId = requestAnimationFrame(drawConstellation);

}

function handleResize() {
clearTimeout(resizeTimer);
resizeTimer = setTimeout(() => {
  resizeCanvas();
}, 120);

}

resizeCanvas();
drawConstellation();

window.addEventListener("resize", handleResize);

// Pause canvas work when the section is removed from the page.
window.addEventListener("pagehide", () => {
if (animationId !== null) {
cancelAnimationFrame(animationId);
}

window.removeEventListener("resize", handleResize);

}, { once: true });
})();
