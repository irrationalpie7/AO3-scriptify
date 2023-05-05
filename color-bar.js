// @ts-check
const colorState = {num: 1, increase: false, locked: true, lockIndex: 0};

/**
 * Update color bar (e.g. if there's a new)
 *
 * @param {number} i
 */
function addColorToColorBar(i) {
  const buttonList = document.querySelector('#scriptify-button-list');

  const button = document.createElement('button');
  button.id = `scriptify-button-${i}`;
  button.classList.add(`color-${i}`);
  button.textContent = `Lock to color ${i}`;
  button.addEventListener('click', () => {
    const prevActive = buttonList?.querySelector('active-button');
    if (prevActive) {
      /**@type {HTMLButtonElement}*/ (prevActive).disabled = false;
      prevActive.classList.remove('active-button');
    }

    button.disabled = true;
    button.classList.add('active-button');
    colorState.locked = true;
    colorState.lockIndex = i;
  });

  const listItem = document.createElement('li');
  buttonList?.appendChild(listItem);
  listItem.appendChild(button);
}

/**
 * Cycle through to the next quote color.
 *
 * @param {HTMLElement} quote
 */
function click(quote) {
  if (!quote.classList.contains('active-quote')) {
    return;
  }
  const curColor = Number(quote.dataset.color);
  let newColor = curColor + 1;
  if (colorState.locked) {
    newColor = colorState.lockIndex;
    while (colorState.lockIndex >= colorState.num) {
      colorState.num++;
      addColorToColorBar(colorState.num);
      colorState.increase = false;
    }
  }

  if (colorState.increase) {
    // We've previously marked that we want to permanently increase the number
    // of dialogue colors, so do that now....
    // *unless* we are already the new dialogue color and are trying to rotating back
    if (curColor !== colorState.num) {
      colorState.num++;
      colorState.increase = false;
      addColorToColorBar(colorState.num);
    } else {
      newColor = 0;
      colorState.increase = false;
    }
  }

  if (newColor === colorState.num) {
    colorState.increase = true;
  }

  quote.classList.remove(`color-${curColor}`);
  quote.classList.add(`color-${newColor}`);
  quote.dataset.color = `${newColor}`;
}

/**
 * Make quotes clickable
 *
 * @param {HTMLElement} quote
 */
function enableQuoteClicking(quote) {
  // make quote act like a button:
  quote.role = 'button';
  quote.tabIndex = 0;
  quote.classList.add('active-quote');
  const thisQuote = quote;
  quote.addEventListener('click', () => click(thisQuote));
  quote.addEventListener('keyDown', e => {
    if (
      /**@type {KeyboardEvent}*/ (e).key === 'Enter' ||
      /**@type {KeyboardEvent}*/ (e).key === ' '
    ) {
      click(thisQuote);
    }
  });
}

/**
 * Inject color bar
 * 
 * @returns {HTMLDivElement} 
 */
function injectColorBar() {
  const colorBar = document.createElement('div');
  colorBar.id = 'color-bar';
  colorBar.classList.add('hidden');
  const work = document.querySelector('#workskin');
  work?.parentNode?.insertBefore(colorBar, work);

  
  const warning = document.createElement('p');
  warning.innerHTML =
    'Warning: once you start color-coding dialogue, refreshing the page <em>will</em> ruin all your hard work! To save, use ctrl+s to save this web page. Then you can import the resulting html file into google docs to share the script with others.';
  colorBar.appendChild(warning);

  const buttonList = document.createElement('ul');
  buttonList.id = 'scriptify-button-list';
  colorBar.appendChild(buttonList);

  const button = document.createElement('button');
  button.id = `scriptify-button-null`;
  button.textContent = `Rotate colors`;
  button.addEventListener('click', () => {
    const prevActive = buttonList?.querySelector('active-button');
    if (prevActive) {
      /**@type {HTMLButtonElement}*/ (prevActive).disabled = false;
      prevActive.classList.remove('active-button');
    }

    button.disabled = true;
    button.classList.add('active-button');
    colorState.locked = false;
  });
  button.classList.add('active-button');
  button.disabled = true;
  addColorToColorBar(0);
  addColorToColorBar(1);

  const listItem = document.createElement('li');
  buttonList?.appendChild(listItem);
  listItem.appendChild(button);

  return colorBar;
}

/**
 *
 * @param {HTMLElement} colorBar
 */
function makeColorBarSticky(colorBar) {
  // Get the offset position of the navbar
  const sticky = colorBar.offsetTop;

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  window.onscroll = () => {
    if (window.pageYOffset > sticky) {
      colorBar.classList.add('sticky');
    } else {
      colorBar.classList.remove('sticky');
    }
  };
}

/**
 * Add css for each color.
 */
function injectColorCss() {
  for (let i = 0; i <= 14; i++) {
    // Note: we put them all in separate style elements with a particular id
    // in case we ever want to support customizing colors.
    const style = document.createElement('style');
    style.id = `color-${i}`;
    style.innerHTML = `.color-${i},
      button.color-${i},
      button.color-${i}:focus,
      button.color-${i}:hover {
        background-color: ${getColor(i)};
        color: ${getTextColor(i)}
      }`;
    document.head.appendChild(style);
  }
}

/**
 * Programmatically pick a set of background colors
 *
 * @param {number} i
 * @returns {string} CSS color
 */
function getColor(i) {
  // first, odd /14ths. Then, even 14ths.
  const adjusted = (((i * 4) % 7) * 2 - 1) / 14.0;
  if (i < 7) {
    // @ts-ignore
    return d3.interpolateRainbow(adjusted);
  }
  if (i < 14) {
    // @ts-ignore
    return d3.interpolateRainbow(adjusted - 1 / 14.0);
  }
  // we are out of colors; return bright red.
  return 'rgb(255, 0, 0)';
}

/**
 * Pick a contrasting text color for that background color.
 *
 * @param {number} i
 * @returns {string} CSS color
 */
function getTextColor(i) {
  // @ts-ignore
  const background = new Color(getColor(i));

  // https://colorjs.io/docs/contrast.html#accessible-perceptual-contrast-algorithm-apca
  const contrastWhite = Math.abs(
    // @ts-ignore
    background.contrast(new Color('white'), 'APCA')
  );
  const contrastBlack = Math.abs(
    // @ts-ignore
    background.contrast(new Color('black'), 'APCA')
  );

  // the farther from zero, the better
  if (contrastBlack < contrastWhite) {
    return 'white';
  }
  return 'black';
}
