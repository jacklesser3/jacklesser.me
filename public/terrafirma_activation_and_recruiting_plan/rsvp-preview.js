const demoForm = document.querySelector("#demo-signup");
const demo = document.querySelector("#demo");
const result = document.querySelector("#preview-result");

demoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selection = demo.selectedOptions[0].text;
  result.textContent = `Sample confirmation for ${selection} Check in with the host at the demo sign-up table. We’ll call you when the operator is ready.`;
});
demo.addEventListener("change", () => {
  result.textContent = "";
});
demoForm.querySelector("button").disabled = false;
