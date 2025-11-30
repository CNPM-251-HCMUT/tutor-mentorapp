import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; 

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); 
        } else {
          console.log("User not logged in");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={styles.container}>   
      <main style={styles.mainContent}>
        
        <div style={styles.welcomeSection}>
          <div style={styles.contentBox}>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.subTitle}>
              Welcome back, {user ? user.name : 'Student'}!
            </p>
          </div>
        </div>
    
        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{...styles.icon, color: '#2563eb'}}>👥</span>
              <h3 style={styles.cardTitle}>My Groups</h3>
            </div>
            <p style={styles.cardMeta}>Details about available groups</p>
            <div style={styles.spacer}></div>
            <button style={styles.buttonOutline}
                           onClick={() => navigate("/student/groups")}>View Details</button>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{...styles.icon, color: '#16a34a'}}>📖</span>
              <h3 style={styles.cardTitle}>Find Tutors</h3>
            </div>
            <p style={styles.cardMeta}>Find suitable tutors for your experience</p>
            <div style={styles.spacer}></div>
            <button style={styles.buttonOutline}
                           onClick={() => navigate("/student/tutors")}>Search tutors</button>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{...styles.icon, color: '#9333ea'}}>📄</span>
              <h3 style={styles.cardTitle}>View Documents</h3>
            </div>
            <p style={styles.cardMeta}>Free study materials provided by users</p>
            <div style={styles.spacer}></div>
            <button style={styles.buttonOutline}
                           onClick={() => navigate("/student/documents")}>View Details</button>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{...styles.icon, color: '#2563eb'}}>⭐</span>
              <h3 style={styles.cardTitle}>Give feedback</h3>
            </div>
            <p style={styles.cardMeta}>Rate your sessions and tutors</p>
            <div style={styles.spacer}></div>
            <button style={styles.buttonOutline}
                           onClick={() => navigate("/student/feedback")}>Details</button>
          </div>
        </div>

        <div style={styles.G_Note_Box}>
          <h3 style={styles.notifHeader}>General Notifications</h3>
          <div style={styles.notifCard}>
              <div>
                <h4 style={styles.notifTitle}>New Schedule Created</h4>
                <p style={styles.notifText}>ML Fundamentals session scheduled for Oct 21</p>
              </div>
              <div style={styles.blueDot}></div>
          </div>
        </div>

      </main>
    </div>
  );
}


const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundImage: "url(https://hcmut.edu.vn/img/carouselItem/07531069.jpg?t=07531113)",
    backgroundSize: "cover", 
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100vw",
  },
  

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "70px",
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
  },
  logo: {
    height: "40px",
  },
  nav: {
    display: "flex",
    gap: "25px",
  },
  navItem: {
    textDecoration: "none",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
  },
  navItemActive: {
    color: "black",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  langSwitch: {
    display: "flex",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
  },
  langOption: {
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#0c0116ff",
  },
  langActive: {
    backgroundColor: "#111827",
    color: "white",
  },
  iconButton: {
    position: "relative" as const,
    cursor: "pointer",
    fontSize: "20px",
  },
  redDot: {
    position: "absolute" as const,
    top: "-2px",
    right: "-2px",
    width: "8px",
    height: "8px",
    backgroundColor: "red",
    borderRadius: "50%",
    border: "1px solid white",
  },
  

  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  welcomeSection: {
    marginBottom: "40px",
  },
  contentBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "30px",                      
    borderRadius: "12px",                 
    backdropFilter: "blur(4px)",           
    width: "fit-content",                    
    border: "1px solid rgba(255, 255, 255, 0.2)", 
  },
  breadCrumb: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    color: "#f2f4f7ff",
  },
  badge: {
    backgroundColor: "#111827",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  pageTitle: {
    fontStyle: "Normal",
    fontSize: "48px",
    margin: "0 0 10px 0",
    fontWeight: "800",
    color: "#f2f4f7ff",
  },
  subTitle: {
    color: "#f2f4f7ff",
    fontStyle: "normal",
  },

  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", 
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #451d94ff",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "200px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    marginBottom: "10px",
  },
  icon: {
    fontSize: "24px",
    marginBottom: "16px",
    display: "block",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#314269ff",
  },
  cardMeta: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
    color: "#4b5563",
  },
  listItem: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  spacer: {
    flexGrow: 1, 
  },
  buttonOutline: {
    width: "100%",
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid #325baeff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    marginTop: "20px",
    color: "#325baeff",
  },


  notificationSection: {
    marginTop: "0px",
  },
  notifHeader: {
    fontSize: "18px",
    marginBottom: "20px",
    marginTop: "0px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#f2f4f7ff",
  },
  notifCard: {
    backgroundColor: "#f3f4f6",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifTitle: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#6b7280",
  },
  notifText: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },
  blueDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#2563eb",
    borderRadius: "50%",
  },
  G_Note_Box: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    padding: "20px 30px",                       
    borderRadius: "12px",                 
    backdropFilter: "blur(4px)",           
    maxWidth: "1200px",                   
    border: "1px solid rgba(255, 255, 255, 0.2)", 
  }
};

