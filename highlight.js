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
  const spannySpan = document.createElement("span");
  spannySpan.classList.add("script-quote");
  spannySpan.classList.add("color-0");
  spannySpan.dataset.color = 0;

  const origParent = quoteGroup[0].parentNode;
  origParent.replaceChild(spannySpan, quoteGroup[0]);
  spannySpan.appendChild(quoteGroup[0]);

  for (let i = 1; i < quoteGroup.length; i++) {
    origParent.removeChild(quoteGroup[i]);
    spannySpan.appendChild(quoteGroup[i]);
  }
}

/**
 * Recursively searches for a paragraph, or element which contains no paragraphs.
 *
 * When it stops recursing, it only considers quotes in text node children when deciding what matches.
 *
 * @param {HTMLElement} element
 */
function recursivelyHighlight(element) {
  const children = Array.from(element.childNodes);
  if (element.nodeName !== "P" || element.querySelector("p") !== null) {
    children.forEach((child) => recursivelyHighlight(child));
    return;
  }

  // split text at quotes
  children.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      [...child.textContent.matchAll(new RegExp(quoteRegexString, "gi"))]
        // go backwards so you don't have to recalculate indices based on previous splits
        .map((match) => -match.index)
        .sort()
        .forEach((index) => child.splitText(-index));
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
      child.textContent.match(new RegExp(quoteRegexString)) !== null
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