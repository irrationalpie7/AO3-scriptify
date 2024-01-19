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
      'Some <a href="https://github.com/irrationalpie7/AO3-scriptify?tab=readme-ov-file#keyboard-tips-and-tricks">keyboard tips and tricks</a>.';
    highlightForm.appendChild(tips);
  });
}