const groceryWords = ["apple", "banana", "orange", "grape", "pear", "peach", "plum", "cherry", "strawberry", "blueberry", "raspberry", "blackberry", "watermelon", "cantaloupe", "honeydew", "pineapple", "mango", "papaya", "kiwi", "caramel", "date", "pomegranate", "coconut", "lemon", "lime", "grapefruit", "tangerine", "nectarine", "apricot", "cranberry", "broccoli", "carrot", "potato", "sweet potato", "onion", "garlic", "celery", "spinach", "kale", "lettuce", "cabbage", "brussels sprouts", "cauliflower", "zucchini", "cucumber", "squash", "pumpkin", "bell pepper", "jalapeno", "chili pepper", "tomato", "corn", "peas", "green beans", "asparagus", "eggplant", "beet", "radish", "turnip", "leek", "mushroom", "parsnip", "artichoke", "avocado", "arugula", "bok choy", "collard greens", "fennel", "shallot", "chard", "beef", "chicken", "pork", "lamb", "turkey", "duck", "bacon", "ham", "sausage", "steak", "ground beef", "meatballs", "ribs", "salami", "prosciutto", "venison", "goat", "veal", "brisket", "roast", "milk", "cheese", "butter", "yogurt", "cream", "ice cream", "sour cream", "cottage cheese", "mozzarella", "cheddar", "parmesan", "feta", "blue cheese", "gouda", "ricotta", "cream cheese", "eggs", "almond milk", "soy milk", "oat milk", "bread", "bagel", "bun", "roll", "croissant", "tortilla", "pita", "naan", "english muffin", "biscuit", "pasta", "spaghetti", "macaroni", "fettuccine", "penne", "lasagna", "noodles", "ramen", "udon", "rice", "quinoa", "couscous", "barley", "bulgur", "oats", "granola", "flour", "sugar", "brown sugar", "powdered sugar", "honey", "maple syrup", "molasses", "corn syrup", "salt", "pepper", "cinnamon", "nutmeg", "cloves", "allspice", "ginger", "cumin", "coriander", "paprika", "chili powder", "turmeric", "mustard", "oregano", "thyme", "rosemary", "basil", "parsley", "sage", "dill", "bay leaf", "vanilla", "vinegar", "soy sauce", "hot sauce", "ketchup", "pan dulce", "mayonnaise", "barbecue sauce", "salad dressing", "olive oil", "canola oil", "vegetable oil", "coconut oil", "peanut butter", "jam", "jelly", "margarine", "shortening", "yeast", "baking powder", "baking soda", "chocolate", "cocoa", "chips", "candy", "cookies", "crackers", "pretzels", "popcorn", "nuts", "almonds", "cashews", "peanuts", "walnuts", "pecans", "sunflower seeds", "pumpkin seeds", "trail mix", "dried fruit", "raisins", "dates", "prunes", "apricots", "figs", "cereal", "cornflakes", "granola bars", "snack bars", "protein bars", "gochujang", "sushi", "jasmine rice", "parboiled rice", "chicken wings", "apple sauce", "soda", "juice", "orange juice", "apple juice", "grape juice", "cranberry juice", "lemonade", "iced tea", "coffee", "tea", "bottled water", "sparkling water", "sports drink", "energy drink", "wine", "beer", "apple pie", "cocktail mixer", "broth", "stock", "cheesecake", "shortcake", "blueberry pie", "cupcakes", "tuna", "lemon bars", "kimchi", "sesame oil", "pickles", "olives", "relish", "capers", "tofu", "tempeh", "seitan", "mochi", "cilantro", "seaweed", "miso", "sriracha", "horseradish", "wasabi", "chutney", "salsa", "guacamole", "hummus", "baba ganoush", "tzatziki", "pesto", "gravy", "ranch dressing", "caesar dressing", "italian dressing", "balsamic vinegar", "red wine vinegar", "white vinegar", "apple cider vinegar", "rice vinegar", "mustard seeds", "tamarind", "lime juice", "lemon zest", "orange zest", "fennel seeds", "cardamom", "star anise", "anchovies", "bouillon", "chocolate muffin", "organic", "whole wheat", "diet coke", "oat milk", "palm oil", "decaf", "instant coffee", "espresso", "latte", "cappuccino", "cold brew", "macchiato", "kidney beans", "chickpeas", "green tea", "blackeyed peas", "black beans", "chamomile", "mint", "hibiscus", "compliments", "kombucha", "almond", "hazelnut", "macadamia", "pistachio", "brie", "camembert", "provolone", "swiss cheese", "monterey jack", "halloumi", "paneer", "ghee", "lard", "duck fat", "truffle", "mushroom powder", "saffron", "lemongrass", "lime leaves", "banana leaf", "nori", "kombu", "wakame", "anchovy paste", "soya chunks", "oyster sauce", "hoisin sauce", "teriyaki sauce", "mirin", "sake", "udon noodles", "soba noodles", "glass noodles", "vermicelli", "bean sprouts", "water chestnuts", "bamboo shoots", "lotus root", "jackfruit", "durian", "longan", "lychee", "rambutan", "tamarillo", "starfruit", "guava", "passion fruit", "dragonfruit", "persimmon", "breadfruit", "plantain", "cassava", "yam", "taro", "jicama", "okra", "chayote", "nopales"];

