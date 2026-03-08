const consoleEl = document.getElementById("console");

console.log("script loaded");

if (consoleEl) {
  consoleEl.innerHTML = '<div class="console-line brand">JavaScript is working.</div>';
} else {
  console.log("console element not found");
}
