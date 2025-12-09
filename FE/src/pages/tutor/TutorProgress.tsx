import React, { useState, useEffect } from 'react';
// Import api instance và types
import api, { 
  tutorApi, 
  type Group, 
  type Progress 
} from '../services/api';

// --- Icons ---
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

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- Helper Functions ---

// Map từ string level sang số để hiển thị chấm tròn
const mapLevelToScore = (level: string): number => {
    switch (level.toLowerCase()) {
        case 'excellent': return 5;
        case 'good': return 4;
        case 'average': return 3;
        case 'poor': return 2;
        case 'bad': return 1;
        default: return 3;
    }
};

// Map từ số slider sang string để gửi về BE
const mapScoreToLevel = (score: number): string => {
    if (score >= 5) return 'excellent';
    if (score === 4) return 'good';
    if (score === 3) return 'average';
    if (score === 2) return 'poor';
    return 'bad';
};

// Component hiển thị chấm điểm
const RatingDots = ({ rating, max = 5 }: { rating: number; max?: number }) => {
  return (
    <div className="flex gap-1.5">
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < rating ? 'bg-blue-600' : 'bg-gray-200'
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
  groups: Group[];
  onSuccess: () => void;
}

const RecordProgressModal = ({ isOpen, onClose, groups, onSuccess }: RecordProgressModalProps) => {
  const [sliderValue, setSliderValue] = useState(3);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      groupId: '',
      date: '',
      summary: '', // topics_covered
      remarks: '', // notes
      attendanceStr: '' // tạm thời nhập text số lượng hoặc ID
  });

  // Reset form
  useEffect(() => {
      if(isOpen) {
          setFormData({ groupId: '', date: '', summary: '', remarks: '', attendanceStr: '' });
          setSliderValue(3);
      }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.groupId || !formData.date || !formData.summary) {
        alert("Please fill in required fields");
        return;
    }

    setLoading(true);
    try {
        // Lấy thông tin user hiện tại
        const me = await api.get('/me');
        const currentTutorId = me.data.user.id;

        // Xử lý topics: Tách chuỗi bằng dấu phẩy
        const topicsArray = formData.summary.split(',').map(s => s.trim());

        // Xử lý attendance: Vì UI nhập text, ta mock tạm danh sách ID. 
        // Thực tế nên có UI chọn Multi-select student.
        // Ở đây giả định nhập vào là "1, 2" (ID học sinh)
        const attendanceIds = formData.attendanceStr 
            ? formData.attendanceStr.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
            : []; 

        const payload = {
            group_id: Number(formData.groupId),
            tutor_id: currentTutorId,
            date: formData.date,
            notes: formData.remarks,
            topics_covered: topicsArray,
            progress_level: mapScoreToLevel(sliderValue),
            attendance: attendanceIds
        };

        // Gọi API (Giả sử endpoint là /progress)
        await api.post('/progress', payload);
        
        onSuccess();
        onClose();
    } catch (error) {
        console.error("Create progress failed", error);
        alert("Failed to save progress");
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

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Record Progress</h3>
            <p className="text-sm text-gray-500 mt-1">Add a progress entry for your group</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Group */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Group *</label>
            <div className="relative">
              <select 
                value={formData.groupId}
                onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none appearance-none"
              >
                <option value="">Select group...</option>
                {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Date *</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none"
            />
          </div>

          {/* Progress Summary (Topics) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Progress Summary (Topics) *</label>
            <textarea 
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              placeholder="e.g. Arrays, Linked Lists, Time Complexity..."
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none resize-none"
            ></textarea>
          </div>

          {/* Remarks (Notes) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Remarks</label>
            <textarea 
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              placeholder="Additional remarks on student performance..."
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none resize-none"
            ></textarea>
          </div>

          {/* Understanding Level Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-900">Understanding Level: {sliderValue}/5</label>
                <span className="text-xs font-medium text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                    {mapScoreToLevel(sliderValue)}
                </span>
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

          {/* Attendance (Input IDs temporarily) */}
          <div>
             <label className="block text-sm font-semibold text-gray-900 mb-1.5">Attendance (Student IDs)</label>
             <input 
              type="text" 
              value={formData.attendanceStr}
              onChange={(e) => setFormData({...formData, attendanceStr: e.target.value})}
              placeholder="e.g. 1, 2 (Separate by comma)"
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
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function ProgressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      try {
          setLoading(true);
          // 1. Lấy danh sách lớp để filter
          const classes = await tutorApi.getClasses();
          setGroups(classes);

          // 2. Lấy danh sách progress (Giả sử endpoint là /progress)
          // Vì api.ts chưa có hàm getProgress, ta dùng api.get
          const res = await api.get<Progress[]>('/progress'); // Cần BE hỗ trợ route này
          
          // Sắp xếp ngày mới nhất lên đầu
          const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setProgressList(sorted);

      } catch (error) {
          console.error("Fetch progress failed", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  // Filter logic
  const filteredList = selectedGroupFilter === 'all' 
    ? progressList 
    : progressList.filter(p => p.group_id === Number(selectedGroupFilter));

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        
        {/* Header Section */}
        <div className="mb-12 text-left">
          <h1 className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Progress
          </h1>
        </div>

        {/* Sub-header & Actions */}
        <div className="bg-gray-50/50 rounded-3xl p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-medium text-gray-900 mb-1">Record Progress</h2>
                    <p className="text-gray-500">Record student progress and understanding</p>
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
                <span className="text-sm font-medium text-gray-600">Filter by group:</span>
                <div className="relative">
                    <select 
                        value={selectedGroupFilter}
                        onChange={(e) => setSelectedGroupFilter(e.target.value)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 pr-8 rounded-lg transition-colors appearance-none cursor-pointer outline-none"
                    >
                        <option value="all">All groups</option>
                        {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Progress List */}
            {loading ? (
                <div className="text-center text-gray-500 py-10">Loading progress...</div>
            ) : filteredList.length === 0 ? (
                <div className="text-center text-gray-400 py-10 italic">No progress records found.</div>
            ) : (
                <div className="space-y-4">
                    {filteredList.map((item) => {
                        // Tìm tên Group
                        const groupName = groups.find(g => g.id === item.group_id)?.name || "Unknown Group";
                        
                        // Tính toán hiển thị Attendance
                        const groupInfo = groups.find(g => g.id === item.group_id);
                        const totalStudents = groupInfo ? groupInfo.members.length : '?'; // Tổng học sinh trong nhóm
                        const presentStudents = item.attendance.length;

                        return (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                                    <div className="mb-2 md:mb-0">
                                        <div className="text-sm font-bold text-gray-900 mb-1">{groupName}</div>
                                        <div className="text-sm font-medium text-gray-500">
                                            {new Date(item.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500 font-medium">Understanding Level:</span>
                                        <RatingDots rating={mapLevelToScore(item.progress_level)} />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Progress Summary</h4>
                                        <p className="text-gray-900 font-medium">
                                            {/* Hiển thị mảng topics dạng chuỗi */}
                                            {item.topics_covered.join(", ")}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Remarks</h4>
                                        <p className="text-gray-900 font-medium">{item.notes}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Attendance</h4>
                                        <p className="text-gray-900 font-medium">
                                            {presentStudents} / {totalStudents} students present
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

      </div>

      {/* Modal Injection */}
      <RecordProgressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        groups={groups}
        onSuccess={fetchData}
      />

    </div>
  );
}
