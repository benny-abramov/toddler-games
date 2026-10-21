// Toddler Games — plain JS, no build step.

// Each animal: name (also the image/sound file name) and a tile color that contrasts with the picture
const ANIMALS = [
  ["cow", "#ffadad"], ["dog", "#caffbf"], ["cat", "#a0c4ff"], ["sheep", "#caffbf"],
  ["duck", "#9bf6ff"], ["chicken", "#a0c4ff"], ["horse", "#fdffb6"], ["donkey", "#ffc6ff"],
  ["pig", "#caffbf"], ["rooster", "#ffd6a5"], ["goat", "#bdb2ff"], ["frog", "#fdffb6"],
  ["elephant", "#9bf6ff"], ["lion", "#a0c4ff"], ["owl", "#ffd6a5"],
];

// Each color: name, tile color, and something of that color shown on the second tap
const COLORS = [
  ["red",    "#e63946", "apple"],
  ["orange", "#f77f00", "carrot"],
  ["yellow", "#ffd60a", "banana"],
  ["green",  "#2a9d4b", "frog"],
  ["blue",   "#1e6fd9", "whale"],
  ["purple", "#8e44ad", "grapes"],
  ["pink",   "#ff8fc7", "flower"],
  ["brown",  "#8b5a2b", "bear"],
  ["black",  "#222222", "cat", "black-cat"],
  ["white",  "#ffffff", "cloud"],
  ["gray",   "#9aa0a6", "elephant"],
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

// ---------- Tiles (shared by all games) ----------
let lastTapped = null;
let tapCount = 0;

function capitalize(s) { return s[0].toUpperCase() + s.slice(1); }

// Odd taps call first(), even taps call second(); tapping a different tile starts over
function makeTile(grid, { id, color, html, label, first, second }) {
  const btn = document.createElement("button");
  btn.className = "tile";
  btn.style.setProperty("--tile", color);
  btn.setAttribute("aria-label", label);
  btn.innerHTML = `${html}<span class="label">${capitalize(label)}</span>`;
  btn.addEventListener("click", () => {
    if (lastTapped !== id) { lastTapped = id; tapCount = 0; }
    tapCount++;

    if (navigator.vibrate) navigator.vibrate(30);

    // Restart the animation even on rapid repeat taps
    btn.classList.remove("bounce", "wiggle");
    void btn.offsetWidth;

    if (tapCount % 2 === 1) {
      btn.classList.add("bounce", "named");
      first(btn);
    } else {
      btn.classList.add("wiggle");
      second(btn);
    }
  });
  grid.appendChild(btn);
}

// ---------- Animals: name, then animal sound ----------
const animalGrid = document.getElementById("animal-grid");

ANIMALS.forEach(([name, color]) => {
  makeTile(animalGrid, {
    id: "animal-" + name,
    color,
    label: name,
    html: `<img src="images/${name}.svg" alt="">`,
    first: () => { stopAll(); say(name); getSound(name); },
    second: () => playSound(name),
  });
});

// ---------- Colors: color name, then a thing of that color ----------
const colorGrid = document.getElementById("color-grid");

COLORS.forEach(([name, color, thing, image = thing]) => {
  makeTile(colorGrid, {
    id: "color-" + name,
    color,
    label: name,
    html: `<span class="thing"><img src="images/${image}.svg" alt=""></span>`,
    first: btn => { btn.classList.remove("show-thing"); stopAll(); say(name); },
    second: btn => { btn.classList.add("show-thing"); stopAll(); say(`${name} ${thing}`); },
  });
});

// ---------- Routing (hash-based so the phone's back button works) ----------
function route() {
  const screen = location.hash.slice(1) || "home";
  document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== screen; });
  stopAll();
  lastTapped = null;
  document.querySelectorAll(".tile").forEach(b => b.classList.remove("named", "show-thing"));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
