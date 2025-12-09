import google.generativeai as genai
import json


# --- CẤU HÌNH ---
API_KEY = "AIzaSyB5t2MUsHRowhIXKZmBeD8ehM33JZ07dt4" # Để project public thì bỏ cái này đi nha, chết tui :))
genai.configure(api_key=API_KEY)

# Sử dụng model ổn định cho Free Tier
model = genai.GenerativeModel('models/gemini-2.5-flash')

# Cache đơn giản để tránh gọi API lại nếu user bấm liên tục 
recommendation_cache = {}

def get_recommendations(group, tutors, top_k=3):
    """
    Gửi dữ liệu nhóm và danh sách gia sư RÚT GỌN lên AI để nhờ đánh giá.
    """
    # 0. Kiểm tra Cache 
    group_id = group.get('id')
    if group_id in recommendation_cache:
        print(f"🔄 Lấy kết quả từ Cache cho Group ID: {group_id}")
        return recommendation_cache[group_id]

    # --- BƯỚC 1: SƠ TUYỂN (PRE-FILTERING) ---
    # Mục đích: Chỉ chọn ra những gia sư có "liên quan sơ sơ" để gửi cho AI
    # Thay vì gửi 100 người, ta chỉ gửi khoảng 10-15 người
    
    group_text = (group.get('topic', '') + " " + group.get('description', '')).lower()
    potential_tutors = []
    
    for t in tutors:
        # Lấy kỹ năng của gia sư
        skills = [s.lower() for s in t.get('skills', [])]
        
        # Logic lọc: 
        # 1. Nếu gia sư chưa cập nhật skill -> Vẫn giữ lại để AI đọc Bio
        # 2. Nếu topic nhóm xuất hiện trong skill gia sư (VD: nhóm "Web" -> skill "Web Dev")
        # 3. Nếu skill gia sư xuất hiện trong mô tả nhóm
        is_relevant = False
        if not skills:
            is_relevant = True
        else:
            for skill in skills:
                if skill in group_text or group_text in skill:
                    is_relevant = True
                    break
        
        if is_relevant:
            potential_tutors.append(t)
    
    # Fallback: Nếu lọc xong mà không còn ai (hoặc quá ít), 
    # hãy lấy đại Top 10 gia sư có rating cao nhất để AI xử lý 
    if len(potential_tutors) < 3:
        potential_tutors = sorted(tutors, key=lambda x: x.get('rating', 0), reverse=True)[:10]

    # --- BƯỚC 2: TỐI ƯU HÓA PROMPT ---
    # Chỉ lấy tối đa 15 người tiềm năng nhất để gửi đi
    target_tutors = potential_tutors[:15]
    
    simplified_tutors = []
    for t in target_tutors:
        # Cắt bio còn 150 kí tự
        bio = t.get('bio', '') or ''
        short_bio = (bio[:150] + '...') if len(bio) > 150 else bio
        
        simplified_tutors.append({
            "id": t['id'],
            "name": t['name'],
            "skills": t.get('skills', []),
            "bio": short_bio 
        })

    group_info = {
        "topic": group.get('topic', ''),
        "description": group.get('description', '')
    }

    # --- BƯỚC 3: GỌI AI ---
    prompt = f"""
    Đóng vai cố vấn học tập ĐH Bách Khoa. Hãy chọn {top_k} gia sư phù hợp nhất cho nhóm này.

    NHÓM: {json.dumps(group_info, ensure_ascii=False)}
    
    DS GIA SƯ (Đã sơ tuyển): {json.dumps(simplified_tutors, ensure_ascii=False)}

    YÊU CẦU:
    1. So sánh ngữ nghĩa (Tiếng Việt/Anh, từ viết tắt).
    2. Trả về JSON list: [{{ "id": int, "match_score": int (0-100), "reason": "ngắn gọn" }}]
    3. Không markdown.
    """

    try:
        response = model.generate_content(prompt)
        result_text = response.text.strip()
        
        if result_text.startswith("```json"):
            result_text = result_text[7:-3]
            
        ai_matches = json.loads(result_text)
        
        recommendations = []
        for match in ai_matches:
            # Map lại object gốc
            original_tutor = next((t for t in tutors if t['id'] == match['id']), None)
            if original_tutor:
                tutor_data = original_tutor.copy()
                tutor_data['match_score'] = match['match_score']
                recommendations.append(tutor_data)
        
        # Sắp xếp
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Lưu vào Cache
        if recommendations:
            recommendation_cache[group_id] = recommendations
            
        return recommendations

    except Exception as e:
        print(f"AI Error: {e}")
        return []
