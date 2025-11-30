import React, { useState, useEffect } from 'react'


interface TutorItem {
  id: number;
  name: string;
  rating: number;
  skills: string[];
  location: string;
  mode: string;
  bio?: string;
}

interface ScheduleItem {
  id: number;
  title: string;
  time: string;     
  duration: number; 
  type: string;     
}


interface FeedbackItem {
  id: number;
  schedule_id: number;
  student_id: number;
  student_name?: string; 
  tutor_id: number;
  rating: number;
  comment: string;
  created_at: string;
}


interface MyGroupItem {
  id: number;
  name: string;
  topic: string;
  memberCount: number;
}

const API_URL = 'http://localhost:5000';
const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function StudentTutors() {
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroupItem[]>([]);
  
  const [tutorReviews, setTutorReviews] = useState<FeedbackItem[]>([]);
  const [tutorSchedules, setTutorSchedules] = useState<ScheduleItem[]>([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedTutor, setSelectedTutor] = useState<TutorItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'reviews'>('overview');
  const [requestTutor, setRequestTutor] = useState<TutorItem | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const tutorRes = await fetch(`${API_URL}/tutors`);
        const tutorData = await tutorRes.json();
        
        const mappedTutors = tutorData.map((t: any) => ({
          id: t.id,
          name: t.name,
          rating: t.rating || 0,
          skills: t.skills || [],
          bio: t.bio || "Chưa có thông tin giới thiệu.",
          location: "HCMUT - Ly Thuong Kiet Campus", 
          mode: t.available ? "Online & Offline" : "Busy" 
        }));
        setTutors(mappedTutors);

        const groupsRes = await fetch(`${API_URL}/my-groups`, { credentials: 'include' });
        if (groupsRes.ok) {
            const groupsData = await groupsRes.json();
            const mappedGroups = groupsData.map((g: any) => ({
                id: g.id,
                name: g.name,
                topic: g.topic,
                memberCount: g.members ? g.members.length : 0
            }));
            setMyGroups(mappedGroups);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    const matchesName = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filterType === 'Online') matchesFilter = tutor.mode.includes('Online');
    else if (filterType === 'Offline') matchesFilter = tutor.mode.includes('Offline');
    return matchesName && matchesFilter;
  });


  const handleViewDetails = async (tutor: TutorItem) => {
    setSelectedTutor(tutor);
    setActiveTab('overview');
    
    setTutorReviews([]);
    setTutorSchedules([]);

    try {
        const schRes = await fetch(`${API_URL}/tutors/${tutor.id}/schedules`);
        if (schRes.ok) setTutorSchedules(await schRes.json());

        const fbRes = await fetch(`${API_URL}/tutors/${tutor.id}/feedbacks`);
        if (fbRes.ok) setTutorReviews(await fbRes.json());

    } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
    }
  };

  const closeDetailsModal = () => setSelectedTutor(null);

  const handleOpenRequestModal = (tutor: TutorItem) => {
    if (myGroups.length === 0) {
        alert("Bạn chưa có nhóm nào. Vui lòng tạo nhóm trước khi gửi yêu cầu.");
        return;
    }
    setRequestTutor(tutor);
    if (selectedTutor) closeDetailsModal();
  };

  const closeRequestModal = () => setRequestTutor(null);

  const handleConfirmRequest = async (group: MyGroupItem) => {
    if (!requestTutor) return;
    try {
        const res = await fetch(`${API_URL}/groups/${group.id}/request-tutor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tutor_id: requestTutor.id,
                message: "Em muốn mời thầy/cô hướng dẫn nhóm này ạ." 
            }),
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Thành công: ${data.message}`);
            closeRequestModal();
        } else {
            alert(`Lỗi: ${data.error}`);
        }
    } catch (e) { console.error(e); alert("Lỗi kết nối server."); }
  };

  const handleRecommendTutor = () => alert("Tính năng đang phát triển");

  const renderStars = (rating: number) => (
    <span style={{color: '#fbbf24', fontSize: '14px'}}>
        {"★".repeat(Math.round(rating))}
        <span style={{color: '#d1d5db'}}>{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' }); // Thứ 2, 28/11
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return { day, time };
  };

  return (
    <div style={styles.container}>


      <main style={styles.mainContent}>
        
        <div style={styles.headerSection}>
          <div style={styles.contentBox}>
            <h1 style={styles.pageTitle}>Search Tutors</h1>
            <p style={styles.subTitle}>Fast search ≤2s with 1000 tutors</p>
          </div>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input type="text" placeholder="Search tutor name..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        <div style={styles.filterRow}>
            <div style={styles.dropdownContainer}>
                <select style={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                </select>
            </div>
            <button style={styles.btnRecommend} onClick={handleRecommendTutor}>
                <span style={{marginRight: '5px'}}>⭐</span> Recommended Tutor
            </button>
        </div>

        <div style={styles.gridContainer}>
            {filteredTutors.length === 0 && (
                <p style={{gridColumn: '1 / -1', color: '#6b7280', textAlign: 'center'}}>No tutors found.</p>
            )}

            {filteredTutors.map((tutor) => (
                <div key={tutor.id} style={styles.card}>
                    <div style={styles.cardTop}>
                        <img src={DEFAULT_AVATAR} alt="avatar" style={{width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover'}} />
                        <h3 style={styles.tutorName}>{tutor.name}</h3>
                        <div style={styles.ratingBadge}><span style={{color: '#fbbf24', marginRight: '4px'}}>★</span>{tutor.rating}</div>
                    </div>

                    <div style={styles.skillsContainer}>
                        {tutor.skills.slice(0,3).map((skill, index) => (
                            <span key={index} style={styles.skillTag}>{skill}</span>
                        ))}
                    </div>

                    <div style={styles.infoRow}><span style={styles.infoIcon}>📍</span><span style={styles.infoText}>{tutor.location}</span></div>
                    <div style={styles.infoRow}><span style={styles.infoIcon}>🎥</span><span style={styles.infoText}>{tutor.mode}</span></div>
                    <div style={{flexGrow: 1, minHeight: '20px'}}></div>

                    <div style={styles.actionRow}>
                        <button style={styles.btnView} onClick={() => handleViewDetails(tutor)}>View Details</button>
                        <button style={styles.btnRequest} onClick={() => handleOpenRequestModal(tutor)}>Request Tutor</button>
                    </div>
                </div>
            ))}
        </div>
      </main>

      {selectedTutor && (
        <div style={styles.modalOverlay}>
          <div style={styles.detailModalBox}>
             <span style={styles.closeIcon} onClick={closeDetailsModal}>✕</span>
             
             <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
                <img src={DEFAULT_AVATAR} alt="avatar" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}} />
                <div>
                    <h2 style={{margin: '0 0 5px 0', fontSize: '24px', color: '#111827'}}>{selectedTutor.name}</h2>
                    <div style={styles.ratingBadge}><span style={{color: '#fbbf24', marginRight: '4px'}}>★</span>{selectedTutor.rating}</div>
                </div>
             </div>

             <div style={styles.tabContainer}>
                <div style={activeTab === 'overview' ? styles.tabActive : styles.tabInactive} onClick={() => setActiveTab('overview')}>Tổng quan</div>
                <div style={activeTab === 'schedule' ? styles.tabActive : styles.tabInactive} onClick={() => setActiveTab('schedule')}>Lịch dạy</div>
                <div style={activeTab === 'reviews' ? styles.tabActive : styles.tabInactive} onClick={() => setActiveTab('reviews')}>Đánh giá</div>
             </div>

             <div style={styles.modalContentArea}>
                 
                 {activeTab === 'overview' && (
                   <>
                     <h4 style={styles.sectionTitle}>Kỹ năng</h4>
                     <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px'}}>
                       {selectedTutor.skills.map((skill, idx) => (
                         <span key={idx} style={styles.skillTagDark}>{skill}</span>
                       ))}
                     </div>
                     <h4 style={styles.sectionTitle}>Giới thiệu</h4>
                     <p style={{color: '#6b7280', lineHeight: '1.5'}}>{selectedTutor.bio}</p>
                   </>
                 )}

                 {activeTab === 'schedule' && (
                   <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                     {tutorSchedules.length > 0 ? (
                       tutorSchedules.map((item) => {
                         const dt = formatDateTime(item.time);
                         return (
                           <div key={item.id} style={styles.scheduleItem}>
                             <span style={{fontWeight: 'bold', marginRight: '10px'}}>📅 {dt.day}</span>
                             <span>🕒 {dt.time} ({item.duration} mins)</span>
                             <div style={{fontSize: '12px', color: '#666', marginLeft: '10px'}}> - {item.title}</div>
                           </div>
                         )
                       })
                     ) : (
                       <p style={{color: '#6b7280', fontStyle: 'italic', textAlign: 'center'}}>Chưa có lịch dạy nào.</p>
                     )}
                   </div>
                 )}

                 {activeTab === 'reviews' && (
                   <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                     {tutorReviews.length > 0 ? (
                       tutorReviews.map((review) => (
                         <div key={review.id} style={styles.reviewCard}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                <span style={{fontWeight: '600', fontSize: '14px', color: '#1f2937'}}>
                                    {review.student_name || `Student #${review.student_id}`}
                                </span>
                                <span style={{fontSize: '12px', color: '#9ca3af'}}>
                                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div style={{marginBottom: '5px'}}>
                                {renderStars(review.rating)}
                            </div>
                            <p style={{margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.4'}}>
                                "{review.comment}"
                            </p>
                         </div>
                       ))
                     ) : (
                       <div style={{textAlign: 'center', padding: '30px', color: '#6b7280'}}>
                         Chưa có đánh giá nào.
                       </div>
                     )}
                   </div>
                 )}
             </div>

             <div style={styles.modalFooter}>
                 <button style={styles.btnOutline} onClick={closeDetailsModal}>Đóng</button>
                 <button style={styles.btnRequestModal} onClick={() => handleOpenRequestModal(selectedTutor)}>Yêu cầu gia sư</button>
             </div>
          </div>
        </div>
      )}

      {requestTutor && (
        <div style={styles.modalOverlay}>
            <div style={{...styles.modalBox, width: '500px'}}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>Yêu cầu gia sư</h2>
                    <span style={styles.closeIcon} onClick={closeRequestModal}>✕</span>
                </div>
                <p style={styles.modalSubTitle}>Chọn nhóm để yêu cầu gia sư {requestTutor.name}</p>

                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto'}}>
                    {myGroups.map((group) => (
                        <div key={group.id} style={styles.groupSelectCard}>
                            <div>
                                <h4 style={{margin: '0 0 5px 0', fontSize: '16px', color: "black"}}>{group.name}</h4>
                                <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#6b7280'}}>{group.topic}</p>
                                <div style={{fontSize: '13px', color: '#6b7280'}}>👥 {group.memberCount} thành viên</div>
                            </div>
                            <button style={styles.btnConfirmRequest} onClick={() => handleConfirmRequest(group)}>Xác nhận</button>
                        </div>
                    ))}
                </div>
                
                 <div style={{...styles.modalFooter, marginTop: '20px'}}>
                     <button style={styles.btnOutline} onClick={closeRequestModal}>Hủy</button>
                 </div>
            </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", padding: 0, margin: 0, boxSizing: "border-box" as const, backgroundColor: "#eff2f5ff", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column" as const },
  mainContent: { padding: "40px 60px", width: "100%", boxSizing: "border-box" as const, maxWidth: "1400px", margin: "0 auto" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", height: "65px", padding: "0 40px", backgroundColor: "white", borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", width: "100%", boxSizing: "border-box" as const },
  navLeft: { display: "flex", alignItems: "center", gap: "40px" },
  logo: { height: "35px" },
  menuLinks: { display: "flex", gap: "25px" },
  link: { fontSize: "14px", fontWeight: "600", color: "#6b7280", cursor: "pointer", textTransform: "uppercase", textDecoration: "none" },
  activeLink: { color: "black" },
  navRight: { display: "flex", alignItems: "center", gap: "20px" },
  langSwitch: { display: "flex", border: "1px solid #e5e7eb", borderRadius: "4px", overflow: "hidden" },
  langItem: { padding: "4px 8px", fontSize: "12px", cursor: "pointer", color: "#00040aff" },
  langActive: { backgroundColor: "#111827", color: "white" },
  icon: { fontSize: "20px", cursor: "pointer" },
  headerSection: { marginBottom: "20px" },
  pageTitle: { fontSize: "56px", fontWeight: "800", margin: "0", lineHeight: "1.2", color: "#eef0f4ff", fontStyle: "normal" },
  subTitle: { color: "#e2e4e9ff", margin: "5px 0 0 0", fontSize: "16px" },
  breadCrumb: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", fontSize: "14px", color: "#f4f6f9ff" },
  badgeStudent: { backgroundColor: "#111827", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  contentBox: { backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "30px", borderRadius: "12px", backdropFilter: "blur(4px)", maxWidth: "600px", width: "fit-content", border: "1px solid rgba(255, 255, 255, 0.2)" },
  searchContainer: { position: "relative" as const, marginBottom: "20px", width: "100%" },
  searchIcon: { position: "absolute" as const, left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "18px" },
  searchInput: { width: "100%", padding: "12px 12px 12px 45px", borderRadius: "6px", border: "none", backgroundColor: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" as const, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "black" },
  filterRow: { display: "flex", gap: "15px", marginBottom: "30px" },
  dropdownContainer: { position: "relative" as const },
  filterSelect: { padding: "10px 30px 10px 15px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#f3f4f6", fontSize: "14px", fontWeight: "500", color: "#1f2937", cursor: "pointer", outline: "none", appearance: "none" as const, minWidth: "100px", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px" },
  btnRecommend: { padding: "10px 15px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "white", fontSize: "14px", fontWeight: "500", color: "#1f2937", cursor: "pointer", display: "flex", alignItems: "center" },
  gridContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  card: { border: "1px solid #e5e7eb", borderRadius: "12px", padding: "30px", backgroundColor: "white", display: "flex", flexDirection: "column" as const, minHeight: "280px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", alignItems: "center", textAlign: "center" as const },
  cardTop: { display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: "15px" },
  tutorName: { fontSize: "20px", fontWeight: "600", margin: "0 0 8px 0", color: "#111827" },
  ratingBadge: { display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "bold", color: "#374151" },
  skillsContainer: { display: "flex", flexWrap: "wrap" as const, gap: "8px", justifyContent: "center", marginBottom: "20px" },
  skillTag: { backgroundColor: "#f3f4f6", color: "#374151", fontSize: "12px", padding: "4px 12px", borderRadius: "16px", fontWeight: "500" },
  infoRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#6b7280", fontSize: "14px" },
  infoIcon: { fontSize: "16px" },
  infoText: { textAlign: "left" as const },
  actionRow: { display: "flex", gap: "15px", width: "100%", marginTop: "15px" },
  btnView: { flex: 1, padding: "10px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#374151", transition: "background 0.2s" },
  btnRequest: { flex: 1, padding: "10px", backgroundColor: "#0f172a", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "white", transition: "opacity 0.2s" },
  modalOverlay: { position: "fixed" as const, top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  detailModalBox: { backgroundColor: "white", borderRadius: "16px", width: "550px", maxWidth: "90%", maxHeight: "85vh", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" as const, overflow: "hidden", padding: "24px", position: "relative" as const },
  closeIcon: { cursor: "pointer", fontSize: "24px", color: "#6b7280", position: "absolute" as const, top: "20px", right: "24px", zIndex: 1 },
  tabContainer: { display: "flex", backgroundColor: "#f3f4f6", padding: "4px", borderRadius: "20px", marginBottom: "20px" },
  tabActive: { flex: 1, textAlign: "center" as const, padding: "8px", backgroundColor: "white", borderRadius: "16px", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s", color: "#111827" },
  tabInactive: { flex: 1, textAlign: "center" as const, padding: "8px", color: "#6b7280", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  modalContentArea: { flex: 1, overflowY: "auto" as const, paddingRight: "5px", marginBottom: "20px" },
  sectionTitle: { fontSize: "16px", fontWeight: "600", margin: "0 0 10px 0", color: "#111827" },
  skillTagDark: { backgroundColor: "#0f172a", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "16px", fontWeight: "500" },
  scheduleItem: { backgroundColor: "#f9fafb", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "#374151", display: "flex", alignItems: "center" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  btnOutline: { padding: "10px 20px", border: "1px solid #e5e7eb", backgroundColor: "white", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#374151" },
  btnRequestModal: { padding: "10px 20px", border: "none", backgroundColor: "#0f172a", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "white" },
  modalBox: { backgroundColor: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontFamily: "'Segoe UI', sans-serif" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  modalTitle: { fontSize: "20px", fontWeight: "bold", margin: 0, color: "#1f2937" },
  modalSubTitle: { color: "#6b7280", marginTop: 0, marginBottom: "20px", fontSize: "14px" },
  groupSelectCard: { border: "1px solid #e5e7eb", borderRadius: "12px", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  btnConfirmRequest: { padding: "8px 16px", backgroundColor: "#0f172a", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "white" },
  reviewCard: { border: "1px solid #e5e7eb", borderRadius: "12px", padding: "15px", backgroundColor: "#f9fafb" }
};
