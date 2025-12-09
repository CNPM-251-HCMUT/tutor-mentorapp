import { useEffect, useState, useRef } from "react";
import { authApi, type User } from "../pages/services/api"; // Import User type
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { navbarText } from "../i18n/navbar";

// --- Icons cho Menu ---
const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // Lưu toàn bộ object User
  const [role, setRole] = useState<string | null>(null);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const t = navbarText[lang as "vi" | "en"];

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    authApi.me().then((res) => {
      if (res?.user) {
        setUser(res.user); // Lưu thông tin user để hiển thị trong Menu
        setRole(res.user.role);
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  const prefix = role ? `/${role.toLowerCase()}` : "";

  /* ---------------------------------------------
      MENU THEO ROLE
  ----------------------------------------------*/
  const renderMenu = () => {
    if (!role) return null;

    /* ---- ADMIN ---- */
    if (role === "Admin") {
      return (
        <>
          <NavLink to={`${prefix}/dashboard`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.dashboard}</NavLink>
          <NavLink to={`${prefix}/users`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.usermanagement}</NavLink>
          <NavLink to={`${prefix}/policies`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.policies}</NavLink>
        </>
      );
    }

    /* ---- STUDENT ---- */
    if (role === "Student") {
      return (
        <>
          <NavLink to={`${prefix}/dashboard`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.dashboard}</NavLink>
          <NavLink to={`${prefix}/groups`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.groups}</NavLink>
          <NavLink to={`${prefix}/classes`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.classes}</NavLink>
          <NavLink to={`${prefix}/tutors`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.tutors}</NavLink>
          <NavLink to={`${prefix}/documents`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.documents}</NavLink>
          <NavLink to={`${prefix}/feedback`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.feedback}</NavLink>
        </>
      );
    }

    /* ---- TUTOR ---- */
    if (role === "Tutor") {
      return (
        <>
          <NavLink to={`${prefix}/dashboard`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.dashboard}</NavLink>
          <NavLink to={`${prefix}/schedule`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.schedules}</NavLink>
          <NavLink to={`${prefix}/classes`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.classes}</NavLink>
          <NavLink to={`${prefix}/progress`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.progress}</NavLink>
          <NavLink to={`${prefix}/documents`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.documents}</NavLink>
          <NavLink to={`${prefix}/feedback`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.feedback}</NavLink>
        </>
      );
    }

    /* ---- STAFF ---- */
    if (role === "Staff") {
      return (
        <>
          <NavLink to={`${prefix}/dashboard`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.dashboard}</NavLink>
          <NavLink to={`${prefix}/reports`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.reports}</NavLink>
          <NavLink to={`${prefix}/monitoring`} className={({isActive}) => isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>{t.monitoring}</NavLink>
        </>
      );
    }
  };

  return (
    <>
      <div className="w-full bg-white shadow-sm z-50 relative">
        <nav className="w-full px-8 py-4 flex items-center bg-white justify-between">
          
          <div className="flex items-center gap-10">
             {/* Logo */}
             <div className="flex items-center gap-2">
                <img src="/bklogo.png" className="h-10 w-auto" alt="Logo" />
             </div>

             {/* MENU THEO ROLE */}
             <div className="flex items-center gap-6 text-sm font-medium">
                {renderMenu()}
             </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">
            {/* Language Switch */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
              <button onClick={() => setLang("vi")} className={lang === 'vi' ? 'text-black' : ''}>VI</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setLang("en")} className={lang === 'en' ? 'text-black' : ''}>EN</button>
            </div>

            {/* Notification */}
            <div className="relative cursor-pointer">
              <IoMdNotificationsOutline size={24} className="text-gray-600 hover:text-black transition-colors" />
              <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white"></span>
            </div>

            {/* Avatar & Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setOpenMenu((p) => !p)}
                className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-gray-100 transition-all focus:outline-none"
              >
                 {/* Dùng ảnh thật nếu có, hoặc placeholder */}
                 {user?.role === 'Tutor' ? (
                    <img src="/avatar.jpg" className="w-full h-full object-cover" alt="User" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <UserIcon className="w-5 h-5" />
                    </div>
                 )}
              </button>

              {/* --- DROPDOWN MENU (ĐÃ SỬA GIỐNG ẢNH 1) --- */}
              {openMenu && user && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-100 origin-top-right">
                  
                  {/* User Info Header */}
                  <div className="px-5 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">ID: {user.id}</p>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <button 
                        onClick={() => { navigate(`${prefix}/profile`); setOpenMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      {t.profile || "Profile"} {/* Cần thêm key 'profile' vào i18n */}
                    </button>
                    
                    <button 
                        onClick={() => { navigate(`${prefix}/settings`); setOpenMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <CogIcon className="w-4 h-4 text-gray-400" />
                      {t.settings}
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Sub-header (Program Name & Role Badge) */}
        <div className="px-8 pb-4 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">{t.program}</h1>
          {role && (
            <span className="text-white text-[10px] font-bold px-3 py-1 rounded-full bg-black uppercase tracking-wide">
              {role}
            </span>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
}
