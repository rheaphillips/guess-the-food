//////////////// GLOBAL VARIABLES ////////////////

const groceryWords = [
  "apple",
  "grape",
  "peach",
  "mango",
  "lemon",
  "onion",
  "beans",
  "chard",
  "bacon",
  "steak",
  "roast",
  "cream",
  "gouda",
  "bread",
  "bagel",
  "pasta",
  "penne",
  "ramen",
  "flour",
  "sugar",
  "honey",
  "cumin",
  "thyme",
  "basil",
  "jelly",
  "yeast",
  "cocoa",
  "chips",
  "candy",
  "dates",
  "sushi",
  "juice",
  "broth",
  "stock",
  "mochi",
  "salsa",
  "pesto",
  "gravy",
  "decaf",
  "latte",
  "oreos",
  "guava",
  "pizza",
  "toast",
  "pears",
  "olive",
  "salad",
  "berry",
  "sauce",
  "spice",
  "wafer",
  "hazel",
  "curry",
  "cider",
  "tacos",
  "water",
  "melon",
  "limes",
  "beets",
  "snail",
  "leeks",
  "mints",
  "herbs",
  "grits",
  "crabs",
  "donut",
  "wheat",
  "fries",
  "cacao",
  "fudge",
  "icing",
  "scone",
  "pecan",
  "cakes",
  "kebab",
  "wings",
  "nacho",
  "chive",
  "dairy",
  "clams",
  "fruit",
  "crepe",
  "seeds",
  "pitas",
  "tarts",
  "prune",
  "mocha",
  "syrup",
  "ranch",
  "clove",
  "eggos",
  "okras",
  "plums",
  "prawn",
  "rolls",
  "tikka",
  "penne",
  "squid",
  "wraps",
  "tapas",
  "jello",
  "trout",
  "grain",
  "meats",
  "humus",
  "saute",
];

const classes = [
    "grid",
    "confetti-container",
    "overlay",
    "win-modal",
    "lose-modal",
    "keyboard",
    "play-again",
    "play-again-lose",
    "hint-button",
    "hint-image",
    "restart-button",
    "menu-button",
    "close-button",
    "logo",
    "nav-btns",
  ],
  colourStates = ["correct", "present", "absent"],
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  keyLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
  ];

let affData,
  dicData,
  dictionary,
  elems,
  words,
  hints,
  wordNum,
  letterNum,
  numOfCorrectLetters,
  chosen,
  entered,
  numOfHints,
  letterStates = {},
  revealedLetters = new Set([]),
  revealedHints = new Set([]);

//////////////// IMPORTS ////////////////

import * as help from "./help.js";
import * as selectElements from "./selectElements.js";

//////////////// CREATING THE DICTIONARY ////////////////

const createDictionary = async function () {
  affData = await fetch("typo/dictionaries/en_US.aff").then((r) => r.text());
  dicData = await fetch("typo/dictionaries/en_US.dic").then((r) => r.text());
  dictionary = new Typo("en_US", affData, dicData, { platform: "any" });
};

//////////////// MAIN GRID FUNCTIONS ////////////////

const createGrid = function () {
  elems.grid.innerHTML = "";
  elems.grid.style.gridTemplateColumns = `repeat(${chosen.length}, 50px)`;
  elems.grid.style.maxWidth = `${chosen.length * 75}px`;
};

const createBoxes = function () {
  createGrid();
  let box, hintBox, word, hint;
  for (let i = 0; i < 6; i++) {
    word = [];
    hint = [];
    for (let j = 0; j < chosen.length; j++) {
      box = document.createElement("div");
      hintBox = document.createElement("div");
      box.classList.add("guess-the-food-box");
      hintBox.classList.add("guess-the-food-box");
      hintBox.classList.add("guess-the-food-hintBox");
      hintBox.innerHTML = chosen[j];
      if (chosen[j] != " ") box.classList.add("guess-the-food-text-box");
      word.push(box);
      hint.push(hintBox);
      flipBox(box, (i + 1) * 100);
    }
    words.push(word);
    hints.push(hint);
  }
  words[0][0].classList.add("active");
};

const flipBox = function (box, delay) {
  setTimeout(() => {
    elems.grid.appendChild(box);
    box.classList.add("flip");
    setTimeout(() => {
      box.classList.remove("flip");
    }, delay * 2);
  }, delay);
};

//////////////// KEYBOARD FUNCTIONS ////////////////

const createKeyboard = function () {
  keyLayout.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "guess-the-food-keyboard-row";
    row.forEach((key) => {
      let keyEl = document.createElement("div");
      if (key == "backspace") {
        let keyElIcon = document.createElement("i");
        keyElIcon.classList.add("material-icons");
        keyElIcon.innerHTML = key;
        keyEl.appendChild(keyElIcon);
      } else {
        keyEl.innerHTML = key;
      }
      keyEl.setAttribute("data-key", key);
      [
        "guess-the-food-box",
        "guess-the-food-text-box",
        "guess-the-food-key",
      ].forEach((cls) => keyEl.classList.add(cls));
      rowEl.appendChild(keyEl);
    });

    elems.keyboard.appendChild(rowEl);
  });
};

