const consoleEl = document.getElementById("console");
const lineNumbersEl = document.getElementById("lineNumbers");
const inputArea = document.getElementById("inputArea");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const soundBtn = document.getElementById("soundBtn");

let step = -1;
let city = "";
let animal = "";
let soundOn = false;
let audioCtx = null;
let isAnimating = false;

function renderLineNumbers() {
  lineNumbersEl.innerHTML = "";
  for (let i = 1; i <= 28; i++) {
    const num = document.createElement("div");
    num.textContent = i;
    lineNumbersEl.appendChild(num);
  }
}

function ensureAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

function beep({ frequency = 880, duration = 0.03, volume = 0.015, type = "square" } = {}) {
  if (!soundOn) return;
  ensureAudio();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  oscillator.start(now);
  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.stop(now + duration);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scrollConsole() {
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function addLine(text = "", className = "muted", prefix = "") {
  const line = document.createElement("div");
  line.className = `console-line ${className}`;

  if (prefix) {
    const prefixSpan = document.createElement("span");
    prefixSpan.className = "console-prefix";
    prefixSpan.textContent = prefix;
    line.appendChild(prefixSpan);
  }

  const textSpan = document.createElement("span");
  textSpan.textContent = text;
  line.appendChild(textSpan);

  consoleEl.appendChild(line);
  scrollConsole();
  return line;
}

async function typeLine(text, className = "muted", prefix = "", speed = 18) {
  const line = document.createElement("div");
  line.className = `console-line ${className}`;

  if (prefix) {
    const prefixSpan = document.createElement("span");
    prefixSpan.className = "console-prefix";
    prefixSpan.textContent = prefix;
    line.appendChild(prefixSpan);
  }

  const textSpan = document.createElement("span");
  const cursor = document.createElement("span");
  cursor.className = "console-cursor";

  line.appendChild(textSpan);
  line.appendChild(cursor);
  consoleEl.appendChild(line);
  scrollConsole();

  for (let i = 0; i < text.length; i++) {
    textSpan.textContent += text[i];
    if (text[i] !== " ") {
      beep({
        frequency: 1200 + Math.random() * 200,
        duration: 0.015,
        volume: 0.006,
        type: "square"
      });
    }
    scrollConsole();
    await wait(speed);
  }

  cursor.remove();
  return line;
}

function setInputEnabled(enabled) {
  userInput.disabled = !enabled;
  submitBtn.disabled = !enabled;
  if (enabled) userInput.focus();
}

function showStartScreen() {
  step = -1;
  city = "";
  animal = "";
  isAnimating = false;

  consoleEl.innerHTML = "";
  addLine("Click the Run button below to run the final project you will build.", "brand");

  inputArea.style.display = "none";
  setInputEnabled(false);
  userInput.value = "";
}

async function startProgram() {
  if (isAnimating) return;

  step = 0;
  city = "";
  animal = "";
  isAnimating = true;

  consoleEl.innerHTML = "";
  inputArea.style.display = "block";
  setInputEnabled(false);
  userInput.value = "";

  await typeLine("Welcome to the Superhero Name Generator.", "brand", "", 18);
  await typeLine("What's the name of the city you grew up in?", "question", "", 16);

  isAnimating = false;
  setInputEnabled(true);
}

function addUserLine(value) {
  addLine(value, "input", "•");
  beep({ frequency: 700, duration: 0.04, volume: 0.02, type: "triangle" });
}

async function finishProgram() {
  isAnimating = true;
  setInputEnabled(false);

  await wait(180);
  await typeLine(`Your superhero name could be ${city} ${animal}`, "result", "", 20);

  isAnimating = false;
}

async function handleInput() {
  const value = userInput.value.trim();
  if (!value || userInput.disabled || isAnimating) return;

  addUserLine(value);
  userInput.value = "";

  if (step === 0) {
    city = value;
    step = 1;
    setInputEnabled(false);
    isAnimating = true;

    await wait(220);
    await typeLine("What's your favorite animal?", "question", "", 16);

    isAnimating = false;
    setInputEnabled(true);
  } else if (step === 1) {
    animal = value;
    step = 2;
    await finishProgram();
  }
}

submitBtn.addEventListener("click", handleInput);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleInput();
  }
});

runBtn.addEventListener("click", () => {
  startProgram();
});

resetBtn.addEventListener("click", () => {
  showStartScreen();
});

soundBtn.addEventListener("click", async () => {
  soundOn = !soundOn;
  ensureAudio();

  if (audioCtx && audioCtx.state === "suspended") {
    try {
      await audioCtx.resume();
    } catch (e) {}
  }

  soundBtn.textContent = soundOn ? "Sound: On" : "Sound: Off";

  if (soundOn) {
    beep({ frequency: 880, duration: 0.05, volume: 0.02, type: "sine" });
    setTimeout(() => {
      beep({ frequency: 1200, duration: 0.06, volume: 0.018, type: "sine" });
    }, 70);
  }
});

renderLineNumbers();
showStartScreen();
