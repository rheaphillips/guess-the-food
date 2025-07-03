let groceryWords = ["apple", "grape", "peach", "mango", "lemon", "onion", "beans", "chard", "bacon", "steak", "roast", "cream", "gouda", "bread", "bagel", "pasta", "penne", "ramen", "flour", "sugar", "honey", "cumin", "thyme", "basil", "jelly", "yeast", "cocoa", "chips", "candy", "dates", "sushi", "juice", "broth", "stock", "mochi", "salsa", "pesto", "gravy", "decaf", "latte", "oreos", "guava", "pizza", "toast", "pears", "olive", "salad", "berry", "sauce", "spice", "wafer", "hazel", "curry", "cider", "tacos", "water", "melon", "limes", "beets", "snail", "leeks", "mints", "herbs", "grits", "crabs", "donut", "wheat", "fries", "cacao", "fudge", "icing", "scone", "pecan", "cakes", "kebab", "wings", "nacho", "chive", "dairy", "clams", "fruit", "crepe", "seeds", "pitas", "tarts", "prune", "mocha", "syrup", "ranch", "clove", "eggos", "okras", "plums", "prawn", "rolls", "tikka", "penne", "squid", "wraps", "tapas", "jello", "trout", "grain", "meats", "humus", "saute"];

let classes = ['grid', 'confetti-container', 'overlay', 'win-modal', 'lose-modal', 'keyboard', 'play-again', 'play-again-lose', 'hint-button', 'hint-image', 'restart-button'], elems = {}, colourStates = ['correct', 'present', 'absent'];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), keyLayout = [['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L'], ['Enter','Z','X','C','V','B','N','M','Backspace']];

let affData, dicData, dictionary;
let words, wordNum, letterNum, numOfCorrectLetters, chosen, entered, numOfHints, letterStates = {}, revealedLetters = new Set([]), revealed;

import * as help from './help.js';

const selectDOMElements = function () {
  for (let i = 0; i < classes.length; i++) {
    let cls = classes[i].split('-').map((word, i) => i == 0 ? word : word[0].toUpperCase()+word.slice(1)).join('');
    elems[cls] = document.querySelector(`.${classes[i]}`);
  }
}

const createDictionary = async function () {
  // Load dictionary files as plain text
  affData = await fetch('typo/dictionaries/en_US.aff').then(r => r.text());
  dicData = await fetch('typo/dictionaries/en_US.dic').then(r => r.text());

  // Create dictionary
  dictionary = new Typo('en_US', affData, dicData, { platform: 'any' });
};

const createKeyboard = function () {
  keyLayout.forEach(row => {
  const rowEl = document.createElement('div');
    rowEl.className = 'keyboard-row';

    row.forEach(key => {
      const keyEl = document.createElement('div');
      ['box', 'text-box', 'key'].forEach((cls) => keyEl.classList.add(cls));
      keyEl.textContent = key;
      keyEl.setAttribute('data-key', key);
      rowEl.appendChild(keyEl);
    });

    elems.keyboard.appendChild(rowEl);
  });
}

const resetRow = function () {
  numOfCorrectLetters = 0;
  letterNum = 0;
  entered = chosen.map((elem) => elem == ' ' ? ' ' : '');
}

const resetGlobalVars = function () {
  words = [];
  wordNum = 0;
  chosen = [];
  numOfHints = 3;
  letterStates = {};
  revealedLetters.clear();
  resetRow();
  elems.confettiContainer.innerHTML = '';
  elems.hintImage.src = `./assets/hint-${numOfHints}.png`;
}

const accessKey = (letter) => document.querySelector(`[data-key="${letter}"]`);

const clearKeyboard = () => alphabet.forEach((letter) => colourStates.forEach((cls) => accessKey(letter).classList.remove(cls)));

const randomizeWord = function () {
  [chosen] = groceryWords.splice(Math.round(Math.random()*(groceryWords.length - 1)), 1);
  chosen = chosen.toUpperCase().split('');
  entered = chosen.map((elem) => elem == ' ' ? ' ' : '');
  chosen.forEach((elem, i) => {if (elem == ' ') revealedLetters.add(i)});
  console.log('New word:', chosen);
}

const giveHint = function () {
  if (revealedLetters.size < chosen.length && numOfHints > 0) {
    numOfHints--;
    let index;
    do {
      index = Math.round(Math.random()*(chosen.length - 1));
    } while (revealedLetters.has(index) || chosen[index] == ' ')
    revealedLetters.add(index);
    numOfCorrectLetters++;
    entered[index] = chosen[index];
    words[wordNum][index].innerHTML = chosen[index];
    letterStates[chosen[index]] = 'correct';
    updateLetterColor('correct', chosen[index], index, letterStates);
    elems.hintImage.src = `./assets/hint-${numOfHints}.png`;
    if (entered.join('') === chosen.join('')) win(); 
    while (revealedLetters.has(letterNum) && alphabet.includes(words[wordNum][letterNum].innerHTML)) {
      words[wordNum][letterNum].classList.remove('active');
      letterNum++;
      words[wordNum][letterNum].classList.add('active');
    }
  }
}

const hideModals = function () {
  [elems.overlay, elems.winModal, elems.loseModal].forEach((elem) => elem.classList.add('hidden'));
}

const createGrid = function () {
  elems.grid.innerHTML = '';
  elems.grid.style.gridTemplateColumns = `repeat(${chosen.length}, 50px)`;
  elems.grid.style.maxWidth = `${chosen.length * 75}px`;
}

