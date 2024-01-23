// ==UserScript==
// @name AO3 Scriptify
// @description Color-code dialogue
// @version 4.1
// @author irrationalpie7
// @match https://archiveofourown.org/*
// @downloadURL https://github.com/irrationalpie7/AO3-scriptify/raw/main/scriptify.pub.user.js
// @grant GM.getResourceUrl
// @grant GM_getResourceText
// @namespace irrationalpie7
// @require https://colorjs.io/dist/color.global.min.js
// @resource scriptify_css scriptify.css
// @resource icon_css https://fonts.googleapis.com/icon?family=Material+Icons
// @updateURL https://github.com/irrationalpie7/AO3-scriptify/raw/main/scriptify.pub.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/pick-colors.js
// @ts-check

// Original set of colors, generated with 14 steps of d3.interpolateRainbow
// (Plus bright red as the last/error color)
const origColors = [
  '#585fd2',
  '#aff05b',
  '#a83cb3',
  '#34f07e',
  '#ff507a',
  '#1fb3d3',
  '#f89b31',
  '#3988e1',
  '#d2c934',
  '#6e40aa',
  '#6bf75c',
  '#df40a1',
  '#1bd9ac',
  '#ff704e',
  '#ff0000',
];

// Colors from https://colorbrewer2.org/#type=qualitative&scheme=Set3&n=12
const brewerSet = (/* unused pure expression or super */ null && ([
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
]));

// Colors from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const brewerPairs = (/* unused pure expression or super */ null && ([
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
]));

let colorArray = origColors;

/**
 * Pick the i-th background color
 *
 * @param {number} i
 * @returns {string} CSS color
 */
function getColor(i) {
  if (i >= colorArray.length) {
    // we are out of colors; return final color
    return colorArray[colorArray.length - 1];
  }
  return colorArray[i];
}

/**
 * The number of distinct colors in the current color set
 * @returns {number}
 */
function numDistinctColors() {
  return colorArray.length;
}

/**
 * Pick a contrasting text color for that background color.
 *
 * @param {number} i
 * @returns {string} CSS color
 */
function getTextColor(i) {
  if (isLight(getColor(i))) {
    return 'black';
  }
  return 'white';
}

/**
 * Checks whether a color.js color is light
 *
 * @param {string} color A Css color string
 * @returns {boolean}
 */
function isLight(color) {
  // @ts-ignore
  const background = new Color(color);
  // https://colorjs.io/docs/contrast.html#accessible-perceptual-contrast-algorithm-apca
  const contrastWhite = Math.abs(
    // @ts-ignore
    background.contrast(new Color('white'), 'APCA')
  );
  const contrastBlack = Math.abs(
    // @ts-ignore
    background.contrast(new Color('black'), 'APCA')
  );

  // the farther from zero, the better the contrast
  return contrastBlack > contrastWhite;
}

;// CONCATENATED MODULE: ./src/color-bar.js
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

;// CONCATENATED MODULE: ./src/export.js
// @ts-check

function exportHtmlFile() {
  const exportDoc = document.implementation.createHTMLDocument(document.title);
  const work = document.querySelector('#main');
  if (!work) {
    console.log('Found no work to export.');
    return;
  }

  const new_work = exportDoc.importNode(work, true);
  exportDoc.body.appendChild(new_work);
  new_work.querySelector('#color-bar')?.remove();
  new_work.querySelector('#highlight-title')?.remove();
  new_work.querySelector('#highlight-form')?.remove();

  let i = 0;
  const styles = [];
  let style = document.querySelector(`#color-${i}`);
  while (style) {
    styles.push(
      style.textContent
        // @ts-ignore
        ?.replaceAll('\n', ' ')
        .replace(/.*{/, '')
        .replace(/}.*/, '')
        .replace(/ +/g, ' ')
        .trim()
    );
    i++;
    style = document.querySelector(`#color-${i}`);
  }

  new_work.querySelectorAll('.script-quote').forEach(quote => {
    quote.removeAttribute('role');
    quote.removeAttribute('tabindex');
    quote.setAttribute(
      'style',
      styles[Number(/**@type {HTMLElement}*/ (quote).dataset.color)]
    );
  });

  // clean up work, removing interactive elements and icons
  const extras = Array.from(
    new_work.querySelectorAll('span.material-icons, progress')
  );
  extras.forEach(extra => extra.remove());
  new_work.querySelectorAll('button').forEach(button => {
    const span = exportDoc.createElement('span');
    span.textContent = button.textContent?.trim() || '';
    button.parentNode?.replaceChild(span, button);
  });

  // Do the actual export
  // Create element with <a> tag
  const link = document.createElement('a');
  // Create a blob object with the file content which you want to add to the file
  const file = new Blob([new XMLSerializer().serializeToString(exportDoc)], {
    type: 'text/plain',
  });
  // Add file content in the object URL
  link.href = URL.createObjectURL(file);
  // Add file name
  link.download = 'export.html';
  // Add click event to <a> tag to save file.
  link.click();
  URL.revokeObjectURL(link.href);
}

