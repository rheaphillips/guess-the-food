export function selectDOMElements(classes) {
  let elems = {};
  for (let i = 0; i < classes.length; i++) {
    let cls = classes[i].split('-').map((word, i) => i == 0 ? word : word[0].toUpperCase()+word.slice(1)).join('');
    elems[cls] = document.querySelector(`.${classes[i]}`);
  }
  return elems;
}