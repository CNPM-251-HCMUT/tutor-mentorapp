import { useEffect, useState, useRef } from "react";
import { authApi } from "../pages/services/api";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { navbarText } from "../i18n/navbar";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const t = navbarText[lang as "vi" | "en"];

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    authApi.me().then(res => {
      if (res?.user) setRole(res.user.role);
    });
  }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Role prefix
  const prefix = role ? `/${role.toLowerCase()}` : "";

  return (
    <>
      <div className="w-full bg-white shadow-sm">
        <nav className="w-full px-8 py-2 flex items-center bg-white shadow-sm gap-10">
          
          <img src="/bklogo.png" className="h-12" />

          <div className="flex items-center gap-8 text-sm">
            <NavLink to={`${prefix}/dashboard`}>{t.dashboard}</NavLink>
            <NavLink to={`${prefix}/schedule`}>{t.schedules}</NavLink>
            <NavLink to={`${prefix}/classes`}>{t.classes}</NavLink>

            {role === "Student" ? (
              <NavLink to={`${prefix}/tutors`}>{t.tutors}</NavLink>
            ) : (
              <NavLink to={`${prefix}/progress`}>{t.progress}</NavLink>
            )}

            <NavLink to={`${prefix}/documents`}>{t.documents}</NavLink>
            <NavLink to={`${prefix}/feedback`}>{t.feedback}</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5 ml-auto">
            <div className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm">
              <button onClick={() => setLang("vi")}>VI</button>
              <span>|</span>
              <button onClick={() => setLang("en")}>EN</button>
            </div>

            <div className="relative">
              <IoMdNotificationsOutline size={26} />
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
            </div>

            <div className="relative" ref={menuRef}>
              <img src="/avatar.jpg" className="w-7 h-7 cursor-pointer"
                   onClick={() => setOpenMenu(p => !p)} />
              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 border bg-white rounded shadow-md z-50">
                  <button className="w-full px-4 py-2"
                          onClick={() => navigate("/settings")}>
                    {t.settings}
                  </button>
                  <button className="w-full px-4 py-2 text-red-600"
                          onClick={handleLogout}>
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ROLE BADGE */}
        <div className="px-8 pb-3 flex items-center gap-3 pt-2">
          <h1 className="text-lg font-semibold">{t.program}</h1>
          {role && (
            <span className="text-white text-sm px-4 rounded-full bg-black">
              {role}
            </span>
          )}
        </div>
      </div>

      {/* Để router con hoạt động */}
      <Outlet />
    </>
  );
}
