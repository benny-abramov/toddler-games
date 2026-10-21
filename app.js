// Toddler Games — plain JS, no build step.
// Every game is an entry in GAMES (bottom of file); its home card and screen are generated from it.

// ---------- Game data ----------

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

// Each number: tile color, image, and what to call that many of them
const NUMBER_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const NUMBERS = [
  ["#ffadad", "elephant", "elephant"],
  ["#ffd6a5", "dog", "dogs"],
  ["#fdffb6", "duck", "ducks"],
  ["#caffbf", "apple", "apples"],
  ["#9bf6ff", "frog", "frogs"],
  ["#a0c4ff", "flower", "flowers"],
  ["#bdb2ff", "carrot", "carrots"],
  ["#ffc6ff", "banana", "bananas"],
  ["#ffd6a5", "chicken", "chickens"],
  ["#a0c4ff", "star", "stars"],
];

// Each shape: name, shape color, SVG drawing (100x100), a real thing with that shape, and what to say about it
const SHAPES = [
  ["circle",    "#e63946", `<circle cx="50" cy="50" r="45"/>`, "ball", "A ball is a circle!"],
  ["square",    "#1e6fd9", `<rect x="8" y="8" width="84" height="84" rx="4"/>`, "window", "A window is a square!"],
  ["triangle",  "#2a9d4b", `<polygon points="50,6 96,90 4,90"/>`, "pizza", "Pizza is a triangle!"],
  ["rectangle", "#f77f00", `<rect x="4" y="22" width="92" height="56" rx="4"/>`, "door", "A door is a rectangle!"],
  ["star",      "#ffb703", `<polygon points="50,4 61,38 97,38 68,59 79,94 50,72 21,94 32,59 3,38 39,38"/>`, "star", "Twinkle, twinkle, little star!"],
  ["heart",     "#ff4d8d", `<path d="M50,88 C20,66 4,48 4,30 C4,16 15,6 28,6 C38,6 46,12 50,20 C54,12 62,6 72,6 C85,6 96,16 96,30 C96,48 80,66 50,88Z"/>`, "strawberry", "A strawberry is a heart!"],
  ["oval",      "#8e44ad", `<ellipse cx="50" cy="50" rx="33" ry="46"/>`, "egg", "An egg is an oval!"],
  ["diamond",   "#00a6c8", `<polygon points="50,3 90,50 50,97 10,50"/>`, "kite", "A kite is a diamond!"],
];

// Each vehicle / instrument: name (image + sound file name) and tile color
const VEHICLES = [
  ["car", "#a0c4ff"], ["bus", "#caffbf"], ["fire-truck", "#fdffb6"], ["police-car", "#ffd6a5"],
  ["ambulance", "#ffadad"], ["train", "#9bf6ff"], ["airplane", "#ffd6a5"], ["helicopter", "#caffbf"],
  ["ship", "#ffc6ff"], ["tractor", "#9bf6ff"], ["motorcycle", "#fdffb6"], ["bicycle", "#bdb2ff"],
];

const INSTRUMENTS = [
  ["piano", "#ffd6a5"], ["guitar", "#a0c4ff"], ["drum", "#caffbf"], ["trumpet", "#bdb2ff"],
  ["violin", "#9bf6ff"], ["saxophone", "#ffadad"], ["flute", "#fdffb6"], ["accordion", "#caffbf"],
  ["maracas", "#a0c4ff"], ["bell", "#ffc6ff"],
];

// Each food: name and tile color; the second tap takes a bite
const FOODS = [
  ["apple", "#caffbf"], ["banana", "#a0c4ff"], ["strawberry", "#fdffb6"], ["orange", "#bdb2ff"],
  ["watermelon", "#ffd6a5"], ["grapes", "#caffbf"], ["pear", "#ffc6ff"], ["cherries", "#9bf6ff"],
  ["pineapple", "#ffadad"], ["carrot", "#a0c4ff"], ["broccoli", "#ffd6a5"], ["corn", "#bdb2ff"],
  ["bread", "#9bf6ff"], ["cheese", "#ffadad"], ["egg", "#caffbf"], ["pizza", "#fdffb6"],
  ["cookie", "#a0c4ff"], ["ice-cream", "#ffc6ff"],
];

