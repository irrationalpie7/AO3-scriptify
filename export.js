// @ts-check

function exportHtmlFile() {
  const exportDoc = document.implementation.createHTMLDocument(document.title);
  const work = document.querySelector('div.work');
  if (!work) {
    return;
  }
  const new_work = exportDoc.importNode(work, true);
  exportDoc.body.appendChild(new_work);
  new_work.querySelector('#color-bar')?.remove();
  new_work.querySelectorAll('.script-quote').forEach(quote => {
    quote.removeAttribute('role');
    quote.removeAttribute('tabindex');
  });

  let i = 0;
  let style = document.querySelector(`#color-${i}`);
  while (style) {
    exportDoc.head.appendChild(exportDoc.importNode(style, true));
    i++;
    style = document.querySelector(`#color-${i}`);
  }

  // Create element with <a> tag
  const link = document.createElement('a');

  // Create a blog object with the file content which you want to add to the file
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
