import React, { useState } from "react";

// --- Icons ---

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

// --- Sub-components ---

// Component hiển thị chấm điểm (Rating Dots)
const RatingDots = ({ rating, max = 5 }: { rating: number; max?: number }) => {
  return (
    <div className="flex gap-1.5">
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < rating ? "bg-blue-600" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// --- Modal Component ---

interface RecordProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecordProgressModal = ({ isOpen, onClose }: RecordProgressModalProps) => {
  const [sliderValue, setSliderValue] = useState(3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Record Progress</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add a progress entry for your group
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Group */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Group *
            </label>
            <div className="relative">
              <select className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none appearance-none">
                <option>Select group...</option>
                <option>ML Study Group</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none"
            />
          </div>

          {/* Progress Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Progress Summary *
            </label>
            <textarea
              rows={2}
              placeholder="Summary of topics covered..."
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none resize-none"
            ></textarea>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Additional remarks..."
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none resize-none"
            ></textarea>
          </div>

          {/* Understanding Level Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Understanding Level: {sliderValue}/5
              </label>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Attendance
            </label>
            <input
              type="text"
              placeholder="e.g. 2 / 0 students present"
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none"
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function Progress() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* --- Header Section (Typography chuẩn các trang trước) --- */}
        <div className="mb-12 text-left">
          <h1
            className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Progress
          </h1>
        </div>

        {/* --- Sub-header & Actions --- */}
        <div className="bg-gray-50/50 rounded-3xl p-8 mb-8">
          {" "}
          {/* Container ảo để group nội dung nếu cần, hoặc để trắng như mẫu */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-1">
                Record Progress
              </h2>
              <p className="text-gray-500">
                Record student progress and understanding
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Entry
            </button>
          </div>
          {/* Filter */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm font-medium text-gray-600">
              Filter by group:
            </span>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              All groups
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          {/* --- Progress Card List --- */}
          <div className="space-y-4">
            {/* Item 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="text-sm font-medium text-gray-500 mb-2 md:mb-0">
                  10/14/2025
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">
                    Understanding Level:
                  </span>
                  <RatingDots rating={4} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Progress Summary
                  </h4>
                  <p className="text-gray-900 font-medium">
                    Covered neural network basics and backpropagation
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Remarks
                  </h4>
                  <p className="text-gray-900 font-medium">
                    Students are grasping concepts well
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Attendance
                  </h4>
                  <p className="text-gray-900 font-medium">
                    2 / 0 students present
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Injection */}
      <RecordProgressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