// Each body part: name, tile color, and what it does
const BODY = [
  ["eye",    "#a0c4ff", "I see with my eyes!"],
  ["ear",    "#caffbf", "I hear with my ears!"],
  ["nose",   "#fdffb6", "I smell with my nose! Sniff, sniff!"],
  ["mouth",  "#ffd6a5", "I eat with my mouth! Yum!"],
  ["tongue", "#9bf6ff", "I taste with my tongue!"],
  ["tooth",  "#ffc6ff", "I brush my teeth!"],
  ["hand",   "#bdb2ff", "I clap my hands! Clap, clap!"],
  ["arm",    "#ffadad", "I hug with my arms!"],
  ["leg",    "#caffbf", "I jump with my legs!"],
  ["foot",   "#a0c4ff", "I walk with my feet!"],
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

function utterance(text) {
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice ? voice.lang : "en-US";
  u.rate = 0.8;
  u.pitch = 1.2;
  return u;
}

function say(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance(text));
}

// Speak several phrases in a row; onStart(i) fires as phrase i begins
function sayEach(texts, onStart) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  texts.forEach((t, i) => {
    const u = utterance(t);
    u.onstart = () => onStart(i);
    speechSynthesis.speak(u);
  });
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
  if (playing) { playing.onended = null; playing.pause(); playing.currentTime = 0; }
}

function playSound(name, onEnd) {
  stopAll();
  const a = getSound(name);
  a.currentTime = 0;
  a.onended = onEnd || null;
  playing = a;
  a.play().catch(() => {});
}

// ---------- Tiles (shared by all games) ----------
let lastTapped = null;
let tapCount = 0;

function capitalize(s) { return s[0].toUpperCase() + s.slice(1); }
function words(name) { return name.replace(/-/g, " "); }

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

// Picture tiles: say the name, then play the matching sound (animals, vehicles, instruments)
function soundTiles(grid, items) {
  items.forEach(([name, color]) => {
    makeTile(grid, {
      id: name,
      color,
      label: words(name),
      html: `<img src="images/${name}.svg" alt="">`,
      first: () => { stopAll(); say(words(name)); getSound(name); },
      second: () => playSound(name),
    });
  });
}

// Tiles with a hidden picture on a plate that pops up on the second tap (colors, shapes)
function plateTiles(grid, items) {
  items.forEach(({ name, color, html, image, phrase }) => {
    makeTile(grid, {
      id: grid.id + name,
      color,
      label: name,
      html: `${html}<span class="thing"><img src="images/${image}.svg" alt=""></span>`,
      first: btn => { btn.classList.remove("show-thing"); stopAll(); say(name); },
      second: btn => { btn.classList.add("show-thing"); stopAll(); say(phrase); },
    });
  });
}

// ---------- Numbers: number name, then count that many things ----------
let countTimers = [];

// Stop any count in progress and turn every number tile back to its numeral
function clearCount() {
  countTimers.forEach(clearTimeout);
  countTimers = [];
  document.querySelectorAll(".counting").forEach(b => b.classList.remove("counting"));
}

function numberTiles(grid) {
  NUMBERS.forEach(([color, image, plural], i) => {
    const n = i + 1;
    const word = NUMBER_WORDS[i];
    const cols = n <= 3 ? n : n === 4 ? 2 : n <= 9 ? 3 : 4;
    const items = Array.from({ length: n }, () => `<img src="images/${image}.svg" alt="">`).join("");
    makeTile(grid, {
      id: "number-" + n,
      color,
      label: word,
      html: `<span class="numeral">${n}</span><span class="things" style="--cols:${cols}">${items}</span>`,
      first: () => {
        clearCount();
        stopAll();
        say(word);
      },
      second: btn => {
        clearCount();
        stopAll();
        const imgs = btn.querySelectorAll(".things img");
        imgs.forEach(img => img.classList.remove("on"));
        btn.classList.add("counting");
        const show = k => { if (imgs[k]) imgs[k].classList.add("on"); };
        // Reveal each picture as its number is spoken, with a timer as backup in case speech is unavailable
        sayEach([...NUMBER_WORDS.slice(0, n), `${word} ${plural}!`], show);
        for (let k = 0; k < n; k++) countTimers.push(setTimeout(() => show(k), 900 * k + 300));
      },
    });
  });
}

