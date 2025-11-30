import React from "react";

// --- Icons ---

const StarIcon = ({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    color={filled ? undefined : "#E5E7EB"} // Gray-200 for empty
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
      clipRule="evenodd"
    />
  </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
  </svg>
);

// --- Sub-components ---

// Component hiển thị hàng sao (5 sao)
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          filled={star <= Math.round(rating)}
          className={`w-5 h-5 ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// Component thẻ thống kê (Top Cards)
const StatCard = ({
  title,
  value,
  showStar = false,
}: {
  title: string;
  value: string | number;
  showStar?: boolean;
}) => (
  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-32 flex flex-col justify-between">
    <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
    <div className="flex items-center gap-2">
      <span className="text-4xl font-medium text-gray-900">{value}</span>
      {showStar && <StarIcon filled className="w-8 h-8 text-yellow-400 mb-1" />}
    </div>
  </div>
);

// --- Main Page Component ---

export default function Feedback() {
  // Mock Data
  const feedbacks = [
    {
      id: 1,
      group: "ML Study Group",
      date: "10/14/2025",
      from: "Nguyễn Văn An",
      sessionQuality: 5,
      tutorQuality: 5,
      comment: "Excellent session! Very clear explanations.",
    },
    {
      id: 2,
      group: "ML Study Group",
      date: "10/14/2025",
      from: "Trần Thị Bình",
      sessionQuality: 4, // Ví dụ 4 sao để test hiển thị sao xám
      tutorQuality: 5,
      comment: "Good pace, would like more practice exercises.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* --- Header Section --- */}
        <div className="mb-10 text-left">
          {/* Typography chuẩn: Size 64, Black, Italic, Tight Tracking */}
          <h1
            className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Feedback
          </h1>
        </div>

        {/* --- Top Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Feedback" value="2" />
          <StatCard title="Session Quality" value="4.5" showStar />
          <StatCard title="Tutor Quality" value="5.0" showStar />
        </div>

        {/* --- Feedback List --- */}
        <div className="space-y-6">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              {/* Header: Group Name & Date */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {item.group}
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                  {item.date}
                </span>
              </div>

              {/* Sender Name */}
              <div className="text-sm text-gray-500 mb-6">
                From:{" "}
                <span className="font-medium text-gray-700">{item.from}</span>
              </div>

              {/* Ratings Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Session Quality */}
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1.5">
                    Session Quality
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={item.sessionQuality} />
                    <span className="text-sm font-medium text-gray-900">
                      {item.sessionQuality}/5
                    </span>
                  </div>
                </div>

                {/* Tutor Quality */}
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1.5">
                    Tutor Quality
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={item.tutorQuality} />
                    <span className="text-sm font-medium text-gray-900">
                      {item.tutorQuality}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Box */}
              <div>
                <div className="text-xs text-gray-500 font-medium mb-2 pl-1">
                  Comments
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 font-medium text-sm leading-relaxed">
                  "{item.comment}"
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Footer Alert --- */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <LightBulbIcon className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 font-medium">
            You've received 2 feedback with an average rating of 5.0/5.0. Keep
            up the excellent work!
          </p>
        </div>
      </div>
    </div>
  );
}
