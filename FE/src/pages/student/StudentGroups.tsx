import React, { useState, useEffect } from 'react';

interface Group {
  id: number;
  name: string;
  tag: string;
  description: string;
  leaderName: string;
  memberCount: number;
  isLeader: boolean;
  joined: boolean;
}

interface ConfirmModalState {
  isOpen: boolean;
  group: Group | null;
}

const API_URL = 'http://localhost:5000';

export default function StudentGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', topic: '', description: '' });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false, group: null });

  useEffect(() => {
    const initData = async () => {
      try {
        const meRes = await fetch(`${API_URL}/me`, { credentials: 'include' });
        if (!meRes.ok) {
            console.error("Chưa đăng nhập");
            return; 
        }
        const meData = await meRes.json();
        const user = meData.user;
        setCurrentUser(user);

        fetchGroups(user); 

      } catch (error) {
        console.error("Lỗi kết nối backend:", error);
      }
    };

    initData();
  }, []);

  const fetchGroups = async (user: any) => {
    try {
      const res = await fetch(`${API_URL}/groups`);
      const data = await res.json(); 

      const mappedGroups: Group[] = data.map((g: any) => ({
        id: g.id,
        name: g.name,
        tag: g.topic, 
        description: g.description,
        leaderName: `Leader ID: ${g.leader_id}`, 
        memberCount: g.members.length,
        isLeader: g.leader_id === user.id, 
        joined: g.members.includes(user.id) 
      }));

      setGroups(mappedGroups);
    } catch (error) {
      console.error("Lỗi lấy danh sách nhóm:", error);
    }
  };


  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleJoinGroup = async (groupId: number) => {
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/join`, {
        method: 'POST',
        credentials: 'include', 
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchGroups(currentUser); 
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Lỗi join group:", error);
    }
  };

  const requestLeaveGroup = (group: Group) => {
    setConfirmModal({ isOpen: true, group: group });
  };

  const processLeaveGroup = async () => {
    const targetGroup = confirmModal.group;
    if (!targetGroup) return;

    try {
      const res = await fetch(`${API_URL}/groups/${targetGroup.id}/leave`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchGroups(currentUser); 
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Lỗi leave group:", error);
    }
    
    setConfirmModal({ isOpen: false, group: null });
  };

  const handleCreateGroup = async () => {
    if (!formData.name || !formData.topic) return;

    try {
      const payload = {
        name: formData.name,
        topic: formData.topic,
        description: formData.description,
        leader_id: currentUser.id 
      };

      const res = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      
      if (res.ok) {
        alert("Tạo nhóm thành công!");
        toggleModal();
        fetchGroups(currentUser); 
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi tạo nhóm");
      }

    } catch (error) {
      console.error("Lỗi tạo nhóm:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) setFormData({ name: '', topic: '', description: '' });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={styles.container}>
      
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <div>
            <div style={styles.contentBox}>
              <h1 style={styles.pageTitle}>Groups</h1>
              <p style={styles.subTitle}>Find and join Study groups</p>
            </div>
          </div>
          <button style={styles.createButton} onClick={toggleModal}>+ Create Group</button>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search group name..." 
            style={styles.searchInput} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div style={styles.gridContainer}>
          {filteredGroups.length === 0 && (
            <p style={{color: '#6b7280', gridColumn: '1 / -1', textAlign: 'center'}}>
              No groups found matching {searchTerm}
            </p>
          )}

          {filteredGroups.map((group) => (
            <div key={group.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.titleRow}>
                  <h3 style={styles.groupName}>{group.name}</h3>
                  {group.isLeader && <span style={styles.badgeLeader}>Leader</span>}
                </div>
                <span style={styles.tag}>{group.tag}</span>
              </div>

              <p style={styles.description}>{group.description}</p>

              <div style={styles.metaInfo}>
                <div style={styles.metaItem}>👤 {group.leaderName}</div>
                <div style={styles.metaItem}>👥 {group.memberCount} members</div>
              </div>

              <div style={{ flexGrow: 1 }}></div>

              {group.joined ? (
                <button style={styles.btnLeave} onClick={() => requestLeaveGroup(group)}>Leave</button>
              ) : (
                <button style={styles.btnJoin} onClick={() => handleJoinGroup(group.id)}>Join</button>
              )}
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create Group</h2>
              <span style={styles.closeIcon} onClick={toggleModal}>✕</span>
            </div>
            <p style={styles.modalSubTitle}>Create a new study group</p>
            <div style={styles.formGroup}><label style={styles.label}>Name*</label><input style={styles.input} name="name" value={formData.name} onChange={handleInputChange}/></div>
            <div style={styles.formGroup}><label style={styles.label}>Topic*</label><input style={styles.input} name="topic" value={formData.topic} onChange={handleInputChange}/></div>
            <div style={styles.formGroup}><label style={styles.label}>Desc*</label><textarea style={styles.textarea} name="description" value={formData.description} onChange={handleInputChange}/></div>
            <div style={styles.modalFooter}>
              <button style={styles.btnCancel} onClick={toggleModal}>Cancel</button>
              <button style={styles.btnCreate} onClick={handleCreateGroup}>Create</button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalBox, width: "400px"}}> 
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Confirm Leave</h2>
              <span style={styles.closeIcon} onClick={() => setConfirmModal({isOpen: false, group: null})}>✕</span>
            </div>
            
            <p style={{ margin: "20px 0", color: "#374151" }}>
              Are you sure you want to leave <strong>{confirmModal.group?.name}</strong>?
              {confirmModal.group && confirmModal.group.memberCount <= 1 && (
                <div style={{color: "red", marginTop: "10px", fontSize: "13px"}}>
                  * Warning: Since you are the only member, this group will be deleted.
                </div>
              )}
            </p>

            <div style={styles.modalFooter}>
              <button style={styles.btnCancel} onClick={() => setConfirmModal({isOpen: false, group: null})}>Cancel</button>
              <button style={{...styles.btnCreate, backgroundColor: "#ef4444"}} onClick={processLeaveGroup}>Yes, Leave</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", padding: 0, margin: 0, boxSizing: "border-box" as const, backgroundColor: "#eff2f5ff", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" as const },
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" },
  contentBox: { backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "30px", borderRadius: "12px", backdropFilter: "blur(4px)", maxWidth: "300px", width: "100%", border: "1px solid rgba(255, 255, 255, 0.2)" },
  breadCrumb: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", fontSize: "14px", color: "#f2f4f7ff" },
  badgeStudent: { backgroundColor: "#111827", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  pageTitle: { fontSize: "56px", fontWeight: "800", margin: "0", lineHeight: "1.2", color: "#eff0f3ff" },
  subTitle: { color: "#e3e7ecff", margin: "5px 0 0 0", fontSize: "16px" },
  createButton: { backgroundColor: "#0f172a", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", marginTop: "20px" },
  searchContainer: { position: "relative" as const, marginBottom: "40px", width: "100%" },
  searchIcon: { position: "absolute" as const, left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "18px" },
  searchInput: { width: "100%", padding: "12px 12px 12px 45px", borderRadius: "6px", border: "none", backgroundColor: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" as const, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "black" },
  gridContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  card: { border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "white", display: "flex", flexDirection: "column" as const, minHeight: "250px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "#0f172a" },
  cardHeader: { marginBottom: "15px" },
  titleRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" },
  groupName: { margin: 0, fontSize: "18px", fontWeight: "600" },
  badgeLeader: { backgroundColor: "#e5e7eb", color: "#374151", fontSize: "12px", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" },
  tag: { display: "inline-block", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", color: "#374151", marginTop: "5px" },
  description: { color: "#6b7280", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" },
  metaInfo: { display: "flex", gap: "20px", marginBottom: "25px", color: "#6b7280", fontSize: "14px" },
  metaItem: { display: "flex", alignItems: "center" },
  btnLeave: { width: "100%", padding: "10px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#374151", transition: "background 0.2s" },
  btnJoin: { width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "white", transition: "opacity 0.2s" },
  
  modalOverlay: { position: "fixed" as const, top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalBox: { backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "500px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontFamily: "'Segoe UI', sans-serif" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  modalTitle: { fontSize: "24px", fontWeight: "bold", margin: 0, color: "#1f2937" },
  closeIcon: { cursor: "pointer", fontSize: "20px", color: "#6b7280" },
  modalSubTitle: { color: "#6b7280", marginTop: 0, marginBottom: "20px", fontSize: "14px" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#1f2937" },
  input: { width: "100%", padding: "12px", backgroundColor: "#f3f4f6", border: "1px solid transparent", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, color: "#111827" },
  textarea: { width: "100%", padding: "12px", backgroundColor: "#f3f4f6", border: "1px solid transparent", borderRadius: "8px", fontSize: "14px", outline: "none", minHeight: "100px", resize: "vertical" as const, boxSizing: "border-box" as const, fontFamily: "inherit", color: "#111827" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "30px" },
  btnCancel: { padding: "10px 20px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", fontWeight: "600", color: "#374151" },
  btnCreate: { padding: "10px 24px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }
};
