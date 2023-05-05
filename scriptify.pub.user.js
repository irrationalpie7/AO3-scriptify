// ==UserScript==
// @name         AO3 Scriptify
// @namespace    http://tampermonkey.net/
// @version      0.9.4
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

  const style = document.createElement("style");
  style.innerHTML = `  /* Make the button not look like a button */
    span.script-quote {
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
        box-shadow: none;
        vertical-align: baseline;
        border-radius: 0;
        display: inline-flex;
    }

    /* Underline on hover */
    span.script-quote:hover.active-quote {
        border-bottom: 1px solid;
    }

    span.script-quote:focus {
        outline: 1px dotted;
    }`;
  document.head.appendChild(style);
})();
