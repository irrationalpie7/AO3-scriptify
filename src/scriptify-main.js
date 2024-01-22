// @ts-check
import {setupHighlighting} from './setup';

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
