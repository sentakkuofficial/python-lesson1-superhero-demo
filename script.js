const consoleEl = document.getElementById("console");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const lineNumbersEl = document.getElementById("lineNumbers");

let step = 0;
let city = "";
let animal = "";

function renderLineNumbers() {
  lineNumbersEl.innerHTML = "";
  for (let i = 1; i <= 22; i++) {
    const num = document.createElement("div");
    num.textContent = i;
    lineNumbersEl.appendChild(num);
  }
}

function addLine(text, className = "") {
  const line = document.createElement("div");
  line.className = `console-line ${className}`.trim();
  line.textContent = text;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function startProgram() {
  step = 0;
  city = "";
  animal = "";

  consoleEl.innerHTML = "";

  addLine("Python 3.12.0", "muted");
  addLine(">>> Running main.py", "brand");
  addLine("", "muted");
  addLine("Welcome to the Superhero Name Generator!", "brand");
  addLine("What city did you grow up in?", "question");

  userInput.value = "";
  userInput.disabled = false;
  submitBtn.disabled = false;
  userInput.focus();
}

function finishProgram() {
  addLine(`Your superhero name could be ${city} ${animal}`, "result");
  addLine("", "muted");
  addLine("Program complete. Press Reset to try again.", "muted");
  userInput.disabled = true;
  submitBtn.disabled = true;
}

function handleInput() {
  const value = userInput.value.trim();
  if (!value || userInput.disabled) return;

  addLine(`❯ ${value}`, "input");

  if (step === 0) {
    city = value;
    addLine("What is your favorite animal?", "question");
    step = 1;
  } else if (step === 1) {
    animal = value;
    finishProgram();
    step = 2;
  }

  userInput.value = "";
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

submitBtn.addEventListener("click", handleInput);
runBtn.addEventListener("click", startProgram);
resetBtn.addEventListener("click", startProgram);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleInput();
  }
});

renderLineNumbers();
startProgram();
