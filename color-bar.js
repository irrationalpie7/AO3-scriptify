// @ts-check
const colorState = {num: -1, increase: false, locked: false, lockIndex: 0};

/**
 * @param {boolean} permanently
 */
function addColor(permanently) {
  if (permanently) {
    colorState.increase = false;
  } else {
    colorState.increase = true;
  }
  if (colorState.num >= numDistinctColors() - 1) {
    colorState.num = numDistinctColors() - 1;
    return;
  }
  colorState.num++;
  addColorToColorBar(colorState.num);

  if (allColorsExist()) {
    const plusButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#scriptify-button-plus')
    );
    plusButton.disabled = true;
  }
}

/**
 * @param {number} colorId
 * @returns {boolean}
 */
function lockColor(colorId) {
  if (colorId > colorState.num || colorId < 0) {
    return false;
  }

  const buttonList = document.querySelector('#scriptify-button-list');
  const button = /** @type {HTMLButtonElement} */ (
    buttonList?.querySelector(`#scriptify-button-${colorId}`)
  );
  if (button === null) {
    return false;
  }

  const prevActive = buttonList?.querySelector('.active-button');
  if (prevActive) {
    /**@type {HTMLButtonElement}*/ (prevActive).disabled = false;
    prevActive.classList.remove('active-button');
  }

  button.disabled = true;
  button.classList.add('active-button');
  colorState.locked = true;
  colorState.lockIndex = colorId;
  return true;
}

/**
 *
 */
function unlockColors() {
  const buttonList = document.querySelector('#scriptify-button-list');
  const prevActive = buttonList?.querySelector('.active-button');
  if (prevActive) {
    /**@type {HTMLButtonElement}*/ (prevActive).disabled = false;
    prevActive.classList.remove('active-button');
  }

  const button = /**@type {HTMLButtonElement}*/ (
    buttonList?.querySelector('#scriptify-button-rotate')
  );
  button.disabled = true;
  button.classList.add('active-button');
  colorState.locked = false;
}

/**
 * Whether all valid colors are present in the color bar
 *
 * @returns {boolean}
 */
function allColorsExist() {
  return colorState.num === numDistinctColors() - 1;
}

/**
 * Add + button to color bar
 */
function addPlusToColorBar() {
  const buttonList = document.querySelector('#scriptify-button-list');

  const button = document.createElement('button');
  button.id = 'scriptify-button-plus';
  button.textContent = '+';
  button.addEventListener('click', () => {
    addColor(true);
  });

  const listItem = document.createElement('li');
  buttonList?.appendChild(listItem);
  listItem.appendChild(button);
}

/**
 * Update color bar
 *
 * @param {number} i
 */
function addColorToColorBar(i) {
  injectColorCss(i);
  const buttonList = document.querySelector('#scriptify-button-list');

  const button = document.createElement('button');
  button.id = `scriptify-button-${i}`;
  button.classList.add(`color-${i}`);
  button.textContent = `${i < 10 ? i : String.fromCharCode(65 + i - 10)}`;
  const color = i;
  button.addEventListener('click', () => lockColor(color));

  const listItem = document.createElement('li');
  buttonList?.insertBefore(listItem, buttonList?.lastChild);
  listItem.appendChild(button);
}

/**
 * Changes a quote's color
 *
 * @param {HTMLElement} quote
 */
function click(quote) {
  // Check whether quote is *supposed* to be clickable
  if (!quote.classList.contains('active-quote')) {
    return;
  }

  const curColor = Number(quote.dataset.color);
  const newColor = colorState.locked
    ? colorState.lockIndex
    : (curColor + 1) % (colorState.num + 1);

  if (
    (colorState.increase && newColor !== 0) ||
    (colorState.locked && colorState.lockIndex === colorState.num)
  ) {
    addColor(false);
  }

  if (newColor === colorState.num) {
    colorState.increase = true;
  } else {
    colorState.increase = false;
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
      return;
    }
    if (e.ctrlKey) {
      return;
    }
    if (e.key === '+') {
      unlockColors();
      click(thisQuote);
      return;
    }
    if (!/[a-zA-Z0-9]/.test(e.key)) {
      return;
    }
    if (/[0-9]/.test(e.key)) {
      // attempt to lock color, or return
      if (!lockColor(Number(e.key))) {
        return;
      }
    }
    if (/[a-zA-Z]/.test(e.key)) {
      // 'A' should be 10
      // attempt to lock color, or return
      if (!lockColor(e.keyCode - 65 + 10)) {
        return;
      }
    }
    click(thisQuote);
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

  const pin_button_label = document.createElement('label');
  pin_button_label.htmlFor = 'pin_button';
  pin_button_label.textContent = 'push_pin';
  pin_button_label.classList.add('material-icons');
  pin_button_label.classList.add('pin-label');
  pin_button_label.appendChild(pin_button);

  const info = document.createElement('p');
  info.innerHTML =
    'Rotate through available colors or pick a particular color to paint.';
  div.appendChild(info);

  const buttonList = document.createElement('ul');
  buttonList.id = 'scriptify-button-list';
  div.appendChild(buttonList);
  div.appendChild(pin_button_label);

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

  addPlusToColorBar();
  addColor(true);
  addColor(false);

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
    pin.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        pin.click();
      }
    });
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
