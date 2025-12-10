import json
import os
from datetime import datetime
DATA_FILE = 'data.json'

def load_data():
    if not os.path.exists(DATA_FILE):
        # Khởi tạo file rỗng nếu chưa có
        return {
            "users": [],
            "groups": [],
            "schedules": [],
            "requests": [],
            "feedback": [],
            "progress": []
        }
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# --- USER & AUTH (Mô phỏng SSO & Datacore ) ---
def check_login(username, password):
    data = load_data()
    for user in data['users']:
        if user['username'] == username and user['password'] == password:
            return user
    return None

def get_user_by_id(user_id):
    data = load_data()
    for user in data['users']:
        if user['id'] == user_id:
            return user
    return None

# --- GROUP LOGIC (UC-S2) ---
def get_groups(filters=None):
    data = load_data()
    groups = data.get('groups', [])
    
    if filters:
        # Filter by topic
        if filters.get('topic'):
            groups = [g for g in groups if filters['topic'].lower() in g.get('topic', '').lower()]
        
        # Filter by has_tutor
        if filters.get('has_tutor') is not None:
            if filters['has_tutor']:
                groups = [g for g in groups if g.get('tutor_id') is not None]
            else:
                groups = [g for g in groups if g.get('tutor_id') is None]
    
    return groups

def get_group_by_id(group_id):
    data = load_data()
    for group in data.get('groups', []):
        if group['id'] == group_id:
            return group
    return None

def create_group(group_info):
    data = load_data()
    groups = data.setdefault('groups', []) 
    new_id = max((g['id'] for g in groups), default=0) + 1
    
    group_info = group_info.copy() 
    group_info['id'] = new_id
    group_info.setdefault('capacity', 5)
    group_info['members'] = [group_info['leader_id']]
    group_info['tutor_id'] = None
    group_info['status'] = 'active'
    group_info['created_at'] = datetime.now().isoformat()
    
    data.setdefault('groups', []).append(group_info)
    save_data(data)
    return group_info

def join_group(group_id, user_id):
    data = load_data()
    for group in data.get('groups', []):
        if group['id'] == group_id:
            members = group.setdefault('members', [])
            capacity = group.get('capacity', 5)

            # 1. Đã full
            if len(members) >= capacity:
                return False, "Nhóm đã đầy"

            # 2. Đã ở trong nhóm
            if user_id in members:
                return False, "Bạn đã ở trong nhóm này rồi"

            # 3. Thêm vào
            members.append(user_id)
            save_data(data)
            return True, "Tham gia thành công"

    return False, "Không tìm thấy nhóm"

def leave_group(group_id, user_id):
    data = load_data()
    for group in data.get('groups', []):
        if group['id'] == group_id:
            if user_id not in group['members']:
                return False, "Bạn không thuộc về nhóm này"
            if (len(group['members']) <= 1):
                data['groups'].remove(group)
        
            elif (group['leader_id'] == user_id):
                group['members'].remove(user_id)
                group['leader_id'] =  group['members'][0]
                
            else:
                group['members'].remove(user_id)

            save_data(data)
            return True, "Bạn đã rời nhóm thành công"
        
    return False, "Thao tác không hợp lệ"      

def get_user_groups(user_id):
    data = load_data()
    return [g for g in data['groups'] if user_id in g.get('members', [])]

def create_request(group_id, tutor_id, student_id, message):
    data = load_data()
    data.setdefault('requests', [])

    for req in data['requests']:
        if req['group_id'] == group_id and req['status'] == 'pending':
            return None, "Nhóm đã có yêu cầu đang chờ"

    new_id = max((r['id'] for r in data['requests']), default=0) + 1
    now = datetime.now().isoformat()

    # FIX: dùng dict đúng key, đồng bộ với data.json
    req = {
        "id": new_id,
        "group_id": group_id,
        "tutor_id": tutor_id,
        "student_id": student_id,
        "message": message,
        "status": "pending",
        "created_at": now,
        "updated_at": now
    }

    data['requests'].append(req)
    save_data(data)
    return req, "Gửi yêu cầu thành công"

def get_tutor_requests(tutor_id, status=None):
    data = load_data()
    requests = [r for r in data.get('requests', []) if r.get('tutor_id') == tutor_id]

    if status:
        requests = [r for r in requests if r['status'] == status]
    return requests

# --- TUTOR  ---
def get_tutors(filters):
    data = load_data()
    tutors = []
    for user in data.get('users', []):
        if user['role'].lower() == 'tutor':
            tutors.append(user)

    if filters:
        # Filter by skill
        if filters.get('skill'):
            tutors = [t for t in tutors if filters['skill'] in t.get('skills', [])]
        
        # Filter by available
        if filters.get('available') is not None:
            tutors = [t for t in tutors if t.get('available') == filters['available']]
    
    return tutors