const createBoxes = function () {
  createGrid();
  let box, word;
  for (let i = 0; i < 6; i++) {
    word = []
    for (let j = 0; j < chosen.length; j++) {
      box = document.createElement('div');
      box.classList.add('box');
      if (chosen[j] != ' ') box.classList.add('text-box');
      elems.grid.appendChild(box);
      word.push(box);
    }
    words.push(word);
  }
  words[0][0].classList.add('active');
}

const createEventListeners = function () {
  document.addEventListener('keydown', e => evalKey(e.key.toUpperCase()));
  elems.keyboard.addEventListener('click', e => !e.target.classList.contains('key') || evalKey(e.target.getAttribute('data-key').toUpperCase()));
  [elems.playAgain, elems.playAgainLose].forEach(elem => elem.addEventListener('click', reset));
  help.helpModalEventListeners();
  elems.restartButton.addEventListener('click', function () {
    this.blur();
    reset();
  });
  elems.hintButton.addEventListener('click', function () {
    this.blur();
    giveHint();
  });
}

const reset = function () {
  resetGlobalVars();
  clearKeyboard();
  randomizeWord();
  createBoxes();
  hideModals();
}

const init = function () {
  selectDOMElements();
  createDictionary();
  createKeyboard();
  help.createHelpModal();
  createEventListeners();
  reset();
}

// Confetti function
const confetti = function () {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.width = `${Math.random() * 6 + 4}px`;
    confetti.style.height = `${Math.random() * 6 + 4}px`;
    elems.confettiContainer.appendChild(confetti);
  }
}

const validEntry = (key) => key == "ENTER" && words[wordNum].every((letter) => alphabet.includes(letter.innerHTML) || letter.innerHTML == ' ') && (entered.join('') === chosen.join('') || groceryWords.includes(entered.join('').toLowerCase()) || dictionary.check(entered.join('')));

const win = function () {
  setTimeout(() => {
    confetti();
    elems.overlay.classList.remove('hidden');
    elems.winModal.classList.remove('hidden');
  }, 1800);
}

const lose = function () {
  setTimeout(() => {
    document.getElementById('reveal-word').textContent = `Word: ${chosen.join('')}`;
    elems.overlay.classList.remove('hidden');
    elems.loseModal.classList.remove('hidden');
  }, 1800);
}

const updateLetterColor = function (state, letter, wordNum, i) {
  words[wordNum][i].classList.add(state);
  accessKey(letter)?.classList.remove(...colourStates);
  accessKey(letter)?.classList.add(letterStates[letter]);
}

const revealColours = function (wordNum, states) {
  words[wordNum].forEach((letter, i) => {
    setTimeout(() => {
      letter.classList.add('flip');
      setTimeout(() => {
        updateLetterColor(states[i], letter.innerHTML, wordNum, i);
      }, 300);
    }, i * 300);
  });
}

const evalKey = function (key) {

  let curLetter = words[wordNum][letterNum];

  if (letterNum < chosen.length && alphabet.includes(key)) {
    if (revealedLetters.has(letterNum)) chosen[letterNum] == key ? curLetter.classList.add('correct') : curLetter.classList.remove('correct');
    curLetter.innerHTML = key;
    entered[letterNum] = key;
    words[wordNum][letterNum].classList.remove('active');
    if (letterNum < chosen.length - 1) words[wordNum][letterNum + 1].classList.add('active');
    letterNum++;
    if (letterStates[key] == 'absent') curLetter.classList.add('absent');
    if (chosen[letterNum] == ' ') {
      words[wordNum][letterNum].innerHTML = ' ';
      letterNum++;
      words[wordNum][letterNum].classList.add('active');
    } 
    while (revealedLetters.has(letterNum) && alphabet.includes(words[wordNum][letterNum].innerHTML)) {
      words[wordNum][letterNum].classList.remove('active');
      letterNum++;
      words[wordNum][letterNum].classList.add('active');
    }
  }

  if (validEntry(key)) {
    let states = [];
    entered.forEach((letter, i) => {
      if (letter == chosen[i]) {
        states.push('correct');
        numOfCorrectLetters++;
        revealedLetters.add(i);
      } 
      else if (chosen.includes(letter) && !entered.some((cur, j) => cur == letter && (j < i || chosen[j] == letter))) states.push('present');
      else states.push('absent');

      if (states.at(-1) == 'correct' || !(letterStates[letter] == 'correct' || letterStates[letter] == 'present')) letterStates[letter] = states.at(-1);
    });

    revealColours(wordNum, states);

    if (entered.join('') === chosen.join('')) win();
    else if (wordNum === 5) lose(); 
    else {
      resetRow();
      wordNum++;
      words[wordNum][letterNum].classList.add('active');
    }
  }

  if (key == "BACKSPACE" && letterNum > 0) {
    if (letterNum < chosen.length) words[wordNum][letterNum].classList.remove('active');
    words[wordNum][letterNum - 1].classList.add('active');
    letterNum--;
    if (chosen[letterNum] == ' ') {
      letterNum--;
      words[wordNum][letterNum].classList.remove('active');
      words[wordNum][letterNum].classList.add('active');
    } 
    entered[letterNum] = '';
    curLetter = words[wordNum][letterNum];
    if (letterStates[curLetter.innerHTML] == 'correct') curLetter.classList.remove('correct');
    if (letterStates[curLetter.innerHTML] == 'absent') curLetter.classList.remove('absent');
    curLetter.innerHTML = '';
  }
}

init();