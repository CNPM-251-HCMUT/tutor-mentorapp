import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col bg-white">

      {/* Nút Login góc phải */}
      <div className="w-full flex justify-end p-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-full bg-[#1488DB] text-white hover:bg-blue-600 transition"
        >
          Log in
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col items-center flex-grow">
        <img src="/bklogo.png" alt="BK Logo" className="h-40 mt-2" />

        <h1 className="text-4xl font-bold text-[#001A72] mt-4 text-center">
          Welcome to HCMUT’s Tutor Program
        </h1>

        <p className="text-lg text-gray-700 mt-2">
          Tutor system and support studying
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-8 py-3 bg-[#1488DB] text-white text-lg rounded-full hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
      </div>

      {/* FOOTER — đẩy xuống đáy */}
      <div className="mt-auto w-full bg-[#d9d9d9] py-8 px-16 text-gray-700 text-sm leading-5">
        <p><strong>Tổ kỹ thuật / Technician</strong></p>
        <p>Email : ddthu@hcmut.edu.vn</p>
        <p>ĐT (Tel.) : (84-8) 38647256 - 7203</p>

        <br />

        <p>
          Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) nhà trường vui lòng
          liên hệ Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 206 nhà A4 để
          được hỗ trợ.
        </p>

        <p>(For HCMUT account, please contact to : Data and Information Technology Center)</p>
        <p>Email : dl-cntt@hcmut.edu.vn</p>
        <p>ĐT (Tel.) : (84-8) 38647256 - 7200</p>

        <br />

        <p>Copyright 202525-2030 BKEL – Phát triển dựa trên Moodle</p>
      </div>

    </div>
  );
}
