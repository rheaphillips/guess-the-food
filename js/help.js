export function createHelpModal() {
  const html = `
  <button class="guess-the-food-close-modal">&times;</button>
  <h1>Instructions</h1>
  <h2>Guess the 5-letter food item in 6 tries!</h2>
  <ul>
    <li>Each guess must be a valid food item that is 5 letters long</li>
    <li>After entering each word, the colour of the tiles change to reveal how close your guess was to the word</li>
    <li>Click <img src="assets/hint-0.png" class="guess-the-food-help-img"> for upto three hints</li>
    <li>Click  <img src="assets/restart.png" class="guess-the-food-help-img">   to reshuffle the word</li>
  </ul>
  <h2>Examples</h2>
  <img src="assets/instructions-1.png" alt="correct letter" class="guess-the-food-modal-img">
  <p>I is in the word and in the correct spot</p>
  <img src="assets/instructions-2.png" alt="present letter" class="guess-the-food-modal-img">
  <p>U is in the word but in the wrong spot.</p>
  <img src="assets/instructions-3.png" alt="absent letter" class="guess-the-food-modal-img">
  <p>T is not in the word in any spot.</p>`;

  document
    .querySelector(".guess-the-food-help-modal")
    .insertAdjacentHTML("afterbegin", html);
}

export function helpModalEventListeners() {
  const helpModal = document.querySelector(".guess-the-food-help-modal"),
    helpButton = document.querySelector(".guess-the-food-help-button"),
    closeModal = document.querySelector(".guess-the-food-close-modal"),
    overlay = document.querySelector(".guess-the-food-overlay");

  helpButton.addEventListener("click", function () {
    helpModal.classList.remove("guess-the-food-hidden");
    overlay.classList.remove("guess-the-food-hidden");
  });

  const closeHelpModal = function () {
    helpModal.classList.add("guess-the-food-hidden");
    overlay.classList.add("guess-the-food-hidden");
  };

  overlay.addEventListener("click", closeHelpModal);
  closeModal.addEventListener("click", closeHelpModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeHelpModal();
  });
}