let classes = ['grid', 'confetti-container', 'overlay', 'win-modal', 'lose-modal', 'keyboard', 'play-again', 'play-again-lose', 'hint-button', 'restart-button'], elems = {}, states = ['correct', 'present', 'absent'];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), keyLayout = [['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L'], ['Enter','Z','X','C','V','B','N','M','Backspace']];

let affData, dicData, dictionary;
let words, wordNum, letterNum, numOfCorrectLetters, chosen, entered, letterStates = {}, revealedLetters = new Set([]);

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
  letterStates = {};
  revealedLetters.clear();
  resetRow();
  elems.confettiContainer.innerHTML = '';
}

const accessKey = (letter) => document.querySelector(`[data-key="${letter}"]`);

const clearKeyboard = () => alphabet.forEach((letter) => states.forEach((cls) => accessKey(letter).classList.remove(cls)));

const randomizeWord = function () {
  [chosen] = groceryWords.splice(Math.round(Math.random()*(groceryWords.length - 1)), 1);
  chosen = chosen.toUpperCase().split('');
  entered = chosen.map((elem) => elem == ' ' ? ' ' : '');
  chosen.forEach((elem, i) => {if (elem == ' ') revealedLetters.add(i)});
  console.log('New word:', chosen);
}

const giveHint = function () {
  if (revealedLetters.size < chosen.length) {
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
    if (entered.join('') === chosen.join('')) win(); 
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

const updateLetterColor = function (state, letter, i, letterStates) {
  words[wordNum][i].classList.add(state);
  accessKey(letter)?.classList.remove(...states);
  accessKey(letter)?.classList.add(letterStates[letter]);
}  

const validEntry = (key) => key == "ENTER" && words[wordNum].every((letter) => alphabet.includes(letter.innerHTML) || letter.innerHTML == ' ') && (entered.join('') === chosen.join('') || groceryWords.includes(entered.join('').toLowerCase()) || entered.every((word) => dictionary.check(word)));

const win = function () {
  confetti();
  elems.overlay.classList.remove('hidden');
  elems.winModal.classList.remove('hidden');
}

const lose = function () {
  document.getElementById('reveal-word').textContent = `Word: ${chosen}`;
  elems.overlay.classList.remove('hidden');
  elems.loseModal.classList.remove('hidden');
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
    if (revealedLetters.has(letterNum) && alphabet.includes(words[wordNum][letterNum].innerHTML)) {
      words[wordNum][letterNum].classList.remove('active');
      letterNum++;
      words[wordNum][letterNum].classList.add('active');
    }
  }

  if (validEntry(key)) {
    entered.forEach((letter, i) => {
      let state = null;
      if (letter == chosen[i]) {
        state = 'correct';
        numOfCorrectLetters++;
        revealedLetters.add(i);
      } 
      else if (chosen.includes(letter) && !entered.some((cur, j) => cur == letter && (j < i || chosen[j] == letter))) state = 'present';
      else state = 'absent';

      if (state == 'correct' || !(letterStates[letter] == 'correct'|| letterStates[letter] == 'present')) letterStates[letter] = state;
      updateLetterColor(state, letter, i, letterStates);

    });

    if (entered.join('') === chosen.join('')) win();
    else if (wordNum === 5) lose();

    resetRow();
    wordNum++;
    words[wordNum][letterNum].classList.add('active');
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