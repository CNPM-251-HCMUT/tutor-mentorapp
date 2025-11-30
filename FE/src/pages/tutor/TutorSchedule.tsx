import React, { useState } from "react";

// --- Icons Components ---

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

const CalendarEmptyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11h.01M16 15h.01M12 11h.01M12 15h.01M8 11h.01M8 15h.01"
    />
  </svg>
);

// --- Modal Component ---

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateScheduleModal = ({ isOpen, onClose }: CreateScheduleModalProps) => {
  const [mode, setMode] = useState<"Online" | "Offline">("Online");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Create Schedule</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create a new schedule for your group
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Group Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Group *
            </label>
            <select className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all">
              <option>Select group..</option>
              <option>ML Study Group</option>
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all"
            />
          </div>

          {/* Date & Repeat Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Repeat
              </label>
              <select className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all">
                <option>None</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          {/* Start Time & End Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Start Time *
              </label>
              <input
                type="time"
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                End Time *
              </label>
              <input
                type="time"
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mode Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Mode:
            </label>
            <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setMode("Online")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === "Online"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setMode("Offline")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === "Offline"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Offline
              </button>
            </div>
          </div>

          {/* Meeting Link / Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              {mode === "Online" ? "Meeting Link" : "Location"}
            </label>
            <input
              type="text"
              placeholder={
                mode === "Online"
                  ? "https://meet.google.com/..."
                  : "Room A101, B4 Building..."
              }
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function Schedules() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            {/* Title Style giống Dashboard/Classes */}
            <h1
              className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Schedules
            </h1>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm mb-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create Schedule
          </button>
        </div>

        {/* Empty State Content */}
        <div className="border border-gray-100 rounded-2xl h-[400px] flex flex-col items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-16 h-16 text-gray-200 mb-4">
            <CalendarEmptyIcon className="w-full h-full" />
          </div>
          <p className="text-gray-400 font-medium">No schedules yet</p>
        </div>
      </div>

      {/* Modal Injection */}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
