const previewForm = document.querySelector("#preview-form");
const ticket = document.querySelector("#ticket");
const result = document.querySelector("#preview-result");

previewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const instruction = ticket.value === "ga"
    ? "Scan in any time from 5 to 9 p.m. Ask a host or use the queue QR for a walk-up demo turn."
    : "Scan in between 5 and 9 p.m. and confirm your demo block with its host. Arrive at the station ten minutes before your block if you can. The host will call you when your turn is ready.";
  const selection = ticket.selectedOptions[0].text.replace(/\.$/, "");
  result.textContent = `Sample ticket — ${selection}. ${instruction}`;
});
ticket.addEventListener("change", () => { result.textContent = ""; });
previewForm.querySelector("button").disabled = false;
