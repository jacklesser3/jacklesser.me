const demoForm = document.querySelector("#demo-signup");
const demo = document.querySelector("#demo");
const result = document.querySelector("#preview-result");

demoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selection = demo.selectedOptions[0].text.replace(/\.$/, "");
  result.textContent = `Sample demo confirmation — ${selection}. Check in with the station host. We’ll call you when your turn is ready.`;
});
demo.addEventListener("change", () => {
  result.textContent = "";
});
demoForm.querySelector("button").disabled = false;