const accessKey = (letter) => document.querySelector(`[data-key="${letter}"]`);
const clearKeyboard = () =>
  alphabet.forEach((letter) =>
    colourStates.forEach((cls) => accessKey(letter).classList.remove(cls))
  );

const toggleNavbar = function () {
  elems.navBtns.classList.toggle("guess-the-food-hidden");
  elems.logo.classList.toggle("guess-the-food-hidden");
  elems.menuButton.classList.toggle("guess-the-food-hidden");
};

//////////////// GENERATING A WORD ////////////////

const randomizeWord = function () {
  [chosen] = groceryWords.splice(
    Math.round(Math.random() * (groceryWords.length - 1)),
    1
  );
  chosen = chosen.toUpperCase().split("");
  entered = chosen.map((elem) => (elem == " " ? " " : ""));
  chosen.forEach((elem, i) => {
    if (elem == " ") {
      revealedLetters.add(i);
      revealedHints.add(i);
    }
  });
};

//////////////// HINT FUNCTIONS ////////////////

const giveHint = function () {
  if (revealedLetters.size < chosen.length && numOfHints > 0) {
    numOfHints--;
    let index;
    do {
      index = Math.round(Math.random() * (chosen.length - 1));
    } while (revealedLetters.has(index) || chosen[index] == " ");
    revealedLetters.add(index);
    revealedHints.add(index);
    numOfCorrectLetters++;
    entered[index] = chosen[index];
    words[wordNum][index].innerHTML = chosen[index];
    letterStates[chosen[index]] = "correct";
    updateLetterColor("correct", chosen[index], wordNum, index);
    elems.hintImage.src = `./assets/hint-${numOfHints}.png`;
    if (entered.join("") === chosen.join("")) win();
    while (
      revealedLetters.has(letterNum) &&
      words[wordNum][letterNum].textContent
    ) {
      words[wordNum][letterNum].classList.remove("active");
      letterNum++;
      words[wordNum][letterNum].classList.add("active");
    }
  } else {
    elems.hintButton.classList.add("guess-the-food-invalid");
    setTimeout(
      () => elems.hintButton.classList.remove("guess-the-food-invalid"),
      500
    );
  }
};

//////////////// LETTER COLOURS ////////////////

const updateLetterColor = function (state, letter, wordNum, i) {
  words[wordNum][i].classList.add(state);
  accessKey(letter)?.classList.remove(...colourStates);
  accessKey(letter)?.classList.add(letterStates[letter]);
};

const revealColours = function (wordNum, states) {
  words[wordNum].forEach((letter, i) => {
    setTimeout(() => {
      letter.classList.add("flip");
      setTimeout(() => {
        updateLetterColor(states[i], letter.textContent, wordNum, i);
      }, 300);
    }, i * 300);
  });
};

//////////////// END OF GAME ////////////////

const win = function () {
  setTimeout(() => {
    confetti();
    elems.overlay.classList.remove("guess-the-food-hidden");
    elems.winModal.classList.remove("guess-the-food-hidden");
  }, 1800);
};

const lose = function () {
  setTimeout(() => {
    document.querySelector(
      ".guess-the-food-reveal-word"
    ).textContent = `Word: ${chosen.join("")}`;
    elems.overlay.classList.remove("guess-the-food-hidden");
    elems.loseModal.classList.remove("guess-the-food-hidden");
  }, 1800);
};

const confetti = function () {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("guess-the-food-confetti");
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.width = `${Math.random() * 6 + 4}px`;
    confetti.style.height = `${Math.random() * 6 + 4}px`;
    elems.confettiContainer.appendChild(confetti);
  }
};

//////////////// EVALUATING PLAYER INPUT ////////////////

