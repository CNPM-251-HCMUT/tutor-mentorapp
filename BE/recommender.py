from sentence_transformers import SentenceTransformer, util
import numpy as np

# GIẢI PHÁP 1: Đổi sang Model hỗ trợ đa ngôn ngữ (bao gồm Tiếng Việt)
# Model này hiểu ngữ cảnh tiếng Việt tốt hơn 'all-MiniLM-L6-v2'
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def get_recommendations(group, tutors, top_k=3):
    """
    group: Dict thông tin nhóm {name, topic, description}
    tutors: List các Dict thông tin gia sư {id, name, skills, bio}
    top_k: Số lượng gợi ý muốn lấy
    """
    
    # Chuẩn bị dữ liệu nhóm
    topic = group.get('topic', '')
    desc = group.get('description', '')
    group_desc_lower = desc.lower()
    
    # GIẢI PHÁP 2: Tăng trọng số cho "Topic" (Data Cleaning)
    # Lặp lại topic 3 lần để AI chú ý vào chủ đề chính hơn là các từ nhiễu trong tên nhóm
    # Loại bỏ group['name'] khỏi query nếu nó chứa tên riêng vô nghĩa (như "ST to nigg")
    group_text = f"{topic} {topic} {topic} . {desc} {desc} {desc} {desc}"
    
    # Chuẩn bị dữ liệu gia sư
    tutor_texts = []
    for t in tutors:
        skills_str = ", ".join(t.get('skills', []))
        bio_str = t.get('bio', '')
        # Nhấn mạnh kỹ năng của gia sư
        full_text = f"Chuyên gia về {skills_str}. {bio_str}"
        tutor_texts.append(full_text)
        
    # Mã hóa văn bản thành Vector
    group_embedding = model.encode(group_text, convert_to_tensor=True)
    tutor_embeddings = model.encode(tutor_texts, convert_to_tensor=True)
    
    # Tính độ tương đồng
    cosine_scores = util.cos_sim(group_embedding, tutor_embeddings)[0]
    
    results_with_score = []
    
    # Duyệt qua tất cả gia sư để tính điểm cuối cùng
    for i, tutor in enumerate(tutors):
        # Lấy điểm gốc từ AI (từ -1 đến 1)
        ai_score = cosine_scores[i].item()
        
        # GIẢI PHÁP 3: Hybrid Search (Kết hợp tìm kiếm cứng)
        # Nếu mô tả nhóm có nhắc đích danh tên Gia sư -> Cộng điểm cực lớn
        if tutor['name'].lower() in group_desc_lower:
            ai_score += 0.5  # Cộng thêm 50% độ phù hợp (Boost mạnh)
            
        # Chỉ lấy kết quả có điểm dương (liên quan một chút trở lên)
        # Hoặc bạn có thể bỏ điều kiện này nếu muốn luôn hiện danh sách
        if ai_score > 0:
            tutor_data = tutor.copy()
            # Chuyển đổi sang thang điểm 100% cho dễ nhìn
            # Cap lại ở 100% nếu cộng điểm lố
            final_score = round(min(ai_score, 1.0) * 100, 1)
            tutor_data['match_score'] = final_score
            results_with_score.append(tutor_data)
    
    # Sắp xếp danh sách theo điểm cao nhất xuống thấp nhất
    results_with_score.sort(key=lambda x: x['match_score'], reverse=True)
    
    # Trả về top k kết quả
    return results_with_score[:top_k]