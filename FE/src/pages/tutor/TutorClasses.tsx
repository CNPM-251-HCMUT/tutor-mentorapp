import React, { useEffect, useState } from 'react';

// Import Types & APIs
// Đảm bảo import Schedule từ api.ts
import { 
  tutorApi, 
  groupApi, 
  type Group,
  type Schedule 
} from '../services/api';

// --- Icons Components ---
const UserGroupIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const DocumentIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const CalendarIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const EyeIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);
const FolderOpenIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>);
const XIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const VideoCameraIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const MapPinIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);

// --- Interface & Data Types ---

interface StudentInfo {
    id: number | string;
    name: string;
    email: string;
}

// Mở rộng Group, sử dụng Schedule import từ api.ts
interface ClassDisplayData extends Group {
  studentsCount: number;
  sessionsCount: number;
  docsCount: number;
  fullSchedules: Schedule[]; // Sử dụng Type từ api.ts
  studentDetails: StudentInfo[];
}

// --- Component Modal Chi Tiết Lớp ---
interface ClassDetailsModalProps {
    data: ClassDisplayData;
    onClose: () => void;
}

const ClassDetailsModal: React.FC<ClassDetailsModalProps> = ({ data, onClose }) => {
    
    // Format ngày giờ
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/80">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full uppercase tracking-wide font-bold border border-green-200">
                                {data.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">Topic: <span className="text-gray-900">{data.topic}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-8 overflow-y-auto">
                    
                    {/* 1. Statistics Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{data.studentsCount}</span>
                            <span className="text-xs text-blue-600 font-medium uppercase tracking-wide mt-1">Students</span>
                        </div>
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{data.sessionsCount}</span>
                            <span className="text-xs text-purple-600 font-medium uppercase tracking-wide mt-1">Schedules</span>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{data.docsCount}</span>
                            <span className="text-xs text-orange-600 font-medium uppercase tracking-wide mt-1">Documents</span>
                        </div>
                    </div>

                    {/* 2. Class Members Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Class Members <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{data.studentsCount}</span>
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                            {data.studentDetails.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {data.studentDetails.map((student, index) => (
                                        <li key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{student.email}</p>
                                                </div>
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Student</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-6 text-center text-gray-400 text-sm italic">No students joined yet.</div>
                            )}
                        </div>
                    </div>

                    {/* 3. Schedules Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Upcoming Schedule
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {data.fullSchedules.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {data.fullSchedules.map((sch) => {
                                        const { day, time } = formatDate(sch.time);
                                        // Sử dụng optional chaining (?.) để an toàn
                                        const isOffline = sch.type?.toLowerCase() === 'offline';

                                        return (
                                            <li key={sch.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        {/* XỬ LÝ NẾU TITLE BỊ UNDEFINED */}
                                                        <span className="text-sm font-bold text-gray-900 block">
                                                            {sch.title || "Untitled Session"} 
                                                        </span>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                            <CalendarIcon className="w-3.5 h-3.5" />
                                                            <span>{day}, {time}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{sch.duration} mins</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Badge Status */}
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                                        isOffline 
                                                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                                    }`}>
                                                        {sch.type || 'Online'}
                                                    </span>
                                                </div>
                                                
                                                {/* Hiển thị chi tiết theo Type */}
                                                <div className="mt-3">
                                                    {isOffline ? (
                                                        <div className="inline-flex items-center gap-1.5 text-xs text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded">
                                                            <MapPinIcon className="w-3.5 h-3.5 text-gray-500" />
                                                            <span>
                                                                {sch.room || 'Room TBD'} 
                                                                {sch.building ? ` - ${sch.building}` : ''}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        sch.link ? (
                                                            <a href={sch.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                                <VideoCameraIcon className="w-3.5 h-3.5" />
                                                                Join Google Meet
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No meeting link yet</span>
                                                        )
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm italic border-dashed border-2 border-gray-100 m-2 rounded-lg">
                                    No schedules set for this class.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Component Thẻ Lớp ---
const ClassCard = ({ data, onClick }: { data: ClassDisplayData; onClick: (data: ClassDisplayData) => void }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between h-full group">
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-[17px] font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors" title={data.name}>
                {data.name}
            </h3>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'
            }`}>
            {data.status}
            </span>
        </div>
        <div className="mb-6">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200 font-medium">
            {data.topic}
            </span>
        </div>
        <div className="flex items-center gap-6 mb-6 text-gray-500 text-sm font-medium">
            <div className="flex items-center gap-1.5" title="Students">
                <UserGroupIcon className="w-5 h-5 text-gray-400" />
                <span>{data.studentsCount}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Sessions">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <span>{data.sessionsCount}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Documents">
                <DocumentIcon className="w-5 h-5 text-gray-400" />
                <span>{data.docsCount}</span>
            </div>
        </div>
      </div>
      <button 
        onClick={() => onClick(data)}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mt-auto"
      >
        <EyeIcon className="w-4 h-4" />
        View Details
      </button>
    </div>
  );
};

// --- Main Page Component ---

export default function Classes() {
  const [classes, setClasses] = useState<ClassDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassDisplayData | null>(null);

  // Hàm giả lập lấy tên sinh viên từ ID
  const mockStudentInfo = (id: number | string): StudentInfo => {
      const names = ["Nguyễn Văn An", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];
      const numId = typeof id === 'number' ? id : parseInt(id as string) || 0;
      const name = names[numId % names.length] || "Student Name";
      
      return {
          id: id,
          name: name,
          email: `student${id}@hcmut.edu.vn`
      };
  };

  useEffect(() => {
    const fetchClassesData = async () => {
      try {
        setLoading(true);
        const groups = await tutorApi.getClasses();
        const activeGroups = groups.filter((g: any) => g.status === 'active');

        const enrichedClasses = await Promise.all(
            activeGroups.map(async (group) => {
                let schedules: Schedule[] = [];
                try {
                    schedules = await groupApi.getGroupSchedules(group.id);
                } catch (e) {
                    console.error(`Failed to fetch schedule for group ${group.id}`);
                }

                const students: StudentInfo[] = group.members.map((memberId: any) => mockStudentInfo(memberId));

                return {
                    ...group,
                    studentsCount: group.members.length, 
                    sessionsCount: schedules.length,
                    docsCount: 0, 
                    fullSchedules: schedules, 
                    studentDetails: students 
                };
            })
        );

        setClasses(enrichedClasses);

      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="mb-10 text-left">
          <h1 className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            My Classes
          </h1>
          <p className="text-gray-500 italic text-[17px] font-medium">Manage your active study groups</p>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading active classes...</div>
        ) : classes.length === 0 ? (
            <div className="border border-gray-100 rounded-2xl h-[400px] flex flex-col items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="w-16 h-16 text-gray-200 mb-4"><FolderOpenIcon className="w-full h-full" /></div>
                <p className="text-gray-400 font-medium">No active classes found</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <ClassCard key={cls.id} data={cls} onClick={setSelectedClass} />
                ))}
            </div>
        )}
      </div>

      {selectedClass && <ClassDetailsModal data={selectedClass} onClose={() => setSelectedClass(null)} />}
    </div>
  );
}
