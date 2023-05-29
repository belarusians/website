import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import * as React from "react";
import { useEffect, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";

import "react-pdf/dist/esm/Page/TextLayer.css";
import { getFullWidth } from "./utils";

function PDFPlaceholder(): React.JSX.Element {
  return <div className="flex justify-center items-center w-screen h-[80vh]">Loading stuff</div>;
}

export function PdfViewer(): React.JSX.Element {
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
    <div className="flex flex-col gap-4 mt-2 md:mt-4">
      <Document
        className="shadow-lg mx-auto"
        file="/targets.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        loading={PDFPlaceholder}
      >
        <Page
          renderAnnotationLayer={false}
          pageNumber={pageNumber}
          width={getFullWidth(width, 1000)}
          loading={PDFPlaceholder}
        />
      </Document>
      <div className="transition-all mx-auto bg-white rounded-md shadow-lg hover:shadow-xl">
        <button onClick={pageBack} className="rounded-l-md transition-all h-10 w-10 cursor-pointer">
          &lt;
        </button>
        <span>
          {pageNumber} of {numPages}
        </span>
        <button onClick={pageForward} className="rounded-r-md transition-all h-10 w-10 cursor-pointer">
          &gt;
        </button>
      </div>
    </div>
  );
}
