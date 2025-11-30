

import React, { useState, useEffect } from 'react'

// --- 1. ĐỊNH NGHĨA CÁC INTERFACE ---
interface ClassItem {
  id: number;
  name: string;
  tag: string;
  tutorName: string;
  studentCount: number;
  docCount: number;
  sessionCount: number;
  status: 'Active' | 'Inactive';
  description?: string;
}


interface DocumentItem {
  id: number;
  title: string;
  uploader: string;
  date: string;
  size: string;
  type: 'pdf' | 'note';
}


interface ScheduleItem {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  repeat: string;
  mode: string;
  link: string;
}

const API_URL = 'http://localhost:5000'; 

export default function StudentClasses() {

  const [classes, setClasses] = useState<ClassItem[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  

  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'schedule'>('documents');
  

  const [classSchedules, setClassSchedules] = useState<ScheduleItem[]>([]);
  

  const mockDocuments: DocumentItem[] = [
    { id: 1, title: "Course Introduction.pdf", uploader: "System", date: "Now", size: "1.5 MB", type: 'pdf' },
    { id: 2, title: "Lecture Notes", uploader: "System", date: "Now", size: "", type: 'note' },
  ];

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const res = await fetch(`${API_URL}/my-groups`, { credentials: 'include' });
        if (!res.ok) return; 
        const groupsData = await res.json();

        const enrichedClasses = await Promise.all(groupsData.map(async (group: any) => {
          let tutorName = "Chưa có gia sư";
          let sessionCount = 0;

          if (group.tutor_id) {
            try {
              const tutorRes = await fetch(`${API_URL}/tutors/${group.tutor_id}`);
              const tutorData = await tutorRes.json();
              tutorName = tutorData.name || "Unknown Tutor";
            } catch (e) { console.error(e) }
          }

          try {
            const schedRes = await fetch(`${API_URL}/groups/${group.id}/schedules`);
            const schedData = await schedRes.json();
            sessionCount = schedData.length;
          } catch (e) { console.error(e) }

          return {
            id: group.id,
            name: group.name,
            tag: group.topic,
            tutorName: tutorName,
            studentCount: group.members ? group.members.length : 0,
            docCount: 2, 
            sessionCount: sessionCount,
            status: group.status === 'active' ? 'Active' : 'Inactive',
            description: group.description
          };
        }));

        setClasses(enrichedClasses);

      } catch (error) {
        console.error("Lỗi tải lớp học:", error);
      }
    };

    fetchMyClasses();
  }, []);

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClass = async (item: ClassItem) => {
    setSelectedClass(item);
    setActiveTab('documents');
    
    try {
      const res = await fetch(`${API_URL}/groups/${item.id}/schedules`);
      const data = await res.json();
      

      const mappedSchedules = data.map((s: any) => ({
        id: s.id,
        title: s.title,
        date: new Date(s.time).toLocaleDateString('vi-VN'), // Format ngày
        startTime: new Date(s.time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
        endTime: `${s.duration} mins`, // Backend lưu duration thay vì endTime
        repeat: "None",
        mode: s.type,
        link: s.link || "Offline"
      }));
      
      setClassSchedules(mappedSchedules);
    } catch (error) {
      console.error("Lỗi lấy lịch chi tiết:", error);
      setClassSchedules([]);
    }
  };

  const closeViewModal = () => {
    setSelectedClass(null);
  };

  const handleOpenDoc = (docTitle: string) => alert(`Opening: ${docTitle}`);
  const handleDownloadDoc = (docTitle: string) => alert(`Downloading: ${docTitle}`);

  return (
    <div style={styles.container}>
      
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <div>
            <div style={styles.contentBox}>
              <h1 style={styles.pageTitle}>My Classes</h1>
              <p style={styles.subTitle}>View documents and notes from tutors</p>
            </div>
          </div>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search class name..." 
            style={styles.searchInput} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div style={styles.gridContainer}>
          {filteredClasses.length === 0 && (
             <p style={{color: '#6b7280', gridColumn: '1 / -1', textAlign: 'center'}}>
               No classes found. Join a group to see classes here.
             </p>
          )}

          {filteredClasses.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.groupName}>{item.name}</h3>
                <span style={styles.statusBadge}>{item.status}</span>
              </div>
              <div style={{marginBottom: "20px"}}>
                 <span style={styles.tag}>{item.tag}</span>
              </div>
              <div style={styles.tutorSection}>
                <p style={styles.tutorName}>{item.tutorName}</p>
                <span style={styles.tutorLabel}>Tutor</span>
              </div>
              <div style={styles.statsRow}>
                <div style={styles.statItem}><span style={styles.statIcon}>👥</span> {item.studentCount}</div>
                <div style={styles.statItem}><span style={styles.statIcon}>📄</span> {item.docCount}</div>
                <div style={styles.statItem}><span style={styles.statIcon}>📅</span> {item.sessionCount}</div>
              </div>
              <div style={{ flexGrow: 1 }}></div>
              
              <button style={styles.btnView} onClick={() => handleViewClass(item)}>
                 <span style={{marginRight: "8px"}}>👁️</span> View Class
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedClass && (
        <div style={styles.modalOverlay}>
          <div style={styles.detailModalBox}>
            <div style={styles.detailModalHeader}>
               <h2 style={styles.modalClassTitle}>{selectedClass.name}</h2>
               <span style={styles.closeIcon} onClick={closeViewModal}>✕</span>
            </div>
            
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
                <span style={styles.modalTagBadge}>{selectedClass.tag}</span>
                <span style={styles.modalMemberBadge}>{selectedClass.studentCount} members</span>
                <span style={styles.modalMemberBadge}>GV: {selectedClass.tutorName}</span>
            </div>
            <p style={styles.modalDescription}>{selectedClass.description}</p>

            <div style={styles.tabContainer}>
                <div 
                  style={activeTab === 'documents' ? styles.tabActive : styles.tabInactive}
                  onClick={() => setActiveTab('documents')}
                >
                  📄 Documents
                </div>
                <div 
                  style={activeTab === 'schedule' ? styles.tabActive : styles.tabInactive}
                  onClick={() => setActiveTab('schedule')}
                >
                  📅 Schedule
                </div>
            </div>

            <div style={styles.modalContentArea}>
                
                {activeTab === 'documents' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {mockDocuments.map(doc => (
                      <div key={doc.id} style={styles.docCard}>
                         <div style={{...styles.docIconBox, backgroundColor: doc.type === 'pdf' ? '#dbeafe' : '#fef9c3'}}>
                            <span style={{fontSize: '24px', color: doc.type === 'pdf' ? '#2563eb' : '#ca8a04'}}>
                               {doc.type === 'pdf' ? '📄' : '📖'}
                            </span>
                         </div>
                         <div style={{flex: 1}}>
                            <h4 style={styles.docTitle}>{doc.title}</h4>
                            <p style={styles.docMeta}>Uploaded by: {doc.uploader}</p>
                            <p style={styles.docMeta}>{doc.date} {doc.size && `• ${doc.size}`}</p>
                         </div>
                         <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <button style={styles.btnOutline} onClick={() => handleOpenDoc(doc.title)}>Open</button>
                            {doc.type === 'pdf' && (
                               <button style={styles.btnPrimary} onClick={() => handleDownloadDoc(doc.title)}>Download</button>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {classSchedules.length === 0 && (
                        <p style={{color: '#666', textAlign: 'center'}}>No schedule yet.</p>
                    )}
                    {classSchedules.map(sch => (
                       <div key={sch.id} style={styles.scheduleCard}>
                          <div style={styles.scheduleRow}>
                             <div>
                                <p style={styles.schTitle}>{sch.title}</p>
                                <p style={styles.schText}>Date: {sch.date}</p>
                                <p style={styles.schText}>Time: {sch.startTime}</p>
                             </div>
                             <div>
                                <p style={styles.schText}>Duration: {sch.endTime}</p>
                             </div>
                          </div>
                          <div style={{marginTop: '10px'}}>
                             <p style={styles.schText}>Mode: {sch.mode}</p>
                             <a href={sch.link} target="_blank" rel="noreferrer" style={{fontSize: '13px', color: '#2563eb'}}>{sch.link}</a>
                          </div>
                       </div>
                    ))}
                  </div>
                )}

            </div>
             
             <div style={styles.modalFooter}>
                 <button style={styles.btnOutline} onClick={closeViewModal}>Close</button>
             </div>

          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", padding: 0, margin: 0, boxSizing: "border-box" as const, backgroundColor: "#eff2f5ff", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column" as const },
  mainContent: { padding: "40px 60px", width: "100%", boxSizing: "border-box" as const, maxWidth: "1400px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" },
  contentBox: { backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "30px", borderRadius: "12px", backdropFilter: "blur(4px)", maxWidth: "400px", width: "100%", border: "1px solid rgba(255, 255, 255, 0.2)" },
  breadCrumb: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", fontSize: "14px", color: "#f2f4f7ff" },
  badgeStudent: { backgroundColor: "#111827", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  pageTitle: { fontSize: "56px", fontWeight: "800", margin: "0", lineHeight: "1.2", color: "#eff0f3ff", fontStyle: "normal" },
  subTitle: { color: "#e3e7ecff", margin: "5px 0 0 0", fontSize: "16px" },
  searchContainer: { position: "relative" as const, marginBottom: "40px", width: "100%" },
  searchIcon: { position: "absolute" as const, left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "18px" },
  searchInput: { width: "100%", padding: "12px 12px 12px 45px", borderRadius: "6px", border: "none", backgroundColor: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" as const, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "black" },
  gridContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  card: { border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "white", display: "flex", flexDirection: "column" as const, minHeight: "260px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "#0f172a" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  groupName: { margin: 0, fontSize: "18px", fontWeight: "600" },
  statusBadge: { backgroundColor: "#0f172a", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "16px", fontWeight: "600" },
  tag: { display: "inline-block", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", color: "#374151" },
  tutorSection: { marginBottom: "20px" },
  tutorName: { fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0", color: "#1f2937" },
  tutorLabel: { fontSize: "13px", color: "#6b7280" },
  statsRow: { display: "flex", gap: "20px", marginBottom: "25px", color: "#6b7280", fontSize: "14px" },
  statItem: { display: "flex", alignItems: "center", gap: "6px" },
  statIcon: { fontSize: "16px", color: "#4b5563" },
  btnView: { width: "100%", padding: "10px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", marginTop: "auto" },
  modalOverlay: { position: "fixed" as const, top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  detailModalBox: { backgroundColor: "white", borderRadius: "16px", width: "600px", maxWidth: "90%", maxHeight: "85vh", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" as const, overflow: "hidden", padding: "24px" },
  detailModalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  modalClassTitle: { margin: 0, fontSize: "24px", fontWeight: "bold", color: "#111827" },
  closeIcon: { cursor: "pointer", fontSize: "24px", color: "#6b7280", lineHeight: 1 },
  modalTagBadge: { backgroundColor: "#0f172a", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
  modalMemberBadge: { border: "1px solid #e5e7eb", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", color: "#374151", backgroundColor: "white" },
  modalDescription: { color: "#6b7280", fontSize: "14px", marginTop: "10px", marginBottom: "20px" },
  tabContainer: { display: "flex", backgroundColor: "#f3f4f6", padding: "4px", borderRadius: "10px", marginBottom: "20px" },
  tabActive: { flex: 1, textAlign: "center" as const, padding: "8px", backgroundColor: "#030812ff", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s", color: 'white'},
  tabInactive: { flex: 1, textAlign: "center" as const, padding: "8px", color: "#6b7280", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  modalContentArea: { flex: 1, overflowY: "auto" as const, paddingRight: "5px" },
  docCard: { display: "flex", alignItems: "center", gap: "15px", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px" },
  docIconBox: { width: "48px", height: "48px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" },
  docTitle: { margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#1f2937" },
  docMeta: { margin: 0, fontSize: "12px", color: "#6b7280" },
  scheduleCard: { backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "16px" },
  scheduleRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  schTitle: { margin: "0 0 5px 0", fontSize: "14px", fontWeight: "600", color: "#1f2937" },
  schText: { margin: "0 0 5px 0", fontSize: "13px", color: "#4b5563" },
  btnOutline: { padding: "8px 16px", border: "1px solid #e5e7eb", backgroundColor: "white", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#374151" },
  btnPrimary: { padding: "8px 16px", border: "none", backgroundColor: "#0f172a", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "white" },
  modalFooter: { marginTop: "20px", display: "flex", justifyContent: "flex-end" }
};
