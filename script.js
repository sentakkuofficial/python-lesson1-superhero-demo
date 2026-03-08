const consoleEl = document.getElementById("console");
const lineNumbersEl = document.getElementById("lineNumbers");
const inputArea = document.getElementById("inputArea");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");

let step = -1;
let city = "";
let animal = "";
let isAnimating = false;

function renderLineNumbers() {
  lineNumbersEl.innerHTML = "";
  for (let i = 1; i <= 28; i++) {
    const num = document.createElement("div");
    num.textContent = i;
    lineNumbersEl.appendChild(num);
  }
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  const line = document.createElement("div");
  line.className = "console-line brand";
  line.innerHTML =
    'Click <span class="run-link" id="runLink">RUN</span> to run the final project you will build.';

  consoleEl.appendChild(line);
  scrollConsole();

  inputArea.style.display = "none";
  setInputEnabled(false);
  userInput.value = "";

  const runLink = document.getElementById("runLink");
  runLink.addEventListener("click", startProgram);
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

  await typeLine("Welcome to the Superhero Name Generator.", "brand");
  await typeLine("What's the name of the city you grew up in?", "question");

  isAnimating = false;
  setInputEnabled(true);
}

function addUserLine(value) {
  addLine(value, "input", "•");
}

async function finishProgram() {
  isAnimating = true;
  setInputEnabled(false);

  await wait(180);
  await typeLine(`Your superhero name could be ${city} ${animal}`, "result");

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
    await typeLine("What's your favorite animal?", "question");

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

renderLineNumbers();
showStartScreen();