const evalKey = function (key) {
  let curLetter = words[wordNum][letterNum];

  if (letterNum < chosen.length && alphabet.includes(key)) {
    if (revealedLetters.has(letterNum)) {
      if (chosen[letterNum] == key) {
        curLetter.classList.add("correct");
      } else {
        curLetter.classList.remove("correct");
      }
    }
    curLetter.innerHTML = key;
    entered[letterNum] = key;
    words[wordNum][letterNum].classList.remove("active");
    if (letterNum < chosen.length - 1)
      words[wordNum][letterNum + 1].classList.add("active");
    letterNum++;
    if (letterStates[key] == "absent") curLetter.classList.add("absent");
    if (chosen[letterNum] == " ") {
      words[wordNum][letterNum].innerHTML = " ";
      letterNum++;
      words[wordNum][letterNum].classList.add("active");
    }
    while (
      revealedLetters.has(letterNum) &&
      alphabet.includes(words[wordNum][letterNum].innerHTML) &&
      letterNum < 4
    ) {
      words[wordNum][letterNum].classList.remove("active");
      letterNum++;
      words[wordNum][letterNum].classList.add("active");
    }
  }

  if (
    key == "ENTER" &&
    words[wordNum].every((letter) => letter.innerHTML) &&
    (entered.join("") === chosen.join("") ||
      groceryWords.includes(entered.join("").toLowerCase()) ||
      dictionary.check(entered.join("")))
  ) {
    let states = [];
    entered.forEach((letter, i) => {
      if (letter == chosen[i]) {
        states.push("correct");
        numOfCorrectLetters++;
        revealedLetters.add(i);
      } else if (
        chosen.includes(letter) &&
        !entered.some(
          (cur, j) => cur == letter && (j < i || chosen[j] == letter)
        )
      )
        states.push("present");
      else states.push("absent");

      if (
        states.at(-1) == "correct" ||
        !(
          letterStates[letter] == "correct" || letterStates[letter] == "present"
        )
      )
        letterStates[letter] = states.at(-1);
    });

    revealColours(wordNum, states);

    if (entered.join("") === chosen.join("")) win();
    else if (wordNum === 5) lose();
    else {
      wordNum++;
      resetRow([...new Array(revealedHints)]);
      words[wordNum][letterNum].classList.add("active");
    }
  } else if (key == "ENTER") {
    accessKey("Enter").classList.add("guess-the-food-invalid");
    setTimeout(
      () => accessKey("Enter").classList.remove("guess-the-food-invalid"),
      500
    );
  }

  if (key == "BACKSPACE") {
    if (letterNum > 0) {
      if (letterNum < chosen.length)
        words[wordNum][letterNum].classList.remove("active");
      words[wordNum][letterNum - 1].classList.add("active");
      letterNum--;
      if (chosen[letterNum] == " ") {
        letterNum--;
        words[wordNum][letterNum].classList.remove("active");
        words[wordNum][letterNum].classList.add("active");
      }
      entered[letterNum] = "";
      curLetter = words[wordNum][letterNum];

      if (letterStates[curLetter.textContent] == "absent")
        curLetter.classList.remove("absent");
      if (letterStates[curLetter.textContent] == "correct")
        curLetter.classList.remove("correct");

      if (revealedHints.has(letterNum)) {
        curLetter.innerHTML = "";
        curLetter.appendChild(hints[wordNum][letterNum]);
      } else {
        curLetter.innerHTML = "";
      }
    } else {
      accessKey("backspace").classList.add("guess-the-food-invalid");
      setTimeout(
        () => accessKey("backspace").classList.remove("guess-the-food-invalid"),
        500
      );
    }
  }
};

//////////////// EVENT LISTENERS ////////////////

const createEventListeners = function () {
  document.addEventListener("keydown", (e) => evalKey(e.key.toUpperCase()));
  elems.keyboard.addEventListener("click", (e) => {
    if (e.target.classList.contains("guess-the-food-key")) {
      evalKey(e.target.getAttribute("data-key").toUpperCase());
    } else if (
      e.target?.parentElement.classList.contains("guess-the-food-key")
    ) {
      evalKey(e.target.parentElement.getAttribute("data-key").toUpperCase());
    }
  });
  [elems.playAgain, elems.playAgainLose].forEach((elem) =>
    elem.addEventListener("click", reset)
  );
  help.helpModalEventListeners();
  elems.restartButton.addEventListener("click", function () {
    this.blur();
    reset();
  });
  elems.hintButton.addEventListener("click", function () {
    this.blur();
    giveHint();
  });
  elems.menuButton.addEventListener("click", toggleNavbar);
  elems.closeButton.addEventListener("click", toggleNavbar);
};

//////////////// RESETTING GLOBAL VARIABLES ////////////////

const resetRow = function (rh) {
  numOfCorrectLetters = 0;
  letterNum = 0;
  entered = chosen.map((elem) => (elem == " " ? " " : ""));
  setTimeout(
    () =>
      [...rh].forEach((letterNum) =>
        words[wordNum][letterNum]?.appendChild(hints[wordNum][letterNum])
      ),
    1800
  );
};

const resetGlobalVars = function () {
  words = [];
  hints = [];
  wordNum = 0;
  chosen = [];
  numOfHints = 3;
  letterStates = {};
  revealedLetters.clear();
  revealedHints.clear();
  resetRow([...new Array(revealedHints)]);
  elems.confettiContainer.innerHTML = "";
  elems.hintImage.src = `./assets/hint-${numOfHints}.png`;
};

//////////////// NEW GAME AND INITIALIZATION ////////////////

const reset = function () {
  resetGlobalVars();
  clearKeyboard();
  randomizeWord();
  createBoxes();
  [elems.overlay, elems.winModal, elems.loseModal].forEach((elem) =>
    elem.classList.add("guess-the-food-hidden")
  );
};

const init = function () {
  elems = selectElements.selectDOMElements(classes);
  createDictionary();
  createKeyboard();
  help.createHelpModal();
  createEventListeners();
  reset();
};

init();
