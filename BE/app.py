from flask import Flask, jsonify, request, make_response #request la body 
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import data_manager
import recommender

app = Flask(__name__)
CORS(app, supports_credentials=True,  origins=["http://localhost:5173", "http://127.0.0.1:5173" ])

SECRET_KEY = "supersecret!"


def create_token(user_id):
    payload = {
        "id": user_id,
        "exp": datetime.now() + timedelta(hours=1)  # expires in 1 hour
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    
def get_current_user_from_request():
    """Helper function to get current user from cookie"""
    session_id = request.cookies.get('session_id')
    if not session_id:
        return None
    
    userid = decode_token(session_id)
    if not userid:
        return None
    
    return data_manager.get_user_by_id(userid)
# ================== 1. AUTHENTICATION (UC-X1) ==================
# Mô phỏng HCMUT_SSO và phân quyền
@app.route("/login", methods=["POST"])
#@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    user = data_manager.check_login(data.get("username"), data.get("password"))
    if user:
        resp = make_response({"message": "Login success", "user": user})
        token = create_token(user["id"])
        resp.set_cookie(
            "session_id",
            token,
            httponly=True,      
            samesite='Lax',     # Cho phép gửi cookie trong cùng domain (localhost)
            secure=False,     
            path='/'            # Cookie có hiệu lực toàn trang
        )
        return resp, 200

    return jsonify({"error": "Sai tài khoản hoặc mật khẩu"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"message": "Logout success"}))
    # Xóa cookie
    resp.set_cookie('session_id', '', expires=0, httponly=True, samesite='Lax', secure=False)
    return resp

@app.route("/me", methods=["GET"])
def get_current_user():
    user = get_current_user_from_request()
    if user:
        return jsonify({"user": user})
    
    return jsonify({"error": "Unauthorized", "user": None}), 401

# ================== 2. STUDENT - GROUP (UC-S2) ==================
#Lay danh sach cac group
@app.route("/groups", methods=["GET"])
def get_groups():
    topic = request.args.get('topic')
    has_tutor = request.args.get('has_tutor')
    
    filters = {}
    if topic:
        filters['topic'] = topic
    if has_tutor is not None:
        filters['has_tutor'] = has_tutor.lower() == 'true'

    groups = data_manager.get_groups(filters if filters else None)

    # lấy tên Leader
    for group in groups:
        leader_id = group.get('leader_id')
        if leader_id:
            leader = data_manager.get_user_by_id(leader_id)
            group['leader_name'] = leader['name'] if leader else "Unknown"
        else:
            group['leader_name'] = "Unknown"
    return jsonify(groups)

#Tao nhom
@app.route("/groups", methods=["POST"])
def create_group(): # can truyen vao request: name, topic, capacity, leader_id
    data = request.get_json()
    
    if not data.get('name') or not data.get('leader_id'):
        return jsonify({"error": "Thiếu thông tin"}), 400
        
    new_group = data_manager.create_group(data)
    return jsonify({"message": "Tạo nhóm thành công", "group": new_group}), 201

@app.route("/groups/<int:group_id>", methods=["GET"]) #Nhan vao thi no ra thong tin chi tiet cua nhom
def get_group(group_id):
    group = data_manager.get_group_by_id(group_id)
    if group:
        return jsonify(group)
    return jsonify({"error": "Không tìm thấy nhóm"}), 404