def update_user_profile(user_id, update_data):
    data = load_data()
    users = data.get("users", [])
    
    for user in users:
        if user["id"] == user_id:
            # --- CẬP NHẬT CÁC TRƯỜNG MỚI TẠI ĐÂY ---
            if "name" in update_data:
                user["name"] = update_data["name"]
            
            if "bio" in update_data:
                user["bio"] = update_data["bio"]
            
            if "skills" in update_data:
                user["skills"] = update_data["skills"]
                
            # Thêm Expertise
            if "expertise" in update_data:
                user["expertise"] = update_data["expertise"]
                
            # Thêm Location (nếu muốn)
            if "location" in update_data:
                user["location"] = update_data["location"]
            
            save_data(data) # Lưu vào file data.json
            return user
            
    return None

def add_schedule(schedule_info):
    data = load_data()
    schedules = data.setdefault('schedules', [])

    new_id = max((s['id'] for s in schedules), default=0) + 1
    info = schedule_info.copy()
    info['id'] = new_id
    info.setdefault('status', 'scheduled')
    info.setdefault('created_at', datetime.now().isoformat())

    schedules.append(info)
    save_data(data)
    return info

def get_schedules(group_id):
    data = load_data()
    return [
        s for s in data.get('schedules', []) if s.get('group_id') == group_id
    ]

def update_schedule(schedule_id, updates):
    data = load_data()
    for s in data.get('schedules', []):
        if s['id'] == schedule_id:
            s.update(updates)
            s['updated_at'] = datetime.now().isoformat()
            save_data(data)
            return True, s
    return False, None


def delete_schedule(schedule_id):
    data = load_data()
    schedules = data.get('schedules', [])
    for s in schedules:
        if s['id'] == schedule_id:
            schedules.remove(s)
            save_data(data)
            return True
    return False

def get_schedule_by_id(schedule_id):
    data = load_data()
    for schedule in data.get('schedules', []):
        if schedule['id'] == schedule_id:
            return schedule
    return None

def get_tutor_classes(tutor_id):
    data = load_data()
    return [
        g for g in data.get('groups', [])
        if g.get('tutor_id') == tutor_id
    ]

def handle_request(request_id, action):
    data = load_data()
    requests = data.get('requests', [])
    groups = data.get('groups', [])

    for req in requests:
        if req['id'] == request_id:
            if req['status'] != 'pending':
                return False, "Yêu cầu đã được xử lý"

            if action == 'accept':
                req['status'] = 'accepted'
                # Gán tutor cho group
                for g in groups:
                    if g['id'] == req['group_id']:
                        g['tutor_id'] = req['tutor_id']
                        break
            elif action == 'reject':
                req['status'] = 'rejected'
            else:
                return False, "Action không hợp lệ"

            req['updated_at'] = datetime.now().isoformat()
            save_data(data)
            return True, "Cập nhật yêu cầu thành công"

    return False, "Không tìm thấy yêu cầu"

def get_feedback_by_tutor(tutor_id):
    data = load_data()
    
    feedbacks = [f for f in data.get('feedback', []) if f.get('tutor_id') == tutor_id]
    
    for fb in feedbacks:
        # Lấy thông tin student
        student = get_user_by_id(fb['student_id'])
        fb['student_name'] = student['name'] if student else f"Student #{fb['student_id']}"
        fb['student'] = student
        
        # Lấy thông tin schedule
        schedule_id = fb.get('schedule_id')
        if schedule_id:
            schedule = get_schedule_by_id(schedule_id)
            if schedule:
                fb['schedule'] = schedule
                # Lấy thông tin group từ schedule
                group_id = schedule.get('group_id')
                if group_id:
                    group = get_group_by_id(group_id)
                    if group:
                        fb['group'] = group
                        fb['group_name'] = group.get('name', f"Group #{group_id}")
        
    return feedbacks


def get_schedules_by_tutor(tutor_id):
    data = load_data()
    return [s for s in data.get('schedules', []) if s.get('tutor_id') == tutor_id]

# --- PROGRESS LOGIC ---
def get_all_progress():
    data = load_data()
    return data.get('progress', [])

def get_progress_by_tutor(tutor_id):
    data = load_data()
    return [p for p in data.get('progress', []) if p.get('tutor_id') == tutor_id]

def create_progress(progress_info):
    data = load_data()
    progress_list = data.setdefault('progress', [])
    
    new_id = max((p['id'] for p in progress_list), default=0) + 1
    info = progress_info.copy()
    info['id'] = new_id
    info.setdefault('created_at', datetime.now().isoformat())
    
    progress_list.append(info)
    save_data(data)
    return info

