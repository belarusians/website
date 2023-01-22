import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { useEffect, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { doc, documentWrapper, pageControls, pageControlsButton, placeholder } from "./pdf-viewer.css";

import "react-pdf/dist/esm/Page/TextLayer.css";
import { getFullWidth } from "./utils";

function PDFPlaceholder(): JSX.Element {
  return <div className={placeholder}>Loading stuff</div>;
}

export function PdfViewer(): JSX.Element {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy) {
    setNumPages(numPages);
  }

  function pageBack() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }

  function pageForward() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }

  return (
    <div className={documentWrapper}>
      <Document className={doc} file="/targets.pdf" onLoadSuccess={onDocumentLoadSuccess} loading={PDFPlaceholder}>
        <Page
          renderAnnotationLayer={false}
          pageNumber={pageNumber}
          width={getFullWidth(width, 1000)}
          loading={PDFPlaceholder}
        />
      </Document>
      <div className={pageControls}>
        <button onClick={pageBack} className={pageControlsButton}>
          &lt;
        </button>
        <span>
          {pageNumber} of {numPages}
        </span>
        <button onClick={pageForward} className={pageControlsButton}>
          &gt;
        </button>
      </div>
    </div>
  );
}
