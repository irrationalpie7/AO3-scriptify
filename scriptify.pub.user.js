// ==UserScript==
// @name         AO3 Scriptify
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Color-code dialogue
// @author       irrationalpie7
// @match        https://archiveofourown.org/*
// @updateURL    https://github.com/irrationalpie7/AO3-scriptify/raw/main/scriptify.pub.user.js
// @downloadURL  https://github.com/Cathalinaheart/AO3-scriptify/raw/main/scriptify.pub.user.js
// @require      https://colorjs.io/dist/color.global.min.js
// @require      https://d3js.org/d3.v4.min.js
// @require      https://d3js.org/d3-color.v1.min.js
// @require      https://d3js.org/d3-interpolate.v1.min.js
// @require      https://d3js.org/d3-scale-chromatic.v1.min.js
// @require      highlight.js
// @require      setup.js
// ==/UserScript==
// @ts-check

(async function () {
  "use strict";

  setupHighlighting();
})();
