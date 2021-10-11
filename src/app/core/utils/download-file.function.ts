export function downloadFile(filename: string, data: string) {
  const blob = new Blob([data], { type: 'text/plain' });

  if ((window.navigator as any).msSaveOrOpenBlob) {
    (window.navigator as any).msSaveBlob(blob, filename);

    return;
  }

  const dummyAnchor: HTMLAnchorElement = window.document.createElement('a');

  dummyAnchor.href = window.URL.createObjectURL(blob);
  dummyAnchor.download = filename;
  document.body.appendChild(dummyAnchor);
  dummyAnchor.click();
  document.body.removeChild(dummyAnchor);
}
