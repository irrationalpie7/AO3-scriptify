// @ts-check

export function exportHtmlFile() {
  const exportDoc = document.implementation.createHTMLDocument(document.title);
  const work = document.querySelector('#main');
  if (!work) {
    console.log('Found no work to export.');
    return;
  }

  const new_work = exportDoc.importNode(work, true);
  exportDoc.body.appendChild(new_work);
  new_work.querySelector('#color-bar')?.remove();
  new_work.querySelector('#highlight-title')?.remove();
  new_work.querySelector('#highlight-form')?.remove();

  let i = 0;
  const styles = [];
  let style = document.querySelector(`#color-${i}`);
  while (style) {
    styles.push(
      style.textContent
        // @ts-ignore
        ?.replaceAll('\n', ' ')
        .replace(/.*{/, '')
        .replace(/}.*/, '')
        .replace(/ +/g, ' ')
        .trim()
    );
    i++;
    style = document.querySelector(`#color-${i}`);
  }

  new_work.querySelectorAll('.script-quote').forEach(quote => {
    quote.removeAttribute('role');
    quote.removeAttribute('tabindex');
    quote.setAttribute(
      'style',
      styles[Number(/**@type {HTMLElement}*/ (quote).dataset.color)]
    );
  });

  // clean up work, removing interactive elements and icons
  const extras = Array.from(
    new_work.querySelectorAll('span.material-icons, progress')
  );
  extras.forEach(extra => extra.remove());
  new_work.querySelectorAll('button').forEach(button => {
    const span = exportDoc.createElement('span');
    span.textContent = button.textContent?.trim() || '';
    button.parentNode?.replaceChild(span, button);
  });

  // Do the actual export
  // Create element with <a> tag
  const link = document.createElement('a');
  // Create a blob object with the file content which you want to add to the file
  const file = new Blob([new XMLSerializer().serializeToString(exportDoc)], {
    type: 'text/plain',
  });
  // Add file content in the object URL
  link.href = URL.createObjectURL(file);
  // Add file name
  link.download = 'export.html';
  // Add click event to <a> tag to save file.
  link.click();
  URL.revokeObjectURL(link.href);
}
