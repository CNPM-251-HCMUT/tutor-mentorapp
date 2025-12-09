import React, { useEffect, useState } from 'react';
import { authApi, type User } from '../../services/api';

// --- Icons ---
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Interface mở rộng (Nếu api.ts chưa cập nhật) ---
interface ExtendedUser extends User {
    expertise?: string;
    location?: string;
}

// --- Modal Component ---
interface ChangeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUser;
  onSuccess: (updatedUser: User) => void;
}

const ChangeProfileModal = ({ isOpen, onClose, user, onSuccess }: ChangeProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    expertise: '',
    location: ''
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        expertise: user.expertise || '',
        location: user.location || ''
      });
      setSubjects(user.skills || []);
    }
  }, [isOpen, user]);

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedData = {
        name: formData.name,
        bio: formData.bio,
        skills: subjects,
        expertise: formData.expertise,
        location: formData.location
      };

      // Gọi API
      const res = await authApi.updateProfile(updatedData);
      
      onSuccess(res.user); 
      onClose();
      alert("Profile updated successfully!");

    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Failed to update profile. Check console (F12) for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
          <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
            <div><label className="block text-sm font-semibold mb-2">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold mb-2">Email</label><input type="text" value={formData.email} disabled className="w-full bg-gray-100 border p-3 rounded-lg text-gray-500 cursor-not-allowed" /></div>
            <div><label className="block text-sm font-semibold mb-2">Bio</label><textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg" /></div>

            {/* Teaching Subjects */}
            <div>
                <label className="block text-sm font-semibold mb-2">Teaching Subjects</label>
                <div className="flex gap-2 mb-3">
                    <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Add subject..." className="flex-1 bg-gray-50 border p-3 rounded-lg" onKeyDown={e => e.key === 'Enter' && handleAddSubject()} />
                    <button onClick={handleAddSubject} className="bg-black text-white px-4 rounded-lg font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {subjects.map((sub, idx) => (
                        <span key={idx} className="bg-gray-100 text-xs font-semibold px-3 py-1.5 rounded-full flex gap-2 border">{sub}<button onClick={() => removeSubject(idx)}><XMarkIcon className="w-3 h-3" /></button></span>
                    ))}
                </div>
            </div>

            <div><label className="block text-sm font-semibold mb-2">Expertise</label><input type="text" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg" /></div>
            <div><label className="block text-sm font-semibold mb-2">Location</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg" /></div>
        </div>

        {/* Footer - SỬA LẠI: justify-end */}
        <div className="px-8 py-5 border-t flex justify-end">
          <button onClick={handleSubmit} disabled={loading} className="bg-black text-white text-sm font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 disabled:bg-gray-400">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function Profile() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authApi.me();
        setUser(res.user as ExtendedUser);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!user) return <div className="p-10 text-center text-gray-500">User not found</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        
        <div className="mb-10 text-left">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-gray-900">HCMUT Tutor Program</h2>
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">{user.role}</span>
          </div>
          <h1 className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>Tutor Profile</h1>
        </div>

        {/* SỬA LẠI: w-full để rộng hết mức */}
        <div className="w-full">
            <div className="border border-gray-100 rounded-2xl p-10 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8">
                <div className="space-y-8">
                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Name</label><div className="text-xl font-medium text-gray-900">{user.name}</div></div>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Email</label><div className="text-lg font-medium text-gray-900">{user.email}</div></div>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Role</label><div className="text-lg font-medium text-gray-900">{user.role}</div></div>
                    
                    {user.bio && (<div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Bio</label><div className="text-lg font-medium text-gray-900">{user.bio}</div></div>)}
                    
                    {user.expertise && (<div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Expertise</label><div className="text-lg font-medium text-gray-900">{user.expertise}</div></div>)}
                    
                    {user.location && (<div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Location</label><div className="text-lg font-medium text-gray-900">{user.location}</div></div>)}

                    {user.skills && user.skills.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Teaching Subjects</label>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(true)} className="bg-black text-white text-sm font-bold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">Change</button>
            </div>
        </div>
      </div>
      <ChangeProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} onSuccess={(u) => setUser(u as ExtendedUser)} />
    </div>
  );
}