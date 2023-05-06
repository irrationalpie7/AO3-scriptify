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

    const warning = document.createElement('p');
    warning.innerHTML =
      'Warning: once you start color-coding dialogue, refreshing the page <em>will</em> ruin all your hard work! To save, use ctrl+s to save this web page. Then you can import the resulting html file into google docs to share the script with others.';
    highlightForm.appendChild(warning);

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export';
    exportButton.addEventListener('click', () => exportHtmlFile());
  });
}