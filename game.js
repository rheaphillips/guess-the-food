let container = document.querySelector('.confetti-container'), overlay = document.querySelector('.overlay'), winModal = document.querySelector('.win-modal'), loseModal = document.querySelector('.lose-modal'); 

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

let affData, dicData, dictionary;
window.onload = async function () {
  // Load dictionary files as plain text
  affData = await fetch('typo/dictionaries/en_US.aff').then(r => r.text());
  dicData = await fetch('typo/dictionaries/en_US.dic').then(r => r.text());

  // Create dictionary
  dictionary = new Typo('en_US', affData, dicData, { platform: 'any' });
};

const groceryWords = ["apple", "banana", "orange", "grape", "pear", "peach", "plum", "cherry", "strawberry", "blueberry", "raspberry", "blackberry", "watermelon", "cantaloupe", "honeydew", "pineapple", "mango", "papaya", "kiwi", "fig", "date", "pomegranate", "coconut", "lemon", "lime", "grapefruit", "tangerine", "nectarine", "apricot", "cranberry", "broccoli", "carrot", "potato", "sweet potato", "onion", "garlic", "celery", "spinach", "kale", "lettuce", "cabbage", "brussels sprouts", "cauliflower", "zucchini", "cucumber", "squash", "pumpkin", "bell pepper", "jalapeno", "chili pepper", "tomato", "corn", "peas", "green beans", "asparagus", "eggplant", "beet", "radish", "turnip", "leek", "mushroom", "parsnip", "artichoke", "avocado", "arugula", "bok choy", "collard greens", "fennel", "shallot", "chard", "beef", "chicken", "pork", "lamb", "turkey", "duck", "bacon", "ham", "sausage", "steak", "ground beef", "meatballs", "ribs", "salami", "prosciutto", "venison", "goat", "veal", "brisket", "roast", "milk", "cheese", "butter", "yogurt", "cream", "ice cream", "sour cream", "cottage cheese", "mozzarella", "cheddar", "parmesan", "feta", "blue cheese", "gouda", "ricotta", "cream cheese", "eggs", "almond milk", "soy milk", "oat milk", "bread", "bagel", "bun", "roll", "croissant", "tortilla", "pita", "naan", "english muffin", "biscuit", "pasta", "spaghetti", "macaroni", "fettuccine", "penne", "lasagna", "noodles", "ramen", "udon", "rice", "quinoa", "couscous", "barley", "bulgur", "oats", "granola", "flour", "sugar", "brown sugar", "powdered sugar", "honey", "maple syrup", "molasses", "corn syrup", "salt", "pepper", "cinnamon", "nutmeg", "cloves", "allspice", "ginger", "cumin", "coriander", "paprika", "chili powder", "turmeric", "mustard", "oregano", "thyme", "rosemary", "basil", "parsley", "sage", "dill", "bay leaf", "vanilla", "vinegar", "soy sauce", "hot sauce", "ketchup", "pan dulce", "mayonnaise", "barbecue sauce", "salad dressing", "olive oil", "canola oil", "vegetable oil", "coconut oil", "peanut butter", "jam", "jelly", "margarine", "shortening", "yeast", "baking powder", "baking soda", "chocolate", "cocoa", "chips", "candy", "cookies", "crackers", "pretzels", "popcorn", "nuts", "almonds", "cashews", "peanuts", "walnuts", "pecans", "sunflower seeds", "pumpkin seeds", "trail mix", "dried fruit", "raisins", "dates", "prunes", "apricots", "figs", "cereal", "cornflakes", "granola bars", "snack bars", "protein bars", "gochujang", "sushi", "jasmine rice", "parboiled rice", "chicken wings", "apple sauce", "soda", "juice", "orange juice", "apple juice", "grape juice", "cranberry juice", "lemonade", "iced tea", "coffee", "tea", "bottled water", "sparkling water", "sports drink", "energy drink", "wine", "beer", "apple pie", "cocktail mixer", "broth", "stock", "cheesecake", "shortcake", "blueberry pie", "cupcakes", "tuna", "lemon bars", "kimchi", "sesame oil", "pickles", "olives", "relish", "capers", "tofu", "tempeh", "seitan", "mochi", "cilantro", "seaweed", "miso", "sriracha", "horseradish", "wasabi", "chutney", "salsa", "guacamole", "hummus", "baba ganoush", "tzatziki", "pesto", "gravy", "ranch dressing", "caesar dressing", "italian dressing", "balsamic vinegar", "red wine vinegar", "white vinegar", "apple cider vinegar", "rice vinegar", "mustard seeds", "tamarind", "lime juice", "lemon zest", "orange zest", "fennel seeds", "cardamom", "star anise", "anchovies", "bouillon", "chocolate muffin", "organic", "whole wheat", "diet coke", "oat milk", "palm oil", "decaf", "instant coffee", "espresso", "latte", "cappuccino", "cold brew", "macchiato", "kidney beans", "chickpeas", "green tea", "blackeyed peas", "black beans", "chamomile", "mint", "hibiscus", "compliments", "kombucha", "almond", "hazelnut", "macadamia", "pistachio", "brie", "camembert", "provolone", "swiss cheese", "monterey jack", "halloumi", "paneer", "ghee", "lard", "duck fat", "truffle", "mushroom powder", "saffron", "lemongrass", "lime leaves", "banana leaf", "nori", "kombu", "wakame", "anchovy paste", "soya chunks", "oyster sauce", "hoisin sauce", "teriyaki sauce", "mirin", "sake", "udon noodles", "soba noodles", "glass noodles", "vermicelli", "bean sprouts", "water chestnuts", "bamboo shoots", "lotus root", "jackfruit", "durian", "longan", "lychee", "rambutan", "tamarillo", "starfruit", "guava", "passion fruit", "dragonfruit", "persimmon", "breadfruit", "plantain", "cassava", "yam", "taro", "jicama", "okra", "chayote", "nopales"];

