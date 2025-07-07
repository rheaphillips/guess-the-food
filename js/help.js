export function createHelpModal() {
  const html = `
  <button class="close-modal">&times;</button>
  <h1>Instructions</h1>
  <h2>Guess the 5-letter food item in 6 tries!</h2>
  <ul>
    <li>Each guess must be a valid food item that is 5 letters long</li>
    <li>After entering each word, the colour of the tiles change to reveal how close your guess was to the word</li>
    <li>Click <img src="assets/hint-0.png" class="help-img"> for upto three hints</li>
    <li>Click  <img src="assets/restart.png" class="help-img">   to reshuffle the word</li>
  </ul>
  <h2>Examples</h2>
  <img src="assets/instructions-1.png" alt="correct letter" class="modal-img">
  <p>I is in the word and in the correct spot</p>
  <img src="assets/instructions-2.png" alt="present letter" class="modal-img">
  <p>U is in the word but in the wrong spot.</p>
  <img src="assets/instructions-3.png" alt="absent letter" class="modal-img">
  <p>T is not in the word in any spot.</p>`;

  document.querySelector('.help-modal').insertAdjacentHTML('afterbegin', html);
}

export function helpModalEventListeners() {
  const helpModal = document.querySelector('.help-modal'), helpButton = document.querySelector('.help-button'), closeModal = document.querySelector('.close-modal'), overlay = document.querySelector('.overlay');

  helpButton.addEventListener('click', function () {
    helpModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  });

  const closeHelpModal = function () {
    helpModal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  overlay.addEventListener('click', closeHelpModal);
  closeModal.addEventListener('click', closeHelpModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") closeHelpModal();
  })
}
