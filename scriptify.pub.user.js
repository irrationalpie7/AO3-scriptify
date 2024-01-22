// ==UserScript==
// @name AO3 Scriptify
// @description Color-code dialogue
// @version 4.0.1
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
var __webpack_exports__ = {};
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