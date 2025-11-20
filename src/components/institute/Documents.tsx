/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Type definitions
// type InstituteDocument = {
//   number: string;
//   file: string;
// };

// type InstituteDocs = {
//   gst: InstituteDocument;
//   pan: InstituteDocument;
// };

// type DocumentsPageProps = {
//   institute: {
//     docs?: InstituteDocs;
//   };
// };

type DocumentItem = {
  title: string;
  fileUrl: string;
  number: string;
};

export default function DocumentsPage({ institute }: any) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber] = useState(1); // For single page view

  // Get documents from institute data
  const documents: DocumentItem[] = [
    {
      title: "GST",
      fileUrl: institute?.docs?.gst?.file || "",
      number: institute?.docs?.gst?.number || ""
    },
    {
      title: "PAN",
      fileUrl: institute?.docs?.pan?.file || "",
      number: institute?.docs?.pan?.number || ""
    },

  ];

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const renderDocumentViewer = () => {
    const doc = documents.find((d) => d.title === selectedDoc);

    if (!doc) return null;

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{doc.title} Document</h2>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setSelectedDoc(null)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Back to Documents
          </button>
          {doc.number !== "Not available" && (
            <div className="text-gray-700">
              <span className="font-medium">Number:</span> {doc.number}
            </div>
          )}
        </div>

        {doc.fileUrl ? (
          <div className="border rounded-lg shadow-md p-4 bg-white max-w-4xl mx-auto overflow-auto">
            <Document
              file={doc.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading PDF...</div>}
              error={<div>Failed to load PDF.</div>}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div>Loading page...</div>}
              />
            </Document>
            {numPages && (
              <p className="text-sm text-gray-500 mt-2">
                Page {pageNumber} of {numPages}
              </p>
            )}
          </div>
        ) : (
          <div className="p-6 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-600">No {doc.title} document uploaded</p>
          </div>
        )}
      </div>
    );
  };

  const renderDocumentGrid = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.title}
            className="border rounded-lg shadow-sm p-4 flex flex-col items-center justify-between min-h-[120px] hover:shadow-md transition"
          >
            <div className="mb-2 font-semibold">{doc.title}</div>
            <div className="mb-3 text-sm text-gray-600">
              {doc.number}
            </div>
            <button
              onClick={() => setSelectedDoc(doc.title)}
              className={`w-full py-2 rounded transition ${doc.fileUrl
                ? "bg-[#6bb5a0] text-white hover:bg-[#5aa28e]"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              disabled={!doc.fileUrl}
              aria-label={`View ${doc.title} document`}
            >
              {doc.fileUrl ? `View ${doc.title}` : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return selectedDoc ? renderDocumentViewer() : renderDocumentGrid();
}