@app.route("/groups/<int:group_id>/join", methods=["POST"])
def join_group(group_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    success, message = data_manager.join_group(group_id, user['id'])
    if success:
        return jsonify({"message": message})
    return jsonify({"error": message}), 400

@app.route("/groups/<int:group_id>/leave", methods=["POST"])
def leave_group(group_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    success, message = data_manager.leave_group(group_id, user['id'])
    if success:
        return jsonify({"message": message})
    return jsonify({"error": message}), 400

@app.route("/my-groups", methods=["GET"])
def get_my_groups():
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    groups = data_manager.get_user_groups(user['id'])
    return jsonify(groups)

# ================== 3. TUTOR - SCHEDULE (UC-T1.1) ==================
@app.route("/tutors/<int:tutor_id>", methods=["GET"])
def get_tutor(tutor_id):
    tutor = data_manager.get_tutor_by_id(tutor_id)
    if tutor:
        return jsonify(tutor)
    return jsonify({"error": "Không tìm thấy gia sư"}), 404

@app.route("/tutors", methods=["GET"])
def get_tutors():
    skill = request.args.get('skill')
    available = request.args.get('available')
    
    filters = {}
    if skill:
        filters['skill'] = skill
    if available is not None:
        filters['available'] = available.lower() == 'true'
    
    tutors = data_manager.get_tutors(filters if filters else None)
    return jsonify(tutors)

#Tao lich
@app.route("/schedules", methods=["POST"])
def create_schedule():
    data = request.get_json()
    # data cần: tutor_id, group_id, time, link, 
    if not data.get('tutor_id') or not data.get('group_id'):
        return jsonify({"error": "Thiếu thông tin"}), 400
        
    new_schedule = data_manager.add_schedule(data)
    return jsonify({"message": "Tạo lịch thành công", "schedule": new_schedule}), 201

#Nhom tao request den tutor
@app.route("/groups/<int:group_id>/request-tutor", methods=["POST"])
def request_tutor(group_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    tutor_id = data.get('tutor_id')
    message = data.get('message', '')
    
    if not tutor_id:
        return jsonify({"error": "Thiếu tutor_id"}), 400
    
    # Check if user is group leader
    group = data_manager.get_group_by_id(group_id)
    if not group:
        return jsonify({"error": "Không tìm thấy nhóm"}), 404
    
    if group['leader_id'] != user['id']:
        return jsonify({"error": "Chỉ nhóm trưởng mới có thể request tutor"}), 403
    
    new_request, msg = data_manager.create_request(group_id, tutor_id, user['id'], message)
    
    if new_request:
        return jsonify({"message": msg, "request": new_request}), 201
    return jsonify({"error": msg}), 400

@app.route("/tutor/requests", methods=["GET"])
def get_tutor_requests():
    user = get_current_user_from_request()
    if not user or user.get('role') != 'Tutor':
        return jsonify({"error": "Unauthorized"}), 401
    
    status = request.args.get('status')  # pending, accepted, rejected
    requests = data_manager.get_tutor_requests(user['id'], status)
    
    # Enrich with group info
    for req in requests:
        req['group'] = data_manager.get_group_by_id(req['group_id'])
        req['student'] = data_manager.get_user_by_id(req['student_id'])
    
    return jsonify(requests)

@app.route("/tutor/requests/<int:request_id>", methods=["PUT"])
def handle_request(request_id):
    user = get_current_user_from_request()
    if not user or user.get('role') != 'Tutor':
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    action = data.get('action')  # accept or rejec
    
    if action not in ['accept', 'reject']:
        return jsonify({"error": "Action phải là 'accept' hoặc 'reject'"}), 400
    
    success, message = data_manager.handle_request(request_id, action)
    
    if success:
        return jsonify({"message": message})
    return jsonify({"error": message}), 400

# 3. Get my classes (accepted groups)
@app.route("/tutor/classes", methods=["GET"])
def get_tutor_classes():
    user = get_current_user_from_request()
    if not user or user.get('role') != 'Tutor':
        return jsonify({"error": "Unauthorized"}), 401

    classes = data_manager.get_tutor_classes(user['id']) 
    return jsonify(classes)

@app.route("/groups/<int:group_id>/schedules", methods=["GET"])
def get_group_schedules(group_id):
    schedules = data_manager.get_schedules(group_id)
    return jsonify(schedules)

# 5. Update/Delete schedule
@app.route("/schedules/<int:schedule_id>", methods=["PUT"])
def update_schedule(schedule_id):
    user = get_current_user_from_request()
    if not user or user.get('role') != 'Tutor':
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    ok, updated = data_manager.update_schedule(schedule_id, data)
    if not ok:
        return jsonify({"error": "Không tìm thấy lịch"}), 404

    return jsonify({
        "message": "Cập nhật lịch thành công",
        "schedule": updated
    })

@app.route("/schedules/<int:schedule_id>", methods=["DELETE"])
def delete_schedule(schedule_id):
    user = get_current_user_from_request()
    if not user or user.get('role') != 'Tutor':
        return jsonify({"error": "Unauthorized"}), 401

    ok = data_manager.delete_schedule(schedule_id)
    if not ok:
        return jsonify({"error": "Không tìm thấy lịch"}), 404

    return jsonify({"message": "Xoá lịch thành công"})

@app.route("/tutors/<int:tutor_id>/feedbacks", methods=["GET"])
def get_tutor_feedbacks(tutor_id):
    feedbacks = data_manager.get_feedback_by_tutor(tutor_id)
    return jsonify(feedbacks)

@app.route("/tutors/<int:tutor_id>/schedules", methods=["GET"])
def get_tutor_schedules_api(tutor_id):
    schedules = data_manager.get_schedules_by_tutor(tutor_id)
    return jsonify(schedules)

@app.route("/groups/<int:group_id>/recommend-tutors", methods=["GET"])
def recommend_tutors_for_group(group_id):
    # 1. Lấy thông tin nhóm hiện tại
    group = data_manager.get_group_by_id(group_id)
    if not group:
        return jsonify({"error": "Không tìm thấy nhóm"}), 404
        
    # 2. Lấy danh sách tất cả gia sư đang rảnh 
    all_tutors = data_manager.get_tutors(filters={'available': True})
    
    if not all_tutors:
        return jsonify([])

    # 3. Gọi AI 
    try:
        recommended_list = recommender.get_recommendations(group, all_tutors)
        return jsonify(recommended_list)
    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({"error": "Lỗi khi xử lý gợi ý"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