;// CONCATENATED MODULE: ./src/highlight.js
// @ts-check
const quoteRegexString = `"|“|”|&quot;|&ldquo;|&rdquo;`;

/**
 * Wrap this set of elements in a colored span.
 *
 * @param {ChildNode[]} quoteGroup
 * @returns
 */
function wrapElements(quoteGroup) {
  if (quoteGroup.length === 0) {
    return;
  }
  const quoteSpan = document.createElement('span');
  quoteSpan.classList.add('script-quote');
  quoteSpan.classList.add('color-0');
  quoteSpan.dataset.color = '0';

  const origParent = quoteGroup[0].parentNode;
  origParent?.replaceChild(quoteSpan, quoteGroup[0]);
  quoteSpan.appendChild(quoteGroup[0]);

  for (let i = 1; i < quoteGroup.length; i++) {
    origParent?.removeChild(quoteGroup[i]);
    quoteSpan.appendChild(quoteGroup[i]);
  }
}

/**
 * Recursively searches for a paragraph, or element which contains no paragraphs.
 *
 * In the base case, this also moves children of <span> elements with no attributes
 * directly into their parents, since we only consider quote marks in text node
 * children when choosing where to start/end highlights.
 *
 * @param {Element} element
 */
function recursivelyHighlight(element) {
  const origChildren = Array.from(element.childNodes);
  // recursive case
  if (element.nodeName !== 'P' || element.querySelector('p') !== null) {
    origChildren.forEach(child =>
      recursivelyHighlight(/**@type {HTMLElement}*/ (child))
    );
    return;
  }

  // get rid of span elements which add no value
  // (I just accidentally ran across a fic that had these in every paragraph)
  origChildren.forEach(child => {
    if (
      child.nodeName === 'SPAN' &&
      /**@type {HTMLElement}*/ (child).outerHTML.startsWith('<span>')
    ) {
      // freeze the span's children
      const spanChildren = Array.from(child.childNodes);
      spanChildren.forEach(spanChild => {
        element.insertBefore(spanChild, child);
      });
      child.remove();
    }
  });

  const children = Array.from(element.childNodes);
  // base case: split text at quotes
  children.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent) {
      const rawMatches = [
        ...child.textContent.matchAll(new RegExp(quoteRegexString, 'gi')),
      ];
      // index should never be undefined, but if it is, fall back to -1 so the
      // type checker doesn't complain
      const matchIndexes = rawMatches.map(match => match.index ?? -1);
      // sort from high to low order
      const matches = matchIndexes.sort((a, b) => b - a);

      for (let i = 0; i < matches.length; i++) {
        if (matches[i] < 0 || matches[i] > child.textContent.length) {
          console.log(child.textContent);
          console.log(child);
        }
        /** @type {Text} */ (child).splitText(matches[i]);
      }
    }
  });

  // regroup text nodes
  const newChildren = Array.from(element.childNodes);
  let quoteGroup = [];
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    // if this text node is on a quote boundary:
    if (
      child.nodeType === Node.TEXT_NODE &&
      child.textContent?.match(new RegExp(quoteRegexString))
    ) {
      // figure out whether it's the beginning of a quote or the end of a quote and handle that
      if (quoteGroup.length === 0) {
        quoteGroup.push(child);
      } else {
        wrapElements(quoteGroup);
        quoteGroup = [];
      }
    } else if (quoteGroup.length !== 0) {
      // otherwise append the node to the current quote, if any
      quoteGroup.push(child);
    }
  }
  // process the final group, if any
  if (quoteGroup.length !== 0) {
    wrapElements(quoteGroup);
  }
}