// ---------- Games ----------
// preview: four image names, or custom HTML for the home card
const GAMES = [
  {
    id: "animals", title: "Animals", panel: "#caffbf",
    preview: ["cow", "dog", "cat", "duck"],
    build: grid => soundTiles(grid, ANIMALS),
  },
  {
    id: "colors", title: "Colors", panel: "#fff7e0",
    preview: ["#e63946", "#ffd60a", "#2a9d4b", "#1e6fd9"].map(c => `<span class="swatch" style="background:${c}"></span>`).join(""),
    build: grid => plateTiles(grid, COLORS.map(([name, color, thing, image = thing]) =>
      ({ name, color, html: "", image, phrase: `${name} ${thing}` }))),
  },
  {
    id: "numbers", title: "Numbers", panel: "#fff7e0",
    preview: ["#ffadad", "#fdffb6", "#9bf6ff", "#bdb2ff"].map((c, i) => `<span class="numeral-chip" style="background:${c}">${i + 1}</span>`).join(""),
    build: numberTiles,
  },
  {
    id: "shapes", title: "Shapes", panel: "#fff7e0",
    preview: [0, 2, 4, 5].map(i => `<svg viewBox="0 0 100 100" fill="${SHAPES[i][1]}">${SHAPES[i][2]}</svg>`).join(""),
    build: grid => plateTiles(grid, SHAPES.map(([name, color, svg, image, phrase]) =>
      ({ name, color: "#ffffff", html: `<svg class="shape" viewBox="0 0 100 100" fill="${color}">${svg}</svg>`, image, phrase }))),
  },
  {
    id: "food", title: "Fruits & Food", panel: "#ffd6a5",
    preview: ["apple", "banana", "strawberry", "pizza"],
    build: grid => FOODS.forEach(([name, color]) => makeTile(grid, {
      id: "food-" + name,
      color,
      label: words(name),
      html: `<img src="images/${name}.svg" alt="">`,
      first: btn => { btn.classList.remove("bitten"); stopAll(); say(words(name)); getSound("munch"); },
      second: btn => { btn.classList.add("bitten"); playSound("munch", () => say("Yum yum!")); },
    })),
  },
  {
    id: "vehicles", title: "Vehicles", panel: "#a0c4ff",
    preview: ["car", "fire-truck", "train", "airplane"],
    build: grid => soundTiles(grid, VEHICLES),
  },
  {
    id: "body", title: "My Body", panel: "#ffc6ff",
    preview: ["eye", "nose", "hand", "foot"],
    build: grid => BODY.forEach(([name, color, phrase]) => makeTile(grid, {
      id: "body-" + name,
      color,
      label: name,
      html: `<img src="images/${name}.svg" alt="">`,
      first: () => { stopAll(); say(name); },
      second: () => { stopAll(); say(phrase); },
    })),
  },
  {
    id: "music", title: "Music", panel: "#bdb2ff",
    preview: ["piano", "guitar", "drum", "trumpet"],
    build: grid => soundTiles(grid, INSTRUMENTS),
  },
];

const homeGames = document.getElementById("games");

GAMES.forEach(game => {
  const pics = Array.isArray(game.preview)
    ? game.preview.map(p => `<img src="images/${p}.svg" alt="">`).join("")
    : game.preview;
  homeGames.insertAdjacentHTML("beforeend", `
    <a class="game-card" href="#${game.id}">
      <span class="game-pics" style="background:${game.panel}">${pics}</span>
      <span class="game-name">${game.title}</span>
    </a>`);

  document.body.insertAdjacentHTML("beforeend", `
    <section id="${game.id}" class="screen" hidden>
      <header class="bar">
        <a class="home-btn" href="#" aria-label="Home"><img src="images/home.svg" alt=""></a>
        <h2>${game.title}</h2>
      </header>
      <div id="${game.id}-grid" class="tile-grid ${game.id}"></div>
    </section>`);
  game.build(document.getElementById(`${game.id}-grid`));
});

// ---------- Routing (hash-based so the phone's back button works) ----------
function route() {
  const screen = location.hash.slice(1) || "home";
  document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== screen; });
  stopAll();
  clearCount();
  lastTapped = null;
  document.querySelectorAll(".tile").forEach(b => b.classList.remove("named", "show-thing", "counting", "bitten"));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
