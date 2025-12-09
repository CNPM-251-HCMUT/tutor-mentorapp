import React, { useState, useEffect } from 'react';

// Import các hàm và kiểu dữ liệu từ API
import { 
  tutorApi, 
  groupApi, 
  authApi,
  type Schedule, 
  type Group 
} from '../services/api'; // Hãy đảm bảo đường dẫn import đúng với cấu trúc của bạn

// --- Icons Components ---
const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CalendarEmptyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11h.01M16 15h.01M12 11h.01M12 15h.01M8 11h.01M8 15h.01" />
  </svg>
);

const VideoCameraIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
  
const MapPinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- Helper Functions ---

// 1. Tính EndTime từ StartTime + Duration để hiển thị vào form
const getEndTimeFromDuration = (startTimeStr: string, durationMinutes: number): string => {
    if (!startTimeStr) return '';
    const [hours, mins] = startTimeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins + durationMinutes);
    return date.toTimeString().slice(0, 5); 
};

// 2. Tính Duration từ StartTime và EndTime trên form
const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
};

// 3. Ghép chuỗi Location/Link để hiển thị vào form
const getLocationString = (schedule: Schedule) => {
    // Nếu là online, trả về link
    if (schedule.type === 'online') return schedule.link || '';
    
    // Nếu là offline, ưu tiên ghép Room + Building, nếu không có thì trả về link (nếu BE lưu chung)
    const parts = [];
    if (schedule.room) parts.push(schedule.room);
    if (schedule.building) parts.push(schedule.building);
    
    if (parts.length > 0) return parts.join(', '); // VD: "Room A101, B4"
    return schedule.link || ''; // Fallback
};

// --- Modal Component ---

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[]; 
  onSuccess: () => void; 
  editData?: Schedule | null;
}

