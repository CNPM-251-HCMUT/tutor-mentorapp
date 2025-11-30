import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // 🌐 LANGUAGE STATE
  const [lang, setLang] = useState<"en" | "vi">("en");

  // 🌐 TEXT DICTIONARY
  const text = {
    en: {
      headerTitle: "CENTRAL AUTHENTICATION SERVICE",
      title: "Enter your Username and Password",
      username: "Username",
      password: "Password",
      warn: "Warn me before logging me into other sites.",
      login: "Log in",
      clear: "Clear",
      changePass: "Change password?",
      languages: "Languages",
      vn: "Vietnamese",
      en: "English",
      noteTitle: "Please note",
      note1:
        "The The Login page enables single sign-on to multiple websites at HCMUT. This means that you only have to enter your user name and password once for websites that subscribe to the Login page.",
      note2:
        "Your HCMUT Username provides access to resources including the HCMUT Information System, email, …",
      note3: "You will need to use your HCMUT Username and password to login to this site. The ''HCMUT'' account provides access to many resources including the HCMUT Information System, e-mail, ...",
      techTitle: "Technical support",
      techInfo: "E-mail: support@hcmut.edu.vn | Tel: (84-8) 38647256 - 7204"
    },

    vi: {
      headerTitle: "DỊCH VỤ XÁC THỰC TẬP TRUNG",
      title: "Nhập Tên đăng nhập và Mật khẩu",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      warn: "Cảnh báo tôi trước khi đăng nhập vào các trang khác.",
      login: "Đăng nhập",
      clear: "Xóa",
      changePass: "Đổi mật khẩu?",
      languages: "Ngôn ngữ",
      vn: "Tiếng Việt",
      en: "Tiếng Anh",
      noteTitle: "Lưu ý",
      note1:
        "Trang đăng nhập này cho phép đăng nhập một lần đến nhiều hệ thống web ở Trường Đại học Bách Khoa-ĐHQG-HCM. Điều này có nghĩa là bạn chỉ đăng nhập một lần cho những hệ thống web đã đăng ký với hệ thống xác thực quản lý truy cập tập trung.",
      note2:
        "Bạn cần dùng tài khoản HCMUT để đăng nhập. Tài khoản HCMUT cho phép truy cập đến nhiều tài nguyên bao gồm hệ thống thông tin, thư điện tử, ...",
      note3: "Vì lý do an ninh, bạn hãy Thoát khỏi trình duyệt Web khi bạn kết thúc việc truy cập các dịch vụ đòi hỏi xác thực!",
      techTitle: "Hỗ trợ kỹ thuật",
      techInfo: "Email: support@hcmut.edu.vn | Tel: (84-8) 38647256 - 7204"
    }
  };

  // 🔍 SESSION CHECK
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await authApi.me();
        if (res && res.user) {
          if (res.user.role === "Student") navigate("/student/dashboard");
          else if (res.user.role === "Tutor") navigate("/tutor/dashboard");
          else if (res.user.role === "Staff") navigate("/staff/dashboard");
          else if (res.user.role === "Administrator")
            navigate("/admin/dashboard");
          else navigate("/dashboard");
        }
      } catch {
        console.log("User chưa login");
      } finally {
        setChecking(false);
      }
    };
    checkLogin();
  }, [navigate]);

  // 🔐 HANDLE LOGIN
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(username, password);

      if (!res.user || res.error) throw new Error(res.error || "Login failed");

      if (res.user.role === "Student") navigate("/student/dashboard");
      else if (res.user.role === "Tutor") navigate("/tutor/dashboard");
      else if (res.user.role === "Staff") navigate("/staff/dashboard");
      else if (res.user.role === "Administrator") navigate("/admin/dashboard");
      else navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="text-center mt-10">Checking session...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#EBEBEB] min-h-screen pt-0 py-10">
      {/* WHITE CARD */}
      <div className="w-[1100px] bg-white rounded-[10px] shadow-sm -mt-6">

        {/* HEADER BLUE */}
        <div className="bg-[#08296F] w-full rounded-t-[10px] flex items-center p-6 gap-6">
          <img src="/bk-logo.png" alt="BK Logo" className="h-20" />
          <h1 className="text-white text-3xl font-semibold">
            {text[lang].headerTitle}
          </h1>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex w-full px-12 py-12 gap-14">

          {/* LEFT FORM */}
          <div className="w-[50%]">
            <h2 className="text-[26px] font-semibold text-[#8E0000] mb-6">
              {text[lang].title}
            </h2>

            <label className="block text-[15px] mb-1">
              {text[lang].username}
            </label>
            <input
              type="text"
              className="w-[460px] h-[32px] bg-[#FFF6CE] rounded-md px-2 border"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="block text-[15px] mt-4 mb-1">
              {text[lang].password}
            </label>
            <input
              type="password"
              className="w-[460px] h-[32px] bg-[#FFF6CE] rounded-md px-2 border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* WARN CHECKBOX */}
            <div className="flex items-center mt-4">
              <input type="checkbox" className="mr-2" />
              <span className="text-[14px]">{text[lang].warn}</span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#1488DB] text-white px-4 py-1 rounded-md text-[15px]"
              >
                {loading ? "..." : text[lang].login}
              </button>

              <button
                className="bg-[#1488DB] text-white px-4 py-1 rounded-md text-[15px]"
              >
                {text[lang].clear}
              </button>
            </div>

            <button className="text-[#0B0F7C] underline mt-3 text-[15px]">
              {text[lang].changePass}
            </button>

            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-[50%] leading-[1.4] text-[15px]">

            <h3 className="text-[20px] font-bold mb-2">
              {text[lang].languages}
            </h3>

            <div className="flex gap-2 text-[15px]">
              <button
                onClick={() => setLang("vi")}
                className={`underline ${
                  lang === "vi" ? "font-bold text-blue-700" : ""
                }`}
              >
                {text[lang].vn}
              </button>
              |
              <button
                onClick={() => setLang("en")}
                className={`underline ${
                  lang === "en" ? "font-bold text-blue-700" : ""
                }`}
              >
                {text[lang].en}
              </button>
            </div>

            <h3 className="text-[20px] font-bold mt-6 mb-2">
              {text[lang].noteTitle}
            </h3>
            <p>
              {text[lang].note1}
              <br />
              <br />
              {text[lang].note2}
              <br />
              <br />
              {text[lang].note3}
            </p>

            <h3 className="text-[20px] font-bold mt-6 mb-2">
              {text[lang].techTitle}
            </h3>
            <p>{text[lang].techInfo}</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-[1100px] text-center mt-4 text-[13px] text-gray-500">
  Copyright © 2011 - 2012 Ho Chi Minh University of Technology. 
  All rights reserved. Powered by Jasig CAS 3.5.1
</div>

    </div>
  );
}
