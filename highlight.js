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
