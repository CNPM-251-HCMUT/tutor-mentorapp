import { useState, useEffect } from "react";
import { authApi, tutorApi, type Feedback } from "../services/api";

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

// Extended Feedback interface với thông tin từ backend
interface ExtendedFeedback extends Feedback {
  student_name?: string;
  student?: any;
  schedule?: any;
  group?: any;
  group_name?: string;
}

// --- Main Page Component ---

export default function TutorFeedback() {
  const [feedbacks, setFeedbacks] = useState<ExtendedFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const [userRes, feedbacksRes] = await Promise.all([
        authApi.me(),
        tutorApi.getFeedbacks(),
      ]);

      // Đảm bảo feedbacks là mảng
      const feedbacksList = Array.isArray(feedbacksRes) ? feedbacksRes : [];
      
      // Sắp xếp theo ngày mới nhất
      const sorted = feedbacksList.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setFeedbacks(sorted);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê
  const totalFeedback = feedbacks.length;
  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* --- Header Section --- */}
        <div className="mb-10 text-left">
          <h1
            className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Feedback
          </h1>
        </div>

        {/* --- Top Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Feedback" value={totalFeedback} />
          <StatCard title="Average Rating" value={averageRating} showStar />
          <StatCard title="Tutor Quality" value={averageRating} showStar />
        </div>

        {/* --- Feedback List --- */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center text-gray-400 py-10 italic">No feedback received yet.</div>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((item) => {
              const groupName = item.group_name || item.group?.name || `Group #${item.schedule?.group_id || 'N/A'}`;
              const studentName = item.student_name || item.student?.name || `Student #${item.student_id}`;
              const formattedDate = formatDate(item.created_at);

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                >
                  {/* Header: Group Name & Date */}
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {groupName}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Sender Name */}
                  <div className="text-sm text-gray-500 mb-6">
                    From:{" "}
                    <span className="font-medium text-gray-700">{studentName}</span>
                  </div>

                  {/* Ratings Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Session Quality - dùng rating chung */}
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1.5">
                        Session Quality
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={item.rating} />
                        <span className="text-sm font-medium text-gray-900">
                          {item.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Tutor Quality - dùng rating chung */}
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1.5">
                        Tutor Quality
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={item.rating} />
                        <span className="text-sm font-medium text-gray-900">
                          {item.rating}/5
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
                      "{item.comment || "No comment provided."}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Footer Alert --- */}
        {feedbacks.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <LightBulbIcon className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 font-medium">
              You've received {totalFeedback} feedback{totalFeedback !== 1 ? 's' : ''} with an average rating of {averageRating}/5.0. Keep
              up the excellent work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
