import axios from 'axios';

// ==========================================
// 1. CONFIGURATION
// ==========================================
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  
});

// ==========================================
// 2. INTERFACES (DATA MODELS)
// Định nghĩa kiểu dữ liệu cho khớp với BE
// ==========================================

export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'Student' | 'Tutor' | 'Administrator' | 'Staff';
  name: string;
  email: string;

  major?: string;
  year?: number;

  skills?: string[];
  bio?: string;
  rating?: number;
  available?: boolean;
}

export interface Group {
  id: number;
  name: string;
  topic: string;
  description: string;
  leader_id: number;
  members: number[]; // Danh sách ID thành viên
  capacity: number;
  tutor_id: number | null;
  status: string; 
  created_at?: string;  
}

export interface Schedule {
  id: number;
  group_id: number;
  tutor_id: number;
  time: string;   
  duration: number; //Phut
  floor?: string;
  building?: string;
  room?: string;
  link?: string;
  type: 'online' | 'offline';
  created_at?: string;  
}

// Kiểu dữ liệu gửi lên khi tạo nhóm
export interface CreateGroupPayload {
  name: string;
  topic: string;
  capacity: number | 10;
  leader_id: number;
}

// Kiểu dữ liệu gửi lên khi tạo lịch
export interface CreateSchedulePayload {
  group_id: number;
  tutor_id: number;
  time: string; // Format: "YYYY-MM-DD HH:mm"
  link?: string;
}

export interface Request {
  id: number;
  group_id: number; // Cua group nao
  tutor_id: number; // Den tutor nao
  student_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  group?: Group;
  student?: User;
}

export interface Feedback {
  id: number;
  schedule_id: number;
  student_id: number;
  tutor_id: number;
  rating: number;
  comment: string;
  created_at: string;
  student?: User;
  schedule?: Schedule;
}

export interface Progress {
  id: number;
  group_id: number;
  tutor_id: number;
  schedule_id?: number;
  date: string;
  attendance: number[];
  notes: string;
  topics_covered: string[];
  progress_level: string;
  created_at: string;
}

// ==========================================
// 3. API CALLS
// ==========================================

export const authApi = { //.data se tra ve mot object json: vd { message: "Login success", user: { id: 1, role: "Student" } }
  login: async (username: string, password: string) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  //Lấy thông tin bản thân
  me: async () => {
    const response = await api.get<{user: User}>('/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  }
};

export const groupApi = { 
  // truyen 2 tham so topic va hasTutor vao de loc
  // Lấy ra các nhóm, có thể có filter
  getGroups: async (params?: { topic?: string; has_tutor?: boolean }) => {
    const queryParams = new URLSearchParams(); //Tao mot chuoi nhu topic=math&...
    if (params?.topic) queryParams.append('topic', params.topic);
    if (params?.has_tutor !== undefined) 
      queryParams.append('has_tutor', params.has_tutor.toString());
    
    const query = queryParams.toString();
    const response = await api.get<Group[]>(`/groups${query ? `?${query}` : ''}`);
    return response.data;
  },

  // Lấy nhóm từ id
  getGroup: async (groupId: number) => {
    const reponse = await api.get<Group>(`/groups/${groupId}`)
    return reponse.data
  },

  /**
   * Tạo nhóm mới
   */
  create: async (data:{
    name: string;
    topic: string;
    description: string;
    capacity: number;
  }) => {
    const response = await api.post('/groups', data);
    return response.data;
  },

  /**
   * Tham gia nhóm
   */
  join: async (groupId: number) => { //Paste groupId vao
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Rời nhóm
  leave: async (groupId: number) => {
    const response = await api.post(`/groups/${groupId}/leave`)
    return response.data;
  },

  // Lấy ra các danh sách các nhóm 
  myGroups: async () => {
    const res = await api.get<Group[]>('/my-groups')
    return res.data;
  },

  // yêu cầu tutor từ một nhóm
  requestTutor: async(groupId: number, data: {tutor_id: number, message?: string}) => {
    const res = await api.post<Request>(
      `/groups/${groupId}/request-tutor`,
      data,
    );
    return res.data
  },

  getGroupSchedules: async (groupId: number) => {
    const res = await api.get<Schedule[]>(`/groups/${groupId}/schedules`);
    return res.data;
  },
};

export const tutorApi = {
  //Tao lich dạy
  createSchedule: async (data: CreateSchedulePayload) => {
    const response = await api.post('/schedules', data);
    return response.data;
  },

  //cap nhat lịch dạy
  updateSchedule: async (
    scheduleId: number,
    updates: Partial<Schedule>,
  ) => {
    const res = await api.put<{ message: string; schedule: Schedule }>(
      `/schedules/${scheduleId}`,
      updates,
    );
    return res.data;
  },

  // xoá lịch dạy
  deleteSchedule: async (scheduleId: number) => {
    const res = await api.delete<{ message: string }>(
      `/schedules/${scheduleId}`,
    );
    return res.data;
  },

  //Lấy ra danh sách các tutor
  getTutors: async (params?: { skill?: string; available?: boolean }) => { //Tra ve danh sach ca tutor
    const queryParams = new URLSearchParams();
    if (params?.skill) queryParams.append('skill', params.skill);
    if (params?.available !== undefined) 
      queryParams.append('available', params.available.toString());
    
    const query = queryParams.toString();
    const response = await api.get<User[]>(`/tutors${query ? `?${query}` : ''}`);
    return response.data;
  },

  // Lấy một tutor từ id 
  getTutor: async (tutor_id: number) => {
    const res = await api.get<User>(`/tutors/${tutor_id}`)
    return res.data;
  },

  // Lấy ra tất cả request của tutor
  getRequest: async (status?: 'pending' | 'accepted' | 'rejected') => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get<Request[]>(`/tutor/requests${query}`)
    return res.data
  },

  // Xử lý yêu cầu request, truyền vào 2 tham số
  handleRequest: async(request_id: number,action: 'accept' | 'reject') => {
    const res = await api.put(`/tutor/requests/${request_id}`, { action });
    return res.data
  },

  // Lấy các class của tutor
  getClasses: async () => {
    const res = await api.get<Group[]>('/tutor/classes');
    return res.data;
  },
};

export default api;