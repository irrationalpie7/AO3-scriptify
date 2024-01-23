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
const brewerSet = [
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
];

// Colors from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const brewerPairs = [
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
];

let colorArray = origColors;

/**
 * Pick the i-th background color
 *
 * @param {number} i
 * @returns {string} CSS color
 */
export function getColor(i) {
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
export function numDistinctColors() {
  return colorArray.length;
}

/**
 * Pick a contrasting text color for that background color.
 *
 * @param {number} i
 * @returns {string} CSS color
 */
export function getTextColor(i) {
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
export function isLight(color) {
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
