# Tutor Mentor App

> Hệ thống hỗ trợ chương trình Tutor/Mentor tại Trường Đại học Bách Khoa – ĐHQG TP.HCM (HCMUT)  
> Môn học: Software Engineering – SE251

---

## Mục lục

- [Giới thiệu dự án](#giới-thiệu-dự-án)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tính năng đã hoàn thành](#tính-năng-đã-hoàn-thành)
- [Tài khoản demo](#tài-khoản-demo)
- [Hướng dẫn cài đặt & chạy dự án](#hướng-dẫn-cài-đặt--chạy-dự-án)
- [Các API endpoint](#các-api-endpoint)
- [Sử dụng AI trong dự án](#sử-dụng-ai-trong-dự-án)

---

## Giới thiệu dự án

Tại HCMUT, chương trình **Tutor/Mentor** được triển khai nhằm hỗ trợ sinh viên trong quá trình học tập và phát triển kỹ năng. Các Tutor có thể là giảng viên, nghiên cứu sinh, hoặc sinh viên năm trên có thành tích học tập tốt, được phân công để hướng dẫn và đồng hành cùng một nhóm sinh viên cụ thể.

**Tutor Mentor App** là hệ thống phần mềm MVP được xây dựng nhằm quản lý và vận hành chương trình Tutor một cách hiệu quả, bao gồm:

- Quản lý thông tin tutor và sinh viên (hồ sơ, kỹ năng, nhu cầu hỗ trợ)
- Sinh viên tạo nhóm học tập, tìm kiếm và gửi yêu cầu mời gia sư
- Gia sư thiết lập lịch dạy, quản lý các buổi học trực tiếp/trực tuyến
- Phản hồi và đánh giá chất lượng buổi học
- Theo dõi tiến độ học tập của sinh viên
- Báo cáo và giám sát dành cho Staff và Admin
- **Gợi ý gia sư thông minh bằng AI (Google Gemini 2.5 Flash)**
- Xác thực mô phỏng HCMUT SSO qua cookie-based JWT

---

## Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 19.2 | UI library chính |
| TypeScript | 5.9 | Ngôn ngữ |
| Vite | 7 | Build tool / Dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 3 | Utility-first CSS (CDN) |
| Axios | 1.13 | HTTP client |
| React Icons | 5.5 | Icon library |
| ESLint 9 | 9 | Code quality |

### Backend

| Công nghệ | Mục đích |
|---|---|
| Python 3.11+ | Runtime |
| Flask | REST API framework |
| Flask-CORS | Cross-origin request |
| PyJWT | JSON Web Token (HS256) |
| google-generativeai | Gemini 2.5 Flash SDK |
| data.json | Lưu trữ dữ liệu (thay DB) |

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React + TS)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Student  │  │  Tutor   │  │  Staff   │  │  Admin  │ │
│  │  Views   │  │  Views   │  │  Views   │  │  Views  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
│       └──────────────┴──────────────┴──────────────┘     │
│                       Axios + Cookie (JWT)                │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP REST
┌───────────────────────────▼─────────────────────────────┐
│                    Backend (Flask)                       │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  app.py    │  │data_manager  │  │  recommender.py  │ │
│  │ (Routes)   │  │  (CRUD)      │  │ (Gemini AI)      │ │
│  └─────┬──────┘  └──────┬───────┘  └────────┬─────────┘ │
│        │                │                    │            │
│        └────────────────▼────────────────────┘           │
│                      data.json                           │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  Google Gemini 2.5 Flash  │
              │  (AI Tutor Recommendation)│
              └───────────────────────────┘
```

**Phân quyền theo role** (mô phỏng HCMUT SSO):

| Role | Trang chủ sau login |
|---|---|
| `Student` | `/student/dashboard` |
| `Tutor` | `/tutor/dashboard` |
| `Staff` | `/staff/dashboard` |
| `Admin` | `/admin/dashboard` |

---

## Cấu trúc thư mục

```
tutor-mentorapp/
├── README.md
│
├── BE/                             # Backend (Python / Flask)
│   ├── app.py                      # Entry point — toàn bộ REST API routes
│   ├── run.py                      # Khởi chạy server (port 5000)
│   ├── data_manager.py             # Lớp CRUD đọc/ghi data.json
│   ├── recommender.py              # AI module — Gemini 2.5 Flash
│   ├── data.json                   # Dữ liệu (users, groups, schedules, ...)
│   └── requirements.txt            # Python dependencies
│
└── FE/                             # Frontend (React + TypeScript)
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    │
    ├── public/
    │   └── icons/                  # SVG icons (bell, user)
    │
    └── src/
        ├── App.tsx                 # Root router — định nghĩa toàn bộ routes
        ├── main.tsx
        ├── index.css
        │
        ├── components/
        │   └── Navbar.tsx          # Thanh điều hướng dùng chung (có Outlet)
        │
        ├── i18n/
        │   └── navbar.ts           # Custom đa ngôn ngữ navbar (VI/EN)
        │
        ├── pages/
        │   ├── services/
        │   │   └── api.ts          # Tập trung toàn bộ Axios API calls
        │   │
        │   ├── auth/
        │   │   ├── IntroPage.tsx   # Landing page (/)
        │   │   └── LoginPage.tsx   # Đăng nhập (/login)
        │   │
        │   ├── layout/
        │   │   ├── AuthLayout.tsx
        │   │   └── MainLayout.tsx
        │   │
        │   ├── student/            # Student view
        │   │   ├── StudentDashboard.tsx    # /student/dashboard
        │   │   ├── StudentGroups.tsx       # /student/groups
        │   │   ├── StudentClasses.tsx      # /student/classes
        │   │   ├── StudentTutor.tsx        # /student/tutors
        │   │   ├── StudentFeedback.tsx     # /student/feedback
        │   │   ├── StudentDocuments.tsx    # /student/documents
        │   │   ├── StudentSession.tsx      # /student/sessions
        │   │   ├── Logbar.tsx              # Toast notification component
        │   │   └── Logbar.css
        │   │
        │   ├── tutor/              # Tutor view
        │   │   ├── TutorDashboard.tsx      # /tutor/dashboard
        │   │   ├── TutorClasses.tsx        # /tutor/classes
        │   │   ├── TutorSchedule.tsx       # /tutor/schedule
        │   │   ├── TutorRequest.tsx        # /tutor/requests
        │   │   ├── TutorProgress.tsx       # /tutor/progress
        │   │   ├── TutorFeedback.tsx       # /tutor/feedback
        │   │   ├── TutorDocuments.tsx      # /tutor/documents
        │   │   └── Menu/
        │   │       ├── Menu.tsx
        │   │       ├── Profile.tsx         # /tutor/profile
        │   │       └── Settings.tsx        # /tutor/settings
        │   │
        │   ├── staff/              # Staff view
        │   │   ├── StaffDashboard.tsx      # /staff/dashboard
        │   │   ├── StaffReports.tsx        # /staff/reports
        │   │   └── StaffMonitoring.tsx     # /staff/monitoring
        │   │
        │   └── admin/              # Admin view
        │       ├── AdminDashboard.tsx      # /admin/dashboard
        │       ├── UsersManagement.tsx     # /admin/users
        │       └── AdminPolicies.tsx       # /admin/policies
        │
        └── assets/
```

---

## Tính năng đã hoàn thành

### 🎓 Student

| Trang | Tính năng | Trạng thái |
|---|---|---|
| Dashboard | Chào tên user, 4 navigation card, thông báo | ✅ |
| Groups | Xem / tìm kiếm tất cả nhóm, Join/Leave, tạo nhóm mới, badge Leader, toast notification | ✅ |
| Classes | Xem nhóm đã tham gia, modal chi tiết (tab Documents + tab Schedule) | ✅ |
| Tutors | Tìm kiếm / lọc gia sư, xem chi tiết (skills, lịch dạy, đánh giá), request tutor cho nhóm | ✅ |
| Tutors — AI | Gợi ý gia sư thông minh bằng Gemini 2.5 Flash với match_score | ✅ |
| Feedback | Form đánh giá với star rating (UI hoàn chỉnh, chưa POST API) | ⚠️ |
| Documents | Xem danh sách tài liệu, tìm kiếm (mock data, chưa kết nối API) | ⚠️ |
| Sessions | Chưa triển khai | ❌ |

### 👨‍🏫 Tutor

| Trang | Tính năng | Trạng thái |
|---|---|---|
| Dashboard | Tổng quan lớp đang dạy | ✅ |
| Classes | Xem danh sách lớp được phân công | ✅ |
| Schedule | Tạo / chỉnh sửa / xóa lịch dạy | ✅ |
| Requests | Duyệt / từ chối yêu cầu mời gia sư từ nhóm sinh viên | ✅ |
| Progress | Theo dõi tiến độ học tập sinh viên | ✅ |
| Feedback | Xem đánh giá từ sinh viên | ✅ |

### 🛠️ Staff & Admin

| Trang | Tính năng | Trạng thái |
|---|---|---|
| Staff Dashboard | Tổng quan hoạt động hệ thống | ✅ |
| Staff Reports | Báo cáo | ✅ |
| Staff Monitoring | Giám sát hoạt động | ✅ |
| Admin Dashboard | Tổng quan quản trị | ✅ |
| Users Management | Quản lý tài khoản người dùng | ✅ |
| Admin Policies | Cấu hình chính sách | ✅ |

### 🔐 Auth

- Đăng nhập mô phỏng HCMUT SSO
- JWT (HS256) lưu trong HttpOnly cookie `session_id`, hết hạn sau 1 giờ
- Tự động phân quyền và điều hướng theo `role`

---

## Tài khoản demo

| Username | Password | Role |
|---|---|---|
| `student1` | `123` | Student |
| `student2` | `123` | Student |
| `student3` | `123` | Student |
| `tutor1` | `123` | Tutor |
| `tutor2` | `123` | Tutor |
| `tutor3` | `123` | Tutor |
| `admin` | `123` | Admin |
| `staff` | `123` | Staff |

---

## Hướng dẫn cài đặt & chạy dự án

### Yêu cầu hệ thống

- **Python** 3.11 trở lên
- **Node.js** 18 trở lên và **npm**

---

### 1. Chạy Backend

```bash
# Bước 1: Di chuyển vào thư mục BE
cd BE

# Bước 2: Tạo virtual environment (chỉ cần làm lần đầu)
python -m venv venv

# Bước 3: Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Bước 4: Cài đặt dependencies (chỉ cần làm lần đầu)
pip install -r requirements.txt

# Bước 5: Khởi chạy server
python run.py
```

Backend sẽ chạy tại: **http://localhost:5000**

---

### 2. Chạy Frontend

Mở terminal mới (giữ nguyên terminal backend):

```bash
# Bước 1: Di chuyển vào thư mục FE
cd FE

# Bước 2: Cài đặt dependencies (chỉ cần làm lần đầu)
npm install

# Bước 3: Khởi chạy dev server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

> **Lưu ý:** Nếu giao diện hiển thị chưa có style Tailwind, chạy thêm:
> ```bash
> npm install -D tailwindcss@3 postcss autoprefixer
> npm run dev
> ```

---

### 3. Truy cập ứng dụng

1. Mở trình duyệt, vào `http://localhost:5173`
2. Đăng nhập bằng tài khoản demo ở bảng trên
3. Hệ thống tự động điều hướng theo role

---

## Các API endpoint

### Authentication

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/login` | Đăng nhập, trả về JWT cookie |
| `POST` | `/logout` | Đăng xuất, xóa cookie |
| `GET` | `/me` | Lấy thông tin user hiện tại |
| `PUT` | `/me/profile` | Cập nhật hồ sơ cá nhân |

### Groups

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/groups` | Lấy danh sách tất cả nhóm |
| `POST` | `/groups` | Tạo nhóm mới |
| `GET` | `/groups/:id` | Chi tiết một nhóm |
| `POST` | `/groups/:id/join` | Tham gia nhóm |
| `POST` | `/groups/:id/leave` | Rời nhóm (tự xóa nếu thành viên cuối) |
| `GET` | `/my-groups` | Danh sách nhóm đã tham gia |
| `POST` | `/groups/:id/request-tutor` | Gửi yêu cầu mời gia sư |
| `GET` | `/groups/:id/schedules` | Lịch học của nhóm |
| `GET` | `/groups/:id/recommend-tutors` | **Gợi ý gia sư bằng AI** |

### Tutors

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/tutors` | Danh sách tất cả gia sư |
| `GET` | `/tutors/:id` | Chi tiết một gia sư |
| `GET` | `/tutors/:id/feedbacks` | Đánh giá của gia sư |
| `GET` | `/tutors/:id/schedules` | Lịch dạy của gia sư |
| `GET` | `/tutor/classes` | Lớp đang dạy (tutor hiện tại) |
| `GET` | `/tutor/requests` | Yêu cầu mời gia sư đang chờ |
| `PUT` | `/tutor/requests/:id` | Duyệt / từ chối yêu cầu |
| `GET` | `/tutor/feedbacks` | Feedback nhận được |

### Schedules

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/schedules` | Tạo lịch học mới |
| `PUT` | `/schedules/:id` | Cập nhật lịch học |
| `DELETE` | `/schedules/:id` | Xóa lịch học |

### Progress

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/progress` | Lấy dữ liệu tiến độ |
| `POST` | `/progress` | Ghi nhận tiến độ mới |

---

## Sử dụng AI trong dự án

Dự án tích hợp **Google Gemini 2.5 Flash** để cung cấp tính năng gợi ý gia sư thông minh.

**Luồng hoạt động** (`BE/recommender.py`):

1. **Sơ tuyển bằng keyword**: So khớp `topic` và `description` của nhóm với `skills` của từng gia sư. Nếu sơ tuyển không đủ 3 người, fallback về top 10 gia sư có rating cao nhất.
2. **Tối ưu prompt**: Lấy tối đa 15 gia sư tiềm năng, cắt ngắn bio còn 150 ký tự để giảm token.
3. **Gọi Gemini API**: Gửi thông tin nhóm + danh sách gia sư đã rút gọn, yêu cầu trả về JSON `[{id, match_score, reason}]`.
4. **Xử lý kết quả**: Parse JSON bằng regex, map lại object gốc, sắp xếp theo `match_score` giảm dần.
5. **Cache in-memory**: Lưu kết quả theo `group_id` để tránh gọi API lại khi user bấm nhiều lần.

**Khai báo sử dụng AI** (theo yêu cầu SE251):
- Gemini API được dùng cho tính năng gợi ý gia sư (`/groups/:id/recommend-tutors`)
- Toàn bộ code logic frontend, backend, routing, auth, và data layer được viết thủ công bởi nhóm
- AI không được dùng để tạo nội dung tài liệu nộp (requirements, diagrams)

---

## Ghi chú phát triển

- Dữ liệu được lưu trong `BE/data.json` thay cho database thực — phù hợp với yêu cầu MVP của môn SE251
- CORS được cấu hình cho `localhost:5173` và `127.0.0.1:5173`
- Toàn bộ API calls từ frontend được tập trung tại `FE/src/pages/services/api.ts`
- Navbar hỗ trợ đa ngôn ngữ VI/EN qua `FE/src/i18n/navbar.ts`
