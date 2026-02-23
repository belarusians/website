import Link from 'next/link';

interface PdfViewerProps {
  pdfUrl: string;
  downloadLabel: string;
}

export function PdfViewer({ pdfUrl, downloadLabel }: PdfViewerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <object data={pdfUrl} type="application/pdf" className="w-full h-[70vh] rounded-md border border-light-grey">
        <p className="text-center p-4">
          <Link href={pdfUrl} target="_blank" className="text-primary underline">
            {downloadLabel}
          </Link>
        </p>
      </object>
      <Link
        href={pdfUrl}
        target="_blank"
        download
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md no-underline transition-shadow hover:shadow-lg"
      >
        {downloadLabel}
      </Link>
    </div>
  );
}
