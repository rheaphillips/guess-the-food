const modal = document.querySelector('.modal'), overlay = document.querySelector('.overlay');

document.querySelector('.instructions-button').addEventListener('click', function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
});

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

overlay.addEventListener('click', closeModal);
document.querySelector('.close-modal').addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") closeModal();
})
