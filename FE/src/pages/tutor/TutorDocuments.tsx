import React, { useState } from "react";

// --- Icons ---

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

const FileIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- Upload Modal Component ---

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[550px] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Upload Documents
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload documents for your group
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Group Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Group *
            </label>
            <div className="relative">
              <select className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none appearance-none">
                <option>Select group</option>
                <option>ML Study Group</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <UploadIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-900 font-medium mb-1">
              Drag and drop files here or
            </p>
            <button className="my-2 px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Choose File
            </button>
            <p className="text-xs text-gray-400 mt-1">
              Supported: PDF, DOC, DOCX, PPT, PPTX (max 10MB)
            </p>
          </div>

          {/* File Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              File Name *
            </label>
            <input
              type="text"
              placeholder="document.pdf"
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function Documents() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data
  const documents = [
    {
      id: 1,
      name: "Introduction to Machine Learning.pdf",
      type: "PDF",
      size: "2.3 MB",
      date: "9/10/2025",
    },
    {
      id: 2,
      name: "Neural Networks Lecture Notes",
      type: "Note",
      size: null, // Notes might not have size shown in design
      date: "10/1/2025",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            {/* Title Style chuẩn: Size 64, Black, Italic, Tight Tracking */}
            <h1
              className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Documents
            </h1>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm mb-2"
          >
            <UploadIcon className="w-5 h-5" />
            Upload
          </button>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all"
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-4">
                {/* File Icon Box */}
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-6 h-6 text-blue-600" />
                </div>

                {/* Text Info */}
                <div>
                  <h4 className="text-[15px] font-bold text-gray-900 mb-0.5">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <span className="uppercase">{doc.type}</span>
                    {doc.size && (
                      <>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              </div>

              {/* Right: Delete Action */}
              <button className="p-2 hover:bg-red-50 rounded-full transition-colors group mr-2">
                <XMarkIcon className="w-5 h-5 text-red-500 group-hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Injection */}
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
