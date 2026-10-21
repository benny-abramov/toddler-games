// Toddler Games — plain JS, no build step.

// Each animal: name (also the image/sound file name) and a tile color that contrasts with the picture
const ANIMALS = [
  ["cow", "#ffadad"], ["dog", "#caffbf"], ["cat", "#a0c4ff"], ["sheep", "#caffbf"],
  ["duck", "#9bf6ff"], ["chicken", "#a0c4ff"], ["horse", "#fdffb6"], ["donkey", "#ffc6ff"],
  ["pig", "#caffbf"], ["rooster", "#ffd6a5"], ["goat", "#bdb2ff"], ["frog", "#fdffb6"],
  ["elephant", "#9bf6ff"], ["lion", "#a0c4ff"], ["owl", "#ffd6a5"],
];

// ---------- Speech ----------
let voice = null;

function pickVoice() {
  const voices = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("en"));
  // Prefer a friendly-sounding local English voice when available
  voice =
    voices.find(v => /samantha|google us english|zira|aria|jenny/i.test(v.name)) ||
    voices.find(v => v.lang === "en-US") ||
    voices[0] || null;
}

if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

function say(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice ? voice.lang : "en-US";
  u.rate = 0.8;
  u.pitch = 1.2;
  speechSynthesis.speak(u);
}

// ---------- Sounds ----------
const sounds = {};
let playing = null;

function getSound(name) {
  if (!sounds[name]) {
    sounds[name] = new Audio(`sounds/${name}.mp3`);
    sounds[name].preload = "auto";
  }
  return sounds[name];
}

function stopAll() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (playing) { playing.pause(); playing.currentTime = 0; }
}

function playSound(name) {
  stopAll();
  const a = getSound(name);
  a.currentTime = 0;
  playing = a;
  a.play().catch(() => {});
}

// ---------- Animals screen ----------
const grid = document.getElementById("animal-grid");
let lastTapped = null;
let tapCount = 0;

function capitalize(s) { return s[0].toUpperCase() + s.slice(1); }

ANIMALS.forEach(([name, color]) => {
  const btn = document.createElement("button");
  btn.className = "animal";
  btn.style.setProperty("--tile", color);
  btn.setAttribute("aria-label", name);
  btn.innerHTML = `<img src="images/${name}.svg" alt=""><span class="label">${capitalize(name)}</span>`;
  btn.addEventListener("click", () => onAnimalTap(btn, name));
  grid.appendChild(btn);
});

function onAnimalTap(btn, name) {
  if (lastTapped !== name) { lastTapped = name; tapCount = 0; }
  tapCount++;

  if (navigator.vibrate) navigator.vibrate(30);

  // Restart the animation even on rapid repeat taps
  btn.classList.remove("bounce", "wiggle");
  void btn.offsetWidth;

  if (tapCount % 2 === 1) {
    // Odd taps: say the name
    btn.classList.add("bounce", "named");
    stopAll();
    say(name);
  } else {
    // Even taps: make the animal's sound
    btn.classList.add("wiggle");
    playSound(name);
  }

  // Start downloading this animal's sound so it's ready for the next tap
  getSound(name);
}

// ---------- Routing (hash-based so the phone's back button works) ----------
function route() {
  const screen = location.hash.slice(1) || "home";
  document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== screen; });
  stopAll();
  lastTapped = null;
  document.querySelectorAll(".animal.named").forEach(b => b.classList.remove("named"));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
