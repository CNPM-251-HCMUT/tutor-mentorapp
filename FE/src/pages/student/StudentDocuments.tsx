import React, { useState } from 'react'

interface DocumentItem {
  id: number;
  name: string;
  size: string;
  uploadedBy: string;
  type: 'PDF' | 'Note';
  updated: string;
  access: 'Group' | 'Public';
}

export default function StudentDocuments() {
  const [documents] = useState<DocumentItem[]>([
    {
      id: 1,
      name: "Introduction to Machine Learning.pdf",
      size: "2.3 MB",
      uploadedBy: "Phạm Minh Tuấn",
      type: "PDF",
      updated: "9/10/2025",
      access: "Group",
    },
    {
      id: 2,
      name: "Neural Networks Lecture Notes",
      size: "",
      uploadedBy: "", 
      type: "Note",
      updated: "10/1/2025",
      access: "Group",
    },
    {
      id: 3,
      name: "HCMUT Course Catalog 2025.pdf",
      size: "5.2 MB",
      uploadedBy: "",
      type: "PDF",
      updated: "8/15/2025",
      access: "Public",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (docName: string) => alert(`Opening: ${docName}`);
  const handleDownload = (docName: string) => alert(`Downloading: ${docName}`);

  return (
    <div style={styles.container}>
      <style>
      {`
        .btn-hover-effect {
          transition: all 0.2s ease-in-out;
        }
        .btn-hover-effect:hover {
          transform: translateY(-3px);  /* Nổi lên trên 3px */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Đổ bóng mờ phía dưới */
        }
      `}
    </style>
      <main style={styles.mainContent}>
        
        <div style={styles.headerSection}>
          <div style={styles.contentBox}>
            <h1 style={styles.pageTitle}>Documents</h1>
            <p style={styles.subTitle}>Study materials and course resources</p>
          </div>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search documents..." 
            style={styles.searchInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.tableContainer}>
            <div style={styles.tableHeaderRow}>
                <div style={{...styles.colName, paddingLeft: '10px'}}>File Name</div>
                <div style={styles.colType}>Type</div>
                <div style={styles.colUpdated}>Updated</div>
                <div style={styles.colAccess}>Access</div>
                <div style={styles.colActions}>Actions</div>
            </div>

            {filteredDocs.length === 0 && (
                <div style={{padding: '20px', textAlign: 'center', color: '#6b7280'}}>No documents found.</div>
            )}

            {filteredDocs.map((doc) => (
                <div key={doc.id} style={styles.tableRow}>
                    <div style={styles.colName}>
                        <div style={styles.fileIconWrapper}>
                            <span style={{color: '#2563eb', fontSize: '20px'}}>📄</span>
                        </div>
                        <div>
                            <div style={styles.fileName}>{doc.name}</div>
                            {(doc.uploadedBy || doc.size) && (
                                <div style={styles.fileMeta}>
                                    {doc.uploadedBy && `Uploaded by: ${doc.uploadedBy}`}
                                    {doc.uploadedBy && doc.size && ' • '}
                                    {doc.size}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={styles.colType}>
                        <span style={styles.typeBadge}>{doc.type}</span>
                    </div>
                    <div style={styles.colUpdated}>{doc.updated}</div>
                    <div style={styles.colAccess}>
                        <span style={doc.access === 'Public' ? styles.accessBadgePublic : styles.accessBadgeGroup}>
                            {doc.access}
                        </span>
                    </div>
                    <div style={styles.colActions}>
                        <button style={styles.actionBtn} className="btn-hover-effect" onClick={() => handleOpen(doc.name)}>
                            <span style={{marginRight: '5px'}}>↗</span> Open
                        </button>
                        <button style={styles.actionBtn} className="btn-hover-effect" onClick={() => handleDownload(doc.name)}>
                            <span style={{marginRight: '5px'}}>📥</span> Download
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div style={styles.infoBox}>
            <span style={{marginRight: '10px', fontSize: '18px'}}>💡</span>
            Documents integrated from HCMUT Library. Average load time &lt; 2 seconds.
        </div>

      </main>
    </div>
  );
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
  
  contentBox: { 
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    padding: "30px", 
    borderRadius: "12px", 
    backdropFilter: "blur(4px)", 
    maxWidth: "400px", 
    width: "100%", 
    border: "1px solid rgba(255, 255, 255, 0.2)" 
  },
  
  breadCrumb: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", fontSize: "14px", color: "#f4f6f9ff" },
  badgeStudent: { backgroundColor: "#111827", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  
  pageTitle: { fontSize: "56px", fontWeight: "800", margin: "0", lineHeight: "1.2", color: "#eef0f4ff", fontStyle: "normal" },
  subTitle: { color: "#e2e4e9ff", margin: "5px 0 0 0", fontSize: "16px" },
  searchContainer: { position: "relative" as const, marginBottom: "20px", width: "100%" },
  searchIcon: { position: "absolute" as const, left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "18px" },
  searchInput: { width: "100%", padding: "12px 12px 12px 45px", borderRadius: "6px", border: "none", backgroundColor: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" as const, color: "black", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  tableContainer: { border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", backgroundColor: "white", marginBottom: "30px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  tableHeaderRow: { display: "flex", padding: "15px 20px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff", fontSize: "14px", fontWeight: "600", color: "#374151" },
  tableRow: { display: "flex", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #e5e7eb", backgroundColor: "white" },
  
  colName: { flex: 2, display: "flex", alignItems: "center", gap: "15px", minWidth: "300px" },
  colType: { width: "100px", textAlign: "left" as const },
  colUpdated: { width: "150px", textAlign: "left" as const, color: "#4b5563", fontSize: "14px" },
  colAccess: { width: "120px", textAlign: "left" as const },
  colActions: { width: "220px", display: "flex", gap: "15px", justifyContent: "flex-end" },

  fileIconWrapper: { width: "40px", height: "40px", backgroundColor: "#eff6ff", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" },
  fileName: { fontSize: "15px", fontWeight: "600", color: "#1f2937", marginBottom: "2px" },
  fileMeta: { fontSize: "12px", color: "#9ca3af" },

  typeBadge: { border: "1px solid #e5e7eb", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", color: "#374151", fontWeight: "500", backgroundColor: "white" },
  accessBadgeGroup: { backgroundColor: "#f3f4f6", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", color: "#374151", fontWeight: "600" },
  accessBadgePublic: { backgroundColor: "#111827", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", color: "white", fontWeight: "600" },

  actionBtn: { display: "flex", alignItems: "center", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#1f2937" },

  infoBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #dbeafe",
    borderRadius: "8px",
    padding: "15px 20px",
    color: "#1e40af",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
  }
};