const CreateScheduleModal = ({ isOpen, onClose, groups, onSuccess, editData }: CreateScheduleModalProps) => {
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online');
  const [formData, setFormData] = useState({
      groupId: '',
      title: '', 
      date: '',
      startTime: '',
      endTime: '',
      link: '' // Dùng chung cho Link hoặc Location string
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        setErrorMsg(null);
        if (editData) {
            // === CHẾ ĐỘ CHANGE (SỬA) ===
            const dateTime = new Date(editData.time);
            const dateStr = dateTime.toISOString().split('T')[0]; 
            const startTimeStr = dateTime.toTimeString().slice(0, 5);  
            
            // Tự động tính EndTime cũ để điền vào form
            const endTimeStr = getEndTimeFromDuration(startTimeStr, editData.duration);

            // Lấy chuỗi địa điểm cũ
            const locationStr = getLocationString(editData);

            setFormData({
                groupId: editData.group_id.toString(),
                title: editData.title || '', // Lấy title từ DB
                date: dateStr,
                startTime: startTimeStr,
                endTime: endTimeStr, 
                link: locationStr 
            });
            setMode(editData.type === 'offline' ? 'Offline' : 'Online');
        } else {
            // === CHẾ ĐỘ TẠO MỚI ===
            setFormData({ groupId: '', title: '', date: '', startTime: '', endTime: '', link: '' });
            setMode('Online');
        }
    }
  }, [isOpen, editData]);

  const handleSubmit = async () => {
      setErrorMsg(null);

      // Validate Form
      if (!formData.groupId || !formData.date || !formData.startTime || !formData.endTime) {
          setErrorMsg("Please fill in all required fields.");
          return;
      }

      const newDuration = calculateDuration(formData.startTime, formData.endTime);
      if (newDuration <= 0) {
          setErrorMsg("End Time must be after Start Time.");
          return;
      }

      setLoading(true);
      try {
          const userRes = await authApi.me();
          const formattedTime = `${formData.date} ${formData.startTime}`; 

          if (editData) {
              // === LOGIC KIỂM TRA THAY ĐỔI ===
              const isGroupSame = Number(formData.groupId) === editData.group_id;
              
              // So sánh Time (cắt bỏ giây)
              const oldTimeStr = editData.time.replace('T', ' ').slice(0, 16);
              const isTimeSame = formattedTime === oldTimeStr;
              
              const isDurationSame = newDuration === editData.duration;
              
              // So sánh Location/Link
              const oldLocationStr = getLocationString(editData);
              const isLinkSame = formData.link === oldLocationStr;
              
              const isTypeSame = mode.toLowerCase() === editData.type;
              const isTitleSame = formData.title === (editData.title || '');

              if (isGroupSame && isTimeSame && isDurationSame && isLinkSame && isTypeSame && isTitleSame) {
                  setErrorMsg("You haven't changed any information.");
                  setLoading(false);
                  return; // CHẶN KHÔNG GỌI API
              }

              // --- UPDATE ---
              // Lưu ý: Nếu là Offline, bạn có thể cần tách chuỗi formData.link thành room/building nếu BE yêu cầu
              // Ở đây ta gửi thẳng vào link/location tuỳ cấu hình BE
              await tutorApi.updateSchedule(editData.id, {
                  time: formattedTime,
                  duration: newDuration,
                  link: formData.link, // Hoặc tách ra room/building nếu cần
                  type: mode.toLowerCase() as 'online' | 'offline',
                  title: formData.title // Cần bổ sung field title vào api.ts nếu chưa có
              });
          } else {
              // --- CREATE ---
              await tutorApi.createSchedule({
                  group_id: Number(formData.groupId),
                  tutor_id: userRes.user.id,
                  time: formattedTime,
                  duration: newDuration,
                  type: mode.toLowerCase() as 'online' | 'offline',
                  link: formData.link,
                  title: formData.title
              } as any); // cast any nếu CreateSchedulePayload chưa cập nhật title
          }
          
          onSuccess();
          onClose();
      } catch (error) {
          console.error("Action failed", error);
          setErrorMsg("Failed to save schedule.");
      } finally {
          setLoading(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
                {editData ? 'Update Schedule' : 'Create Schedule'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
                {editData ? 'Modify existing schedule details' : 'Create a new schedule for your group'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Group *</label>
            <select 
                disabled={!!editData}
                value={formData.groupId}
                onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                className={`w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none ${editData ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <option value="">Select group..</option>
              {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Title *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Date *</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Repeat</label>
              <select className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none">
                <option>None</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Start Time *</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">End Time *</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Mode:</label>
            <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1">
              <button 
                onClick={() => setMode('Online')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === 'Online' 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Online
              </button>
              <button 
                onClick={() => setMode('Offline')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === 'Offline' 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Offline
              </button>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                {mode === 'Online' ? 'Meeting Link' : 'Location'}
             </label>
             <input 
              type="text" 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              placeholder={mode === 'Online' ? "https://meet.google.com/..." : "Room A101, B4 Building..."}
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none placeholder-gray-400"
            />
          </div>

          {/* HIỂN THỊ LỖI */}
          {errorMsg && (
              <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 text-center animate-in fade-in slide-in-from-top-1">
                  {errorMsg}
              </div>
          )}

        </div>

        <div className="px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : (editData ? 'Update' : 'Create')}
          </button>
        </div>

      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function Schedules() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [myClasses, setMyClasses] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const fetchSchedules = async () => {
    try {
        setLoading(true);
        const classes = await tutorApi.getClasses();
        setMyClasses(classes);

        let allSchedules: Schedule[] = [];
        const promises = classes.map(g => groupApi.getGroupSchedules(g.id));
        const results = await Promise.all(promises);
        results.forEach(groupScheds => {
            allSchedules = [...allSchedules, ...groupScheds];
        });
        allSchedules.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setSchedules(allSchedules);
    } catch (error) {
        console.error("Error fetching schedules", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleOpenCreate = () => {
      setEditingSchedule(null);
      setIsModalOpen(true);
  }

  const handleEdit = (schedule: Schedule) => {
      setEditingSchedule(schedule);
      setIsModalOpen(true);
  }

  const handleDelete = async (scheduleId: number) => {
      if (window.confirm("Are you sure you want to delete this schedule?")) {
          try {
              await tutorApi.deleteSchedule(scheduleId);
              fetchSchedules(); 
          } catch (error) {
              console.error("Delete failed", error);
              alert("Failed to delete schedule");
          }
      }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
              Schedules
            </h1>
          </div>
          
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm mb-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create Schedule
          </button>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading schedules...</div>
        ) : schedules.length === 0 ? (
            <div className="border border-gray-100 rounded-2xl h-[400px] flex flex-col items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="w-16 h-16 text-gray-200 mb-4">
                    <CalendarEmptyIcon className="w-full h-full" />
                </div>
                <p className="text-gray-400 font-medium">No schedules yet</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {schedules.map((schedule) => {
                    const groupName = myClasses.find(g => g.id === schedule.group_id)?.name || `Group #${schedule.group_id}`;
                    const dateObj = new Date(schedule.time);

                    return (
                        <div key={schedule.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {schedule.title || `${groupName} - Session`} 
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarEmptyIcon className="w-4 h-4" />
                                        {dateObj.toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <ClockIcon className="w-4 h-4" />
                                        {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({schedule.duration} mins)
                                    </span>
                                    {schedule.type === 'online' ? (
                                         <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                            <VideoCameraIcon className="w-4 h-4" />
                                            Online
                                         </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                            <MapPinIcon className="w-4 h-4" />
                                            Offline
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(schedule)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <PencilIcon className="w-4 h-4 text-gray-500" />
                                    Change
                                </button>
                                <button 
                                    onClick={() => handleDelete(schedule.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

      </div>

      <CreateScheduleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        groups={myClasses}
        onSuccess={fetchSchedules}
        editData={editingSchedule} 
      />

    </div>
  );
}
