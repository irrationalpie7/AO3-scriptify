/**
 * Generate the dom elements for color-coding dialogue on a work page.
 *
 * This function is a no-op if the elements already exist, or this is not a work
 * page. The elements start off hidden.
 *
 * @returns {boolean} Whether the dom was successfully set up
 */
function setupHighlighting() {
  // Document positioning. Note: this selector only works on a work page.
  const metaDescriptionList = parent.querySelector("dl.work.meta.group");
  if (metaDescriptionList === null) {
    console.log(
      "Unable to determine where to insert highlighting buttons--aborting"
    );
    return false;
  }

  if (document.getElementById("highlight-title") !== null) {
    console.log("Aborting highlighting setup--this has already been done.");
    return false;
  }

  const highlightTitle = document.createElement("dt");
  highlightTitle.textContent = "Scriptify:";
  highlightTitle.id = "highlight-title";

  const highlightForm = document.createElement("dd");
  highlightForm.id = "highlight-form";

  metaDescriptionList.appendChild(highlightTitle);
  metaDescriptionList.appendChild(highlightForm);

  const startButton = document.createElement("button");
  startButton.textContent = "Start color-coding dialogue";
  startButton.addEventListener("click", () => {
    startButton.disabled = true;
    injectColorCss();
    recursivelyHighlight(document.querySelector("#workskin"));

    Array.from(document.querySelectorAll(".script-quote")).forEach((quote) =>
      wrapQuoteWithButton(quote)
    );
  });
  highlightForm.appendChild(showHideButton);

  const freezeButton = document.createElement("button");
  const freezeText = "Freeze color-coding";
  const unfreezeText = "Return to editing color-coding";
  freezeButton.textContent = freezeText;
  freezeButton.disabled = true;
  freezeButton.addEventListener("click", () => {
    if (freezeButton.textContent === freezeText) {
      freezeButton.textContent = unfreezeText;

      Array.from(document.querySelectorAll(".script-quote-button")).forEach(
        (quote) => quote.parentNode.replaceChild(quote.querySelector("span")),
        quote
      );
    } else {
      freezeButton.textContent = freezeText;

      Array.from(document.querySelectorAll(".script-quote")).forEach((quote) =>
        wrapQuoteWithButton(quote)
      );
    }
  });

  return true;
}

const colorState = { num: 1, increase: false };

/**
 * Wrap a quote span with a button.
 *
 * @param {HTMLElement} quote
 */
function wrapQuoteWithButton(quote) {
  const button = document.createElement("button");
  button.classList.add("script-quote-button");
  quote.parentNode.replaceChild(button, quote);
  button.appendChild(quote);
  button.addEventListener("click", () => {
    const curColor = quote.dataset.color;
    let newColor = curColor + 1;

    if (colorState.increase) {
      // We've previously marked that we want to permanently increase the number
      // of dialogue colors, so do that now....
      // *unless* we are already the new dialogue color and are trying to rotating back
      if (curColor !== colorState.num) {
        colorState.num++;
        colorState.increase = false;
      } else {
        newColor = 0;
        colorState.increase = false;
      }
    }

    if (newColor === colorState.num) {
      colorState.increase = true;
    }

    quote.classList.remove(`color-${curColor}`);
    quote.classList.add(`color-${newColor}`);
    quote.dataset.color = newColor;
  });
}

function injectColorCss() {
  for (let i = 0; i <= 14; i++) {
    const style = document.createElement("style");
    style.id = `color-${i}`;
    style.innerHTML = `.color-${i} {
      background-color: ${getColor(i)};
      color: ${getTextColor(i)}
    }`;
    document.head.appendChild(style);
  }
}

function getColor(i) {
  // first, odd /14ths. Then, even 14ths.
  const adjusted = (((i * 4) % 7) * 2 - 1) / 14.0;
  if (i < 7) {
    return d3.interpolateRainbow(adjusted);
  }
  if (i < 14) {
    return d3.interpolateRainbow(adjusted - 1 / 14.0);
  }
  // we are out of colors; return bright red.
  return "rgb(255, 0, 0)";
}

function getTextColor(i) {
  const background = new Color(getColor(i));

  // https://colorjs.io/docs/contrast.html#accessible-perceptual-contrast-algorithm-apca
  const contrastWhite = Math.abs(
    background.contrast(new Color("white"), "APCA")
  );
  const contrastBlack = Math.abs(
    background.contrast(new Color("black"), "APCA")
  );

  // the farther from zero, the better
  if (contrastBlack < contrastWhite) {
    return "white";
  }
  return "black";
}
