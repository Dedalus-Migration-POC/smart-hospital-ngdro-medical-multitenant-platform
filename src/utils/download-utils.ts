import printJS from 'print-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const DownloadUtils = {
  download: (
    mimeType: string,
    content: string | ArrayBuffer,
    fileName?: string,
    zoom?: number,
    negativeLeftMargin?: number,
  ): void => {
    if (mimeType === 'text/html' && typeof content === 'string') {
      convertHtmlToPdf(content, fileName, 'save', zoom, negativeLeftMargin);
      return;
    }

    if (content instanceof ArrayBuffer) {
      const blob = new Blob([content], { type: mimeType });
      triggerBlobDownload(blob, fileName, mimeType);
      return;
    }

    const linkSource = `data:${mimeType};base64,${content}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = buildFileName(fileName, mimeType);
    downloadLink.click();
  },

  openPdf: (pdf: Blob | string, mimeType = 'application/pdf'): void => {
    const pdfBlob = typeof pdf === 'string' ? base64ToBlob(pdf, mimeType) : pdf;
    openBlob(pdfBlob);
  },

  createObjectUrl: (pdf: Blob | string, mimeType = 'application/pdf'): string => {
    const pdfBlob = typeof pdf === 'string' ? base64ToBlob(pdf, mimeType) : pdf;
    return window.URL.createObjectURL(pdfBlob);
  },

  revokeObjectUrl: (url: string): void => {
    window.URL.revokeObjectURL(url);
  },
};

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = window.atob(base64);
  const byteNumbers = Array.from(byteCharacters, (character) => character.charCodeAt(0));

  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}

function openBlob(blob: Blob): void {
  const fileUrl = window.URL.createObjectURL(blob);
  window.open(fileUrl, '_blank')?.focus();
  window.setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
}

function triggerBlobDownload(blob: Blob, fileName: string | undefined, mimeType: string): void {
  const fileUrl = window.URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = buildFileName(fileName, mimeType);
  downloadLink.click();
  window.setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
}

function buildFileName(fileName: string | undefined, mimeType: string): string {
  const extension = mimeType.split('/')[1]?.split(';')[0] ?? 'bin';
  return `${fileName ?? 'file'}.${extension}`;
}

async function convertHtmlToPdf(
  base64: string,
  fileName?: string,
  callback?: 'save' | 'print',
  zoom?: number,
  negativeLeftMargin?: number,
) {
  const divId = Date.now().toString();
  const printable = window.document.createElement('div');
  printable.setAttribute('id', divId);
  printable.innerHTML = window.atob(base64);
  window.document.body.appendChild(printable);
  html2canvas(printable)
    .then((canvas) => {
      var imgWidth = 210;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(
        contentDataURL,
        'PNG',
        negativeLeftMargin ?? 0,
        0,
        imgWidth * (zoom ?? 1),
        imgHeight * (zoom ?? 1),
      );
      return pdf;
    })
    .then((pdf: jsPDF) => {
      if (callback === 'save') {
        pdf.save((fileName ?? divId) + '.pdf');
      }
      if (callback === 'print') {
        printJS({
          printable: window.btoa(pdf.output()),
          type: 'pdf',
          base64: true,
        });
      }
      window.document.getElementById(divId)?.remove();
    });
}