;// CONCATENATED MODULE: ./src/setup.js
// @ts-check




/**
 *
 * @returns {boolean}
 */
function isAo3WorkPage() {
  // Url of the ao3 page.
  const url = location.href;

  // Check whether this page is an ao3 work.
  const works_regex = /https:\/\/archiveofourown\.org(\/.*)?\/works\/[0-9]+.*/;
  // Check whether it's an editing page.
  const edit_page_regex = /\/works\/[0-9]+\/edit/;

  return (
    url.match(works_regex) !== null &&
    url.match(edit_page_regex) === null &&
    !url.includes('works/new')
  );
}

/**
 * Generate the dom elements for color-coding dialogue on a work page.
 *
 * This function is a no-op if the elements already exist, or this is not a work
 * page. The elements start off hidden.
 */
function setupHighlighting() {
  // Document positioning. Note: this selector only works on a work page.
  const metaDescriptionList = document.querySelector('dl.work.meta.group');
  if (metaDescriptionList === null) {
    console.log(
      'Unable to determine where to insert highlighting buttons--aborting'
    );
    return;
  }

  if (document.getElementById('highlight-title') !== null) {
    console.log('Aborting highlighting setup--this has already been done.');
    return;
  }

  const highlightTitle = document.createElement('dt');
  highlightTitle.textContent = 'Scriptify:';
  highlightTitle.id = 'highlight-title';

  const highlightForm = document.createElement('dd');
  highlightForm.id = 'highlight-form';

  metaDescriptionList.appendChild(highlightTitle);
  metaDescriptionList.appendChild(highlightForm);

  const startButton = document.createElement('button');
  startButton.textContent = 'Start color-coding dialogue';
  highlightForm.appendChild(startButton);

  const colorBar = injectColorBar();

  startButton.addEventListener('click', () => {
    startButton.disabled = true;
    const work = document.querySelector('#workskin');
    if (work) {
      recursivelyHighlight(work);
    }

    Array.from(document.querySelectorAll('.script-quote')).forEach(quote =>
      enableQuoteClicking(/**@type {HTMLElement}*/ (quote))
    );
    colorBar.classList.remove('hidden');
    makeColorBarSticky(colorBar);

    startButton.remove();
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export';
    exportButton.addEventListener('click', () => exportHtmlFile());
    highlightForm.appendChild(exportButton);

    const warning = document.createElement('p');
    warning.innerHTML =
      "<strong>Warning:</strong> once you start color-coding dialogue, refreshing the page <em>will</em> ruin all your hard work! If copy/paste doesn't work or is too messy, use the export button. You can look at the resulting file in any browser, or upload it to google drive and then open it as a doc.";
    highlightForm.appendChild(warning);

    const tips = document.createElement('p');
    tips.innerHTML =
      'Some <a href="https://github.com/irrationalpie7/AO3-scriptify?tab=readme-ov-file#keyboard-tips-and-tricks" target="_blank">keyboard tips and tricks</a>.';
    highlightForm.appendChild(tips);
  });
}
;// CONCATENATED MODULE: ./src/scriptify-main.js
// @ts-check


(async function () {
  ('use strict');

  setupHighlighting();

  injectCssResource('scriptify_css');
  injectCssResource('icon_css');

  /**
   * Fetch the text of a (script)monkey resource.
   * @param {string} resourceName
   * @returns {Promise<string|null>}
   */
  async function getResourceText(resourceName) {
    try {
      // @ts-ignore
      return GM_getResourceText(resourceName);
    } catch (e) {
      if (e instanceof ReferenceError) {
        // @ts-ignore
        return GM.getResourceUrl(resourceName)
          .then(url => fetch(url))
          .then(resp => resp.text())
          .catch(function (error) {
            console.log('Request failed', error);
            return null;
          });
      }
    }
    return null;
  }

  /**
   * Inject this css resource into the current page.
   * @param {string} cssResourceName
   */
  async function injectCssResource(cssResourceName) {
    const cssText = await getResourceText(cssResourceName);
    if (cssText) {
      var style = document.createElement('style');
      style.innerHTML = cssText;
      document.head.appendChild(style);
    }
  }
})();

/******/ })()
;