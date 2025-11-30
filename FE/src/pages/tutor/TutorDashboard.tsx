import React from "react";

// --- Icons Components (Giữ nguyên) ---
const ClockIcon = ({ className }: { className?: string }) => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
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

const ChatIcon = ({ className }: { className?: string }) => (
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
      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
    />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
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
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

// --- Sub-components ---

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  footerText: string;
  icon: React.ReactNode;
  theme: "orange" | "blue" | "green";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  footerText,
  icon,
  theme,
}) => {
  const themeClasses = {
    orange: "bg-orange-50 border-orange-100",
    blue: "bg-white border-gray-200",
    green: "bg-white border-gray-200",
  };

  return (
    <div
      className={`${themeClasses[theme]} border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64 transition-all hover:shadow-md`}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-medium text-gray-900 mb-2">{title}</h3>

        {/* Main Value & Subtext (Chỉnh lại giống hình 2: text nhỏ, tách dòng) */}
        <div className="mt-1 mb-auto">
          <div className="text-[17px] text-gray-500 leading-snug">
            <span className="block text-gray-700 font-normal">{value}</span>
            {subtext}
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-gray-400 text-sm mt-4">{footerText}</div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

export default function Dashboard() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      {/* CHỈNH SỬA QUAN TRỌNG:
        1. max-w-[1200px]: Giới hạn chiều rộng chính xác như hình 2.
        2. px-8: Padding 2 bên rộng hơn để chữ "Dashboard" không bị sát lề trái.
      */}
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="mb-10 text-left">
          {/* Thêm lại tiêu đề phụ nếu cần giống hình 2, nếu không thì để trống */}
          {/* <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-gray-900">HCMUT Tutor Program</h2>
                <span className="bg-gray-900 text-white text-[11px] font-bold px-3 py-1 rounded-full">Tutor</span>
            </div> */}

          {/* CHỈNH SỬA TYPOGRAPHY:
            1. text-[64px]: Kích thước chuẩn.
            2. tracking-tighter: Chữ dính sát nhau hơn.
            3. leading-none: Khoảng cách dòng khít.
          */}
          <h1
            className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-500 italic text-[17px] font-medium">
            Welcome back, Dr. Phạm Minh Tuấn!
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Pending Requests */}
          <StatCard
            title="Pending Requests"
            value="0"
            subtext="requests"
            footerText="No pending requests"
            theme="orange"
            icon={<ClockIcon className="h-8 w-8 text-orange-500" />}
          />

          {/* Card 2: Managed Groups */}
          <StatCard
            title="Managed Groups"
            value="0"
            subtext="groups"
            footerText="No groups yet"
            theme="blue"
            icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
          />

          {/* Card 3: Today's Schedule */}
          <StatCard
            title="Today's Schedule"
            value="0"
            subtext="sessions"
            footerText="No sessions today"
            theme="green"
            icon={<CalendarIcon className="h-8 w-8 text-green-500" />}
          />

          {/* Card 4: Recent Feedback */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64 transition-all hover:shadow-md">
            <div className="flex flex-col h-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <ChatIcon className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-[17px] font-medium text-gray-900 mb-1">
                Recent Feedback
              </h3>
              <div className="text-gray-500 text-sm mb-4">
                Average rating: 5.0 / 5.0
              </div>

              <div className="space-y-2 mt-auto pb-2">
                {[1, 2].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm text-gray-600 font-medium"
                  >
                    <span className="mr-2">• ML Study Group : 5</span>
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm mt-8">
          <div className="flex items-center gap-3 mb-6">
            <BellIcon className="h-6 w-6 text-gray-900" />
            <h3 className="text-lg font-bold text-gray-900">
              Recent Notifications
            </h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 flex justify-between items-start border border-gray-100 hover:bg-gray-100 transition-colors">
            <div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-1">
                New Schedule Created
              </h4>
              <p className="text-[13px] text-gray-500 mb-2 font-medium">
                ML Fundamentals session scheduled for Oct 21
              </p>
              <p className="text-[11px] text-gray-400">10/18/2025</p>
            </div>
            <div className="mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

