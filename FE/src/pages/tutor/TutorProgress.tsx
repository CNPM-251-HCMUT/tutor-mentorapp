import { useState, useEffect } from 'react';
import api, { 
  authApi, 
  tutorApi, 
  type Group 
} from '../services/api';

// --- 1. Interface khớp data.json ---
export interface Progress {
  id: number;
  group_id: number;
  tutor_id: number;
  schedule_id: number;
  date: string;
  attendance: number[]; 
  notes: string;
  topics_covered: string[];
  progress_level: 'excellent' | 'good' | 'average' | 'poor' | 'bad';
  created_at: string;
}

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
const mapLevelToScore = (level: string): number => {
    switch (level?.toLowerCase()) {
        case 'excellent': return 5;
        case 'good': return 4;
        case 'average': return 3;
        case 'poor': return 2;
        case 'bad': return 1;
        default: return 3;
    }
};

const mapScoreToLevel = (score: number): string => {
    if (score >= 5) return 'excellent';
    if (score === 4) return 'good';
    if (score === 3) return 'average';
    if (score === 2) return 'poor';
    return 'bad';
};

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
  currentTutorId: number;
}

const RecordProgressModal = ({ isOpen, onClose, groups, onSuccess, currentTutorId }: RecordProgressModalProps) => {
  const [sliderValue, setSliderValue] = useState(3);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
      groupId: '',
      date: new Date().toISOString().split('T')[0],
      summary: '', 
      remarks: '', 
      attendanceStr: '' 
  });

  useEffect(() => {
      if(isOpen) {
          setFormData({ 
            groupId: '', 
            date: new Date().toISOString().split('T')[0], 
            summary: '', 
            remarks: '', 
            attendanceStr: '' 
          });
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
        const topicsArray = formData.summary.split(',').map(s => s.trim()).filter(s => s !== '');
        const attendanceIds = formData.attendanceStr 
            ? formData.attendanceStr.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
            : []; 

        const payload = {
            group_id: Number(formData.groupId),
            tutor_id: currentTutorId,
            schedule_id: 1, // Default ID nếu chưa có logic chọn lịch
            date: formData.date,
            notes: formData.remarks,
            topics_covered: topicsArray,
            progress_level: mapScoreToLevel(sliderValue),
            attendance: attendanceIds,
            created_at: new Date().toISOString()
        };

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Record Progress</h3>
            <p className="text-sm text-gray-500 mt-1">Add a progress entry for your group</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Group *</label>
            <div className="relative">
              <select 
                value={formData.groupId}
                onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none appearance-none"
              >
                <option value="">Select group...</option>
                {groups.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Date *</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Topics Covered * (comma separated)</label>
            <textarea rows={2} value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} placeholder="e.g. Arrays, Linked Lists" className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Remarks / Notes</label>
            <textarea rows={2} value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="Additional remarks..." className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none resize-none"></textarea>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-900">Understanding Level: {sliderValue}/5</label>
                <span className="text-xs font-medium text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">{mapScoreToLevel(sliderValue)}</span>
            </div>
            <input type="range" min="1" max="5" value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Low</span><span>High</span></div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-900 mb-1.5">Attendance (Student IDs)</label>
             <input type="text" value={formData.attendanceStr} onChange={(e) => setFormData({...formData, attendanceStr: e.target.value})} placeholder="e.g. 1, 2" className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none" />
          </div>
        </div>
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-50">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:bg-gray-400">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function TutorProgress() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentTutorId, setCurrentTutorId] = useState<number>(0);

  const fetchData = async () => {
      try {
          setLoading(true);
          
          // Gọi API
          const [userRes, classesRes, progressRes] = await Promise.all([
              authApi.me(),
              tutorApi.getClasses(),
              api.get<Progress[]>('/progress')
          ]);

          const myId = userRes.user.id;
          setCurrentTutorId(myId);
          setGroups(classesRes);

          // Xử lý dữ liệu từ response
          // Flask trả về mảng trực tiếp với jsonify(), axios sẽ có data trong response.data
          let allProgress: Progress[] = [];
          
          // Flask endpoint trả về mảng trực tiếp
          if (Array.isArray(progressRes.data)) {
              allProgress = progressRes.data;
          } else {
              console.warn("⚠️ Response không phải là array:", progressRes.data);
              allProgress = [];
          }

          // Filter theo Tutor ID
          const myProgress = allProgress.filter(p => p && p.tutor_id === myId);

          // Sắp xếp theo date (mới nhất trước)
          const sorted = myProgress.sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
          });
          
          setProgressList(sorted);

      } catch (error: any) {
          console.error("❌ Fetch progress failed:", error);
          console.error("Error details:", error.response?.data || error.message);
          // Set empty array on error để tránh crash
          setProgressList([]);
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
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
                    <PlusIcon className="w-4 h-4" />
                    Add Entry
                </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 mb-8">
                <span className="text-sm font-medium text-gray-600">Filter by group:</span>
                <div className="relative">
                    <select value={selectedGroupFilter} onChange={(e) => setSelectedGroupFilter(e.target.value)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 pr-8 rounded-lg transition-colors appearance-none cursor-pointer outline-none">
                        <option value="all">All groups</option>
                        {groups.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
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
                        const groupInfo = groups.find(g => g.id === item.group_id);
                        const groupName = groupInfo ? groupInfo.name : `Group #${item.group_id}`;
                        const totalStudents = groupInfo ? groupInfo.members.length : '?'; 
                        const presentStudents = item.attendance ? item.attendance.length : 0;

                        return (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                                    <div className="mb-2 md:mb-0">
                                        <div className="text-sm font-bold text-gray-900 mb-1">{groupName}</div>
                                        <div className="text-sm font-medium text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500 font-medium">Understanding:</span>
                                        <RatingDots rating={mapLevelToScore(item.progress_level)} />
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{item.progress_level}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Topics Covered</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {item.topics_covered && item.topics_covered.length > 0 ? (
                                                item.topics_covered.map((topic, idx) => (
                                                    <span key={idx} className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200">{topic}</span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">No topics recorded</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-1">
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Remarks</h4>
                                        <p className="text-gray-900 font-medium text-sm leading-relaxed">{item.notes || "No remarks."}</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Attendance</h4>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold text-gray-900">{presentStudents}</span>
                                            <span className="text-sm text-gray-500">/ {totalStudents} students</span>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-400">Present IDs: {item.attendance.join(", ")}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
      <RecordProgressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} groups={groups} onSuccess={fetchData} currentTutorId={currentTutorId} />
    </div>
  );
}
