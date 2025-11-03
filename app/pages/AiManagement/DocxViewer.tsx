"use client";
import * as mammoth from "mammoth";
import { useEffect, useState } from "react";

const SuperDocViewer = ({ blobURL }: { blobURL: string }) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocx = async () => {
      try {
        // Fetch the file blob and read it as ArrayBuffer
        const response = await fetch(blobURL);
        const arrayBuffer = await response.arrayBuffer();

        // Convert DOCX → HTML using Mammoth
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(value);
      } catch (err) {
        console.error("Error loading DOCX:", err);
        setError("Failed to load document preview.");
      }
    };

    loadDocx();
  }, [blobURL]);

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg text-left overflow-auto max-h-[80vh]">
      {error ? (
        <p className="text-error text-center">{error}</p>
      ) : htmlContent ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading document...</p>
        </div>
      )}
    </div>
  );
};

export default SuperDocViewer;
