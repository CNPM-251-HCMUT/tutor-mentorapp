import React, { useEffect, useState } from 'react';

// Giữ nguyên import api
import { 
  authApi, 
  tutorApi, 
  groupApi, 
  type User, 
  type Group, // Chúng ta sẽ dùng chủ yếu type Group
  type Feedback 
} from '../services/api'; 

// --- Icons Components (Giữ nguyên không thay đổi) ---
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ChatIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
);
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const BellIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const ArrowLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

// --- StatCard Component (Giữ nguyên) ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  footerText: string;
  icon: React.ReactNode;
  theme: "orange" | "blue" | "green";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, footerText, icon, theme, onClick }) => {
  const themeClasses = {
    orange: "bg-orange-50 border-orange-100",
    blue: "bg-white border-gray-200",
    green: "bg-white border-gray-200",
  };

  return (
    <div 
        onClick={onClick}
        className={`${themeClasses[theme]} border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64 transition-all hover:shadow-md ${onClick ? 'cursor-pointer hover:bg-opacity-70' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-[17px] font-medium text-gray-900 mb-2">{title}</h3>
        <div className="mt-1 mb-auto">
          <div className="text-[17px] text-gray-500 leading-snug">
            <span className="block text-gray-700 font-normal">{value}</span>
            {subtext}
          </div>
        </div>
        <div className="text-gray-400 text-sm mt-4">{footerText}</div>
      </div>
    </div>
  );
};

// --- Sub-Component: Manage Classes View ---
// Cập nhật Props: Cả 2 list đều là Group[]
interface ManageClassesProps {
    initialTab: 'pending' | 'accepted';
    onBack: () => void;
    pendingGroups: Group[]; // Đổi từ pendingRequests sang pendingGroups
    acceptedGroups: Group[]; // Đổi từ myClasses sang acceptedGroups
}

const ManageClassesSection: React.FC<ManageClassesProps> = ({ initialTab, onBack, pendingGroups, acceptedGroups }) => {
    const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    return (
        <div>
            {/* Header & Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Back to Dashboard">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-3xl font-bold italic">Manage Classes</h2>
            </div>

            {/* Tab Switcher */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-8">
                <button 
                    onClick={() => setActiveTab('pending')} 
                    className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white shadow-sm font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Pending <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingGroups.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('accepted')} 
                    className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${activeTab === 'accepted' ? 'bg-white shadow-sm font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Accepted <span className="bg-gray-300 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">{acceptedGroups.length}</span>
                </button>
            </div>

            {/* CONTENT: PENDING TAB (Dựa trên Group Status = Pending) */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {pendingGroups.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            No pending requests at the moment.
                        </div>
                    ) : (
                        pendingGroups.map(group => (
                            <div key={group.id} className="border border-orange-200 rounded-xl p-6 shadow-sm bg-orange-50/30">
                                <div className="mb-4">
                                    {/* Hiển thị thông tin Group đầy đủ thay vì chỉ ID */}
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        {group.name} 
                                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Pending</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">Topic: {group.topic}</p>
                                    <div className="mt-3 flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">👥 {group.members?.length || 0} members</span>
                                        {/* <span className="flex items-center gap-1">Requested: {new Date(group.created_at).toLocaleDateString()}</span> */}
                                    </div>
                                </div>
                                {/* NÚT BẤM CHO PENDING: REJECT / ACCEPT */}
                                <div className="flex gap-4 mt-6">
                                    <button className="flex-1 border border-red-300 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors">
                                        Từ chối (Reject)
                                    </button>
                                    <button className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm">
                                        Chấp nhận (Accept)
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* CONTENT: ACCEPTED TAB (Dựa trên Group Status = Active) */}
            {activeTab === 'accepted' && (
                <div className="space-y-4">
                    {acceptedGroups.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 italic">You don't manage any groups yet.</div>
                    ) : (
                        acceptedGroups.map(group => (
                            <div key={group.id} className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg">{group.name} <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">Active</span></h3>
                                    <p className="text-gray-500 text-sm mt-1">Topic: {group.topic}</p>
                                    <div className="mt-3 flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">👥 {group.members?.length || 0} members</span>
                                    </div>
                                    <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-100 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span>📄 Course Syllabus.pdf</span>
                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">PDF</span>
                                        </div>
                                    </div>
                                </div>
                                {/* NÚT BẤM CHO ACCEPTED: DETAILS / UPLOAD */}
                                <div className="flex gap-4 mt-6">
                                    <button className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        ⚙️ Group Details
                                    </button>
                                    <button className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        ⬆️ Upload Document
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};


// --- Main Dashboard Component ---

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // SỬA ĐỔI STATE: Dùng Group[] cho cả 2 trạng thái
  const [pendingGroups, setPendingGroups] = useState<Group[]>([]);
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  
  const [totalSchedulesCount, setTotalSchedulesCount] = useState<number>(0);
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'dashboard' | 'manage'>('dashboard');
  const [initialManageTab, setInitialManageTab] = useState<'pending' | 'accepted'>('pending');

  const calculateAverageRating = (feedbacks: Feedback[]) => {
    if (!feedbacks || feedbacks.length === 0) return "0.0";
    const total = feedbacks.reduce((sum, item) => sum + item.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  };
  const averageRating = calculateAverageRating(recentFeedbacks);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await authApi.me();
        setCurrentUser(userData.user);

        if (userData.user.role === 'Tutor') {
            // 1. LẤY TẤT CẢ GROUPS LIÊN QUAN
            const allClasses = await tutorApi.getClasses(); // Giả sử hàm này trả về tất cả lớp (active + pending)

            // 2. LỌC DỮ LIỆU THEO STATUS (LOGIC BẠN YÊU CẦU)
            // active => accepted (activeGroups)
            // pending => pending (pendingGroups)
            const active = allClasses.filter((g: any) => g.status === 'active');
            const pending = allClasses.filter((g: any) => g.status === 'pending');

            setActiveGroups(active);
            setPendingGroups(pending);

            // 3. SCHEDULES (Tính toán như cũ)
            let scheduleCount = 0;
            // Chỉ tính schedule của lớp active thôi cho chuẩn
            const schedulePromises = active.map(group => groupApi.getGroupSchedules(group.id));
            const schedulesResults = await Promise.all(schedulePromises);
            schedulesResults.forEach(schedules => { scheduleCount += schedules.length; });
            setTotalSchedulesCount(scheduleCount);

            // 4. FEEDBACK (Giữ nguyên mock data)
            const mockFeedbacksFromJSON: Feedback[] = [
                { id: 1, schedule_id: 1, student_id: 1, tutor_id: 4, rating: 5, comment: "Very clear explanation, learned a lot!", created_at: "2025-11-28T16:30:00", student: { id: 1, name: "Nguyễn Văn A" } as User },
                { id: 2, schedule_id: 1, student_id: 2, tutor_id: 4, rating: 4, comment: "Good session.", created_at: "2025-11-28T16:35:00", student: { id: 2, name: "Trần Thị B" } as User }
            ];
            const myFeedbacks = mockFeedbacksFromJSON.filter(f => f.tutor_id === userData.user.id);
            setRecentFeedbacks(myFeedbacks);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleOpenPending = () => {
      setInitialManageTab('pending');
      setViewMode('manage');
  };

  const handleOpenAccepted = () => {
      setInitialManageTab('accepted');
      setViewMode('manage');
  };

  const handleBackToDashboard = () => {
      setViewMode('dashboard');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        
        {viewMode === 'dashboard' && (
            <div className="mb-10 text-left">
            <h1 className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                Dashboard
            </h1>
            <p className="text-gray-500 italic text-[17px] font-medium">Welcome back, {currentUser?.name || "Tutor"}!</p>
            </div>
        )}

        {/* --- VIEW MODE SWITCHING --- */}
        
        {viewMode === 'dashboard' ? (
            /* VIEW DASHBOARD CHÍNH */
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Card 1: Pending (Dựa trên pendingGroups) */}
                <StatCard
                    title="Pending Requests"
                    value={pendingGroups.length}
                    subtext="requests"
                    footerText={pendingGroups.length > 0 ? "You have new requests" : "No pending requests"}
                    theme="orange"
                    icon={<ClockIcon className="h-8 w-8 text-orange-500" />}
                    onClick={handleOpenPending} 
                />

                {/* Card 2: Managed (Dựa trên activeGroups) */}
                <StatCard
                    title="Managed Groups"
                    value={activeGroups.length}
                    subtext={activeGroups.length > 0 ? `Active: ${activeGroups.slice(0, 3).map(g => g.name).join(", ")}` : "groups"} 
                    footerText={activeGroups.length > 0 ? "Currently active" : "No groups yet"}
                    theme="blue"
                    icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
                    onClick={handleOpenAccepted}
                />

                <StatCard
                    title="Total Schedules"
                    value={totalSchedulesCount}
                    subtext="sessions recorded"
                    footerText={totalSchedulesCount > 0 ? "Check your calendar" : "No sessions yet"}
                    theme="green"
                    icon={<CalendarIcon className="h-8 w-8 text-green-500" />}
                />

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64 transition-all hover:shadow-md">
                    <div className="flex flex-col h-full">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                            <ChatIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <h3 className="text-[17px] font-medium text-gray-900 mb-1">Recent Feedback</h3>
                        <div className="text-gray-500 text-sm mb-4">
                            Average rating: <span className="font-semibold text-gray-700">{averageRating}</span> / 5.0
                        </div>
                        <div className="space-y-2 mt-auto pb-2 overflow-y-auto max-h-[100px]">
                            {recentFeedbacks.length > 0 ? (
                                recentFeedbacks.map((fb) => (
                                    <div key={fb.id} className="flex items-center justify-between text-sm text-gray-600 font-medium">
                                        <span className="truncate w-2/3 mr-2" title={fb.comment}>• {fb.student?.name || "Student"}: {fb.comment}</span>
                                        <div className="flex items-center flex-shrink-0"><span className="mr-1">{fb.rating}</span><StarIcon className="w-4 h-4 text-yellow-400" /></div>
                                    </div>
                                ))
                            ) : (<span className="text-gray-400 text-sm italic">No feedback received yet.</span>)}
                        </div>
                    </div>
                </div>
                </div>

                {/* Notifications */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BellIcon className="h-6 w-6 text-gray-900" />
                        <h3 className="text-lg font-bold text-gray-900">Recent Notifications</h3>
                    </div>
                    {pendingGroups.length > 0 ? (
                        <div onClick={handleOpenPending} className="bg-orange-50 rounded-lg p-5 flex justify-between items-start border border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer">
                            <div>
                                <h4 className="text-[15px] font-bold text-gray-900 mb-1">New Tutor Request</h4>
                                <p className="text-[13px] text-gray-600 mb-2 font-medium">
                                    You have {pendingGroups.length} pending group request(s) waiting for approval.
                                </p>
                                <p className="text-[11px] text-gray-400">Click to review</p>
                            </div>
                            <div className="mt-2"><div className="w-2 h-2 bg-orange-500 rounded-full"></div></div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic">No new notifications</div>
                    )}
                </div>
            </>
        ) : (
            /* VIEW QUẢN LÝ (Truyền danh sách đã lọc vào) */
            <ManageClassesSection 
                initialTab={initialManageTab}
                onBack={handleBackToDashboard}
                pendingGroups={pendingGroups}
                acceptedGroups={activeGroups}
            />
        )}
        
      </div>
    </div>
  );
}