const keyLayout = [['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L'], ['Enter','Z','X','C','V','B','N','M','Backspace']];

const keyboardContainer = document.querySelector('.keyboard');

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

  keyboardContainer.appendChild(rowEl);
});

let grid;
const displayGrid = function () {
  grid?.remove();
  grid = document.createElement('div');
  grid.classList.add('grid');
  document.body.appendChild(grid);
  grid.style.gridTemplateColumns = `repeat(${chosenWord.length}, 60px)`;
  grid.style.maxWidth = `${chosenWord.length * 70}px`;
}

let words;
const displayBoxes = function () {

  displayGrid();

  words = [];
  let box, word;
  for (let i = 0; i < 6; i++) {
    word = []
    for (let j = 0; j < chosenWord.length; j++) {
      box = document.createElement('div');
      box.classList.add('box');
      if (chosenWord[j] != ' ') box.classList.add('text-box');
      grid.appendChild(box);
      word.push(box);
    }
    words.push(word);
  }
}

let letterNum, wordNum, numOfCorrectLetters, chosenWord, enteredWord;
let correctLetters = new Set([]), presentLetters = new Set([]), absentLetters = new Set([]);
const reset = function () {
  letterNum = 0;
  wordNum = 0;
  numOfCorrectLetters = 0;
  enteredWord = '';

  [chosenWord] = groceryWords.splice(Math.round(Math.random()*(groceryWords.length - 1)), 1);
  chosenWord = chosenWord.toUpperCase();
  console.log('New word:', chosenWord);

  alphabet.forEach((letter) => ['correct', 'present', 'absent'].forEach((cls) => document.querySelector(`[data-key="${letter}"]`).classList.remove(cls)));

  displayBoxes();

  correctLetters.clear();
  presentLetters.clear();
  absentLetters.clear();

  container.innerHTML = '';
  [overlay, winModal, loseModal].forEach((elem) => elem.classList.add('hidden'));
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

    container.appendChild(confetti);
  }
}

const updateLetterColor = function (state, letter, i) {
  words[wordNum][i].classList.add(state);
  document.querySelector(`[data-key="${letter}"]`)?.classList.add(state);
}  

const validEntry = function (key) {
  return key == "ENTER" && letterNum == chosenWord.length && (enteredWord === chosenWord || groceryWords.includes(enteredWord.toLowerCase()) || enteredWord.split(' ').reduce((acc, word) => acc && dictionary.check(word), true));
}

const evalKey = function (key) {

  if (letterNum < chosenWord.length && alphabet.includes(key)) {
    words[wordNum][letterNum].innerHTML = key;
    enteredWord = enteredWord + key;
    if (absentLetters.has(key)) words[wordNum][letterNum].classList.add('absent');
    letterNum++;
    if (chosenWord[letterNum] == ' ') {
      enteredWord = enteredWord + ' ';
      letterNum++;
    } 
  }

  if (validEntry(key)) {
    enteredWord.split('').forEach((letter, i) => {
      let state = null;
      if (letter == chosenWord[i]) {
        numOfCorrectLetters++;
        state = 'correct';
        correctLetters.add(letter);
        absentLetters.delete(letter);
      } 
      else if (chosenWord.includes(letter) && chosenWord.split('').reduce((acc, cur, i) => acc & cur == letter ? words[wordNum][i].innerHTML != letter : acc, true)) {
        state = 'present';
        presentLetters.add(letter);
        absentLetters.delete(letter);
      } 
      else {
        state = 'absent';
        if (!(correctLetters.has(letter) || presentLetters.has(letter))) absentLetters.add(letter);
      }

      updateLetterColor(state, letter, i);

    });

    if (enteredWord === chosenWord) {
      confetti();
      overlay.classList.remove('hidden');
      winModal.classList.remove('hidden');
    } else if (wordNum === 5) {
      document.getElementById('reveal-word').textContent = `Word: ${chosenWord}`;
      overlay.classList.remove('hidden');
      loseModal.classList.remove('hidden');
    }

    enteredWord = '';
    numOfCorrectLetters = 0;
    letterNum = 0;
    wordNum++;
  }

  if (key == "BACKSPACE" && letterNum > 0) {
    letterNum--;
    enteredWord = enteredWord.slice(0, -1);
    if (absentLetters.has(words[wordNum][letterNum].innerHTML)) words[wordNum][letterNum].classList.remove('absent');
    if (chosenWord[letterNum] == ' ') letterNum--;
    words[wordNum][letterNum].innerHTML = '';
  }
}

window.addEventListener('keydown', e => evalKey(e.key.toUpperCase()));

keyboardContainer.addEventListener('click', e => !e.target.classList.contains('key') || evalKey(e.target.getAttribute('data-key').toUpperCase()));

[document.querySelector('.play-again'), document.querySelector('.play-again-lose')].forEach(elem => elem.addEventListener('click', reset));

reset();