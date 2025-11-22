from flask import Flask, jsonify, request
from flask_cors import CORS

# Nếu bạn muốn dùng DB thật, vẫn có thể giữ models.py + SQLAlchemy
# from models import db, User

app = Flask(__name__)
CORS(app)

# --- (Optional) Cấu hình DB nếu cần, còn không có thể bỏ qua ---
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db.init_app(app)
# with app.app_context():
#     db.create_all()

# ================== DỮ LIỆU DEMO (IN-MEMORY) ==================

fake_student_groups = [
    {"id": 1, "name": "DSA Group 1", "topic": "Data Structures", "members": 4, "capacity": 6},
    {"id": 2, "name": "OOP Group 2", "topic": "OOP", "members": 3, "capacity": 5},
]

fake_tutors = [
    {"id": 1, "name": "Tutor A", "specialization": "DSA", "rating": 4.8},
    {"id": 2, "name": "Tutor B", "specialization": "OOP", "rating": 4.5},
]

fake_tutor_requests = [
    {"id": 1, "groupId": 1, "groupName": "DSA Group 1", "studentName": "Nguyen Van A", "status": "Pending"},
    {"id": 2, "groupId": 2, "groupName": "OOP Group 2", "studentName": "Le Thi B", "status": "Accepted"},
]

fake_sessions = [
    {"id": 1, "groupName": "DSA Group 1", "tutorName": "Tutor A", "status": "Completed"},
    {"id": 2, "groupName": "OOP Group 2", "tutorName": "Tutor B", "status": "Scheduled"},
]

fake_config = {
    "maxGroupSize": 6,
    "maxSessionsPerWeek": 3,
    "feedbackDeadlineDays": 3,
}

# ================== ROUTES DEMO ==================

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask Backend!"})

# ---------- STUDENT ----------
@app.route("/api/student/overview", methods=["GET"])
def student_overview():
    return jsonify({
        "groups": fake_student_groups,
        "tutors": fake_tutors,
        "sessions": fake_sessions,
    })

# ---------- TUTOR ----------
@app.route("/api/tutor/overview", methods=["GET"])
def tutor_overview():
    return jsonify({
        "requests": fake_tutor_requests,
        "sessions": fake_sessions,
    })

# ---------- STAFF (REPORT) ----------
@app.route("/api/staff/overview", methods=["GET"])
def staff_overview():
    total_sessions = len(fake_sessions)
    total_groups = len(fake_student_groups)
    total_tutors = len(fake_tutors)
    total_requests = len(fake_tutor_requests)

    return jsonify({
        "totalSessions": total_sessions,
        "totalGroups": total_groups,
        "totalTutors": total_tutors,
        "totalRequests": total_requests,
    })

# ---------- ADMIN CONFIG ----------
@app.route("/api/admin/config", methods=["GET", "POST"])
def admin_config():
    global fake_config
    if request.method == "GET":
        return jsonify(fake_config)
    else:
        data = request.get_json() or {}
        for key in fake_config.keys():
            if key in data:
                fake_config[key] = data[key]
        return jsonify({"message": "Config updated", "config": fake_config})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
