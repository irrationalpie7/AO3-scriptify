// @ts-check
const colorState = {num: 1, increase: false, locked: false, lockIndex: 0};

/**
 * Update color bar
 *
 * @param {number} i
 */
function addColorToColorBar(i) {
  if (i > numDistinctColors() - 1) {
    colorState.increase = false;
    colorState.num = numDistinctColors() - 1;
    return;
  }
  injectColorCss(i);
  const buttonList = document.querySelector('#scriptify-button-list');

  const button = document.createElement('button');
  button.id = `scriptify-button-${i}`;
  button.classList.add(`color-${i}`);
  button.textContent = `${i}`;
  button.addEventListener('click', () => {
    const prevActive = buttonList?.querySelector('.active-button');
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
  if (newColor >= numDistinctColors()) {
    newColor = numDistinctColors() - 1;
  }
  if (colorState.locked) {
    newColor = colorState.lockIndex;
    if (colorState.lockIndex >= colorState.num) {
      colorState.num++;
      colorState.increase = false;
      addColorToColorBar(colorState.num);
    }
  }

  if (colorState.increase) {
    // We've previously marked that we want to permanently increase the number
    // of dialogue colors, so do that now....
    // *unless* we are already the new dialogue color and are trying to rotate back
    if (curColor < colorState.num) {
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
  quote.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      click(thisQuote);
    }
  });
  quote.addEventListener('click', () => click(thisQuote));
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
  // used for sticky spacing purposes
  work?.parentNode?.insertBefore(document.createElement('div'), work);

  const div = document.createElement('div');
  colorBar.appendChild(div);

  const modeButton = document.createElement('button');
  modeButton.classList.add('material-icons');
  modeButton.classList.add('mode');
  // pick initial light/dark mode
  const body = document.querySelector('body');
  if (body && isLight(window.getComputedStyle(body).backgroundColor)) {
    modeButton.classList.add('dark-mode');
    modeButton.textContent = 'dark_mode';
    colorBar.classList.add('light-mode');
  } else {
    modeButton.classList.add('light-mode');
    modeButton.textContent = 'light_mode';
    colorBar.classList.add('dark-mode');
  }
  div.appendChild(modeButton);
  modeButton.addEventListener('click', () => {
    if (modeButton.classList.contains('dark-mode')) {
      // update button
      modeButton.classList.remove('dark-mode');
      modeButton.classList.add('light-mode');
      modeButton.textContent = 'light_mode';
      // update color bar
      colorBar.classList.add('dark-mode');
      colorBar.classList.remove('light-mode');
    } else {
      // update button
      modeButton.classList.remove('light-mode');
      modeButton.classList.add('dark-mode');
      modeButton.textContent = 'dark_mode';
      // update color bar
      colorBar.classList.add('light-mode');
      colorBar.classList.remove('dark-mode');
    }
  });

  // <span class="material-symbols-outlined">push_pin</span>
  const pin_button = document.createElement('input');
  pin_button.id = 'pin_button';
  pin_button.type = 'checkbox';
  pin_button.classList.add('pin');
  pin_button.checked = true;
  div.appendChild(pin_button);

  const pin_button_label = document.createElement('label');
  pin_button_label.htmlFor = 'pin_button';
  pin_button_label.textContent = 'push_pin';
  pin_button_label.classList.add('material-icons');
  pin_button_label.classList.add('pin-label');
  div.appendChild(pin_button_label);

  const info = document.createElement('p');
  info.innerHTML =
    'Rotate through available colors or pick a particular color to paint.';
  div.appendChild(info);

  const buttonList = document.createElement('ul');
  buttonList.id = 'scriptify-button-list';
  div.appendChild(buttonList);

  const button = document.createElement('button');
  button.id = `scriptify-button-rotate`;
  button.textContent = `Rotate`;
  button.addEventListener('click', () => {
    const prevActive = buttonList?.querySelector('.active-button');
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
  // start unlocked
  colorState.locked = false;
  const listItem = document.createElement('li');
  buttonList?.appendChild(listItem);
  listItem.appendChild(button);
  addColorToColorBar(0);
  addColorToColorBar(1);

  return colorBar;
}

/**
 *
 * @param {HTMLElement} colorBar
 */
function makeColorBarSticky(colorBar) {
  const metadataSection = /**@type {HTMLElement}*/ (
    document.querySelector('.wrapper > dl')
  );
  const pin = /**@type {HTMLInputElement}*/ (colorBar.querySelector('.pin'));
  if (metadataSection && pin) {
    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    window.onscroll = () => stickify(colorBar, metadataSection, pin);

    pin.addEventListener('change', () =>
      stickify(colorBar, metadataSection, pin)
    );
  }
}

/**
 *
 * @param {HTMLElement} colorBar
 * @param {HTMLElement} metadataSection
 * @param {HTMLInputElement} pin
 */
function stickify(colorBar, metadataSection, pin) {
  let sticky = metadataSection.offsetTop + metadataSection.offsetHeight;
  if (window.scrollY > sticky && pin.checked) {
    colorBar.nextElementSibling?.setAttribute(
      'style',
      `height: ${colorBar.offsetHeight}px;`
    );
    colorBar.classList.add('sticky');
  } else {
    colorBar.classList.remove('sticky');
    colorBar.nextElementSibling?.setAttribute('style', 'display: none;');
  }
}

/**
 * Add css for the specified color.
 *
 * If a style rule for color i already exists, replaces it.
 *
 * @param {number} i
 */
function injectColorCss(i) {
  const style =
    document.querySelector(`#color-${i}`) || document.createElement('style');
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