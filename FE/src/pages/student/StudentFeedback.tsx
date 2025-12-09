import React, { useState, useEffect } from 'react';
import Logbar from './Logbar'; 
interface ClassItem {
  id: number;
  name: string;
}

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

// Interface cho state của Toast
interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const API_URL = 'http://localhost:5000';

export default function StudentFeedback() {
  const [classes, setClasses] = useState<ClassItem[]>([]); 
  const [selectedGroup, setSelectedGroup] = useState("");
  const [sessionRating, setSessionRating] = useState(0); 
  const [tutorRating, setTutorRating] = useState(0);     
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_URL}/my-groups`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const mappedClasses = data.map((g: any) => ({
            id: g.id,
            name: `${g.name} - ${g.topic}` 
          }));
          setClasses(mappedClasses);
        } else {
          console.error("Lỗi lấy danh sách nhóm (Có thể chưa đăng nhập)");
        }
      } catch (error) {
        console.error("Lỗi kết nối server:", error);
      }
    };

    fetchClasses();
  }, []);


  // --- 1. STATE MỚI CHO LOGBAR ---
    const [toast, setToast] = useState<ToastState | null>(null);
  
    // --- 2. HÀM HELPER ĐỂ HIỆN LOGBAR ---
    const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
    };

  const handleCancel = () => {
    setSelectedGroup("");
    setSessionRating(0);
    setTutorRating(0);
    setComment("");
  };

  const handleSend = () => {
    if (!selectedGroup || sessionRating === 0 || tutorRating === 0) {
      showToast("Vui lòng điền đầy đủ thông tin (Nhóm và Đánh giá sao).", 'error');
      return;
    }
    console.log("Sending Feedback:", {
        group_id: selectedGroup,
        session_rating: sessionRating,
        tutor_rating: tutorRating,
        comment: comment
    });
    showToast("Feedback sent successfully!", 'success');
    handleCancel(); 
  };

  const StarRating = ({ rating, setRating }: StarRatingProps) => {
    return (
      <div style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              ...styles.star,
              color: star <= rating ? "#fbbf24" : "#d1d5db",
            }}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        
        <div style={styles.headerSection}>
          <div style={styles.contentBox}>
            <h1 style={styles.pageTitle}>Send Feedback</h1>
            <p style={styles.subTitle}>Rate your session and tutor</p>
          </div>
        </div>


        <div style={styles.card}>
            
            <div style={styles.formGroup}>
                <label style={styles.label}>Select Group *</label>
                <div style={styles.selectWrapper}>
                    <select 
                        style={styles.selectInput} 
                        value={selectedGroup} 
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        <option value="" disabled>Select a group..</option>
                        {classes.length === 0 && <option disabled>No classes available</option>}
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Session Quality *</label>
                <StarRating rating={sessionRating} setRating={setSessionRating} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Tutor Quality *</label>
                <StarRating rating={tutorRating} setRating={setTutorRating} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Comments</label>
                <textarea 
                    style={styles.textArea} 
                    placeholder="Share more about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div style={styles.buttonGroup}>
                <button style={styles.btnSend} onClick={handleSend}>Send</button>
                <button style={styles.btnCancel} onClick={handleCancel}>Cancel</button>
            </div>

        </div>

        <div style={styles.infoBox}>
            <span style={{marginRight: '10px'}}>💡</span> 
            Your feedback is encrypted and shared with tutors anonymously.
        </div>

        <div style={styles.cardSimple}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                <span style={{fontSize: '24px', color: '#2563eb'}}>🗨️</span>
                <h3 style={styles.cardTitle}>Why Feedback Matters?</h3>
            </div>
            <ul style={styles.list}>
                <li>Helps tutors improve their teaching methods</li>
                <li>Helps other students choose suitable tutors</li>
                <li>Improves program quality</li>
            </ul>
        </div>

      </main>

      {toast && (
        <Logbar 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", padding: 0, margin: 0, boxSizing: "border-box" as const, backgroundColor: "#eff2f5ff", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column" as const },
  mainContent: { padding: "40px 60px", width: "100%", boxSizing: "border-box" as const, maxWidth: "1000px", margin: "0 auto" },
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
  headerSection: { marginBottom: "30px" },
  contentBox: { backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "30px", borderRadius: "12px", backdropFilter: "blur(4px)", maxWidth: "600px", width: "fit-content", border: "1px solid rgba(255, 255, 255, 0.2)" },
  breadCrumb: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", fontSize: "14px", color: "#f4f6f9ff" },
  badgeStudent: { backgroundColor: "#111827", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  pageTitle: { fontSize: "56px", fontWeight: "800", margin: "0", lineHeight: "1.2", color: "#eef0f4ff", fontStyle: "normal" },
  subTitle: { color: "#e2e4e9ff", margin: "5px 0 0 0", fontSize: "16px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "30px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "20px" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" },
  selectWrapper: { position: "relative" as const },
  selectInput: { width: "100%", padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#f3f4f6", fontSize: "14px", color: "#374151", outline: "none", cursor: "pointer" },
  starContainer: { display: "flex", gap: "5px" },
  star: { fontSize: "32px", cursor: "pointer", transition: "color 0.2s" },
  textArea: { width: "100%", padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#f3f4f6", fontSize: "14px", minHeight: "100px", resize: "vertical" as const, outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const },
  buttonGroup: { display: "flex", gap: "15px", marginTop: "10px" },
  btnSend: { flex: 4, padding: "12px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  btnCancel: { flex: 1, padding: "12px", backgroundColor: "white", border: "1px solid #e5e7eb", color: "#374151", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  infoBox: { backgroundColor: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "12px", padding: "15px 20px", color: "#1e40af", fontSize: "14px", marginBottom: "20px", display: "flex", alignItems: "center" },
  cardSimple: { backgroundColor: "white", borderRadius: "12px", padding: "30px", border: "1px solid #e5e7eb" },
  cardTitle: { margin: 0, fontSize: "18px", fontWeight: "600", color: "#1f2937" },
  list: { paddingLeft: "20px", color: "#4b5563", fontSize: "14px", lineHeight: "1.8", margin: 0 }
};
