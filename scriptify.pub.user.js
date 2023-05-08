// ==UserScript==
// @name         AO3 Scriptify
// @namespace    http://tampermonkey.net/
// @version      2.0.7
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
// @require      export.js
// @require      color-bar.js
// @require      highlight.js
// @require      setup.js
// @resource     scriptify_css scriptify.css
// @resource     icon_css https://fonts.googleapis.com/icon?family=Material+Icons
// @grant GM.getResourceUrl
// @grant GM_getResourceText
// ==/UserScript==
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
