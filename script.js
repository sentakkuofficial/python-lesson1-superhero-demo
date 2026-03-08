const consoleEl = document.getElementById("console");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");

let step = -1;
let city = "";
let animal = "";
let started = false;

function addLine(text, className = "output") {
  const line = document.createElement("div");
  line.className = `line ${className}`;
  line.textContent = text;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function startProgram() {
  consoleEl.innerHTML = "";
  step = 0;
  city = "";
  animal = "";
  started = true;

  addLine("Welcome to the Superhero Name Generator!");
  addLine("What city did you grow up in?", "question");
  userInput.disabled = false;
  submitBtn.disabled = false;
  userInput.focus();
}

function handleInput() {
  if (!started) return;

  const value = userInput.value.trim();
  if (value === "") return;

  addLine(">>> " + value, "user-answer");

  if (step === 0) {
    city = value;
    addLine("What is your favorite animal?", "question");
    step = 1;
  } else if (step === 1) {
    animal = value;
    addLine("Your superhero name could be " + city + " " + animal, "result");
    addLine("");
    addLine("Program complete. Press Reset to try again.");
    userInput.disabled = true;
    submitBtn.disabled = true;
    step = 2;
  }

  userInput.value = "";
  userInput.focus();
}

runBtn.addEventListener("click", startProgram);
submitBtn.addEventListener("click", handleInput);
resetBtn.addEventListener("click", startProgram);

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleInput();
  }
});

// Auto-load the demo once the page opens
startProgram();
