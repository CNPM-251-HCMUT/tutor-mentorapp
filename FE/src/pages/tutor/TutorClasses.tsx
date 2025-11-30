import React from "react";

// --- Icons Components ---

const UserGroupIcon = ({ className }: { className?: string }) => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
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
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

// --- Interface & Component ---

interface ClassItem {
  id: number;
  title: string;
  tag: string;
  tutor: string;
  studentsCount: number;
  docsCount: number;
  sessionsCount: number;
  status: "Active" | "Inactive";
}

const ClassCard = ({ data }: { data: ClassItem }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
      {/* Header: Title & Status */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[17px] font-medium text-gray-900">{data.title}</h3>
        <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {data.status}
        </span>
      </div>

      {/* Tag */}
      <div className="mb-6">
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200 font-medium">
          {data.tag}
        </span>
      </div>

      {/* Tutor Info */}
      <div className="mb-4">
        <p className="text-sm font-bold text-gray-900">{data.tutor}</p>
        <p className="text-xs text-gray-400 font-medium">Tutor</p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 mb-6 text-gray-500 text-sm font-medium">
        <div className="flex items-center gap-1.5">
          <UserGroupIcon className="w-5 h-5 text-gray-400" />
          <span>{data.studentsCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DocumentIcon className="w-5 h-5 text-gray-400" />
          <span>{data.docsCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <span>{data.sessionsCount}</span>
        </div>
      </div>

      {/* Footer Button */}
      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        <EyeIcon className="w-4 h-4" />
        View Class
      </button>
    </div>
  );
};

// --- Main Page Component ---

export default function MyClasses() {
  // Mock Data
  const classes: ClassItem[] = [
    {
      id: 1,
      title: "ML Study Group",
      tag: "Machine Learning",
      tutor: "Dr. Phạm Minh Tuấn",
      studentsCount: 2,
      docsCount: 2,
      sessionsCount: 0,
      status: "Active",
    },
    {
      id: 2,
      title: "ML Study Group",
      tag: "Machine Learning",
      tutor: "Dr. Phạm Minh Tuấn",
      studentsCount: 2,
      docsCount: 2,
      sessionsCount: 0,
      status: "Active",
    },
    {
      id: 3,
      title: "ML Study Group",
      tag: "Machine Learning",
      tutor: "Dr. Phạm Minh Tuấn",
      studentsCount: 2,
      docsCount: 2,
      sessionsCount: 0,
      status: "Active",
    },
    {
      id: 4,
      title: "ML Study Group",
      tag: "Machine Learning",
      tutor: "Dr. Phạm Minh Tuấn",
      studentsCount: 2,
      docsCount: 2,
      sessionsCount: 0,
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Container: Đồng bộ với Dashboard (max-w-[1200px] + px-8) */}
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="mb-10 text-left">
          {/* Đã xóa dòng HCMUT Tutor Program */}

          {/* Typography: Đồng bộ với Dashboard (Size 64px, Black, Italic, Tight) */}
          <h1
            className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            My Classes
          </h1>
          <p className="text-gray-500 italic text-[17px] font-medium">
            View documents and notes from tutors
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} data={cls} />
          ))}
        </div>
      </div>
    </div>
  );
}
