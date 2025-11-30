export default function StaffDashboard() {
  return (
    <div className="p-8">

      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#08296F]">
        Staff Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-6 mt-6">

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Tutors in System</p>
          <h2 className="text-3xl font-bold mt-2">124</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Students Supported</p>
          <h2 className="text-3xl font-bold mt-2">342</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Sessions Completed</p>
          <h2 className="text-3xl font-bold mt-2">895</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Reports Awaiting Review</p>
          <h2 className="text-3xl font-bold mt-2">17</h2>
        </div>

      </div>

      {/* Reporting Section */}
      <div className="bg-white rounded-xl shadow border p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-[#08296F]">
          Reporting Tools
        </h2>

        <div className="flex gap-6">
          <button className="px-5 py-2 bg-[#1488DB] text-white rounded-lg">
            View Tutor Reports
          </button>
          <button className="px-5 py-2 bg-[#1488DB] text-white rounded-lg">
            View Student Progress
          </button>
          <button className="px-5 py-2 bg-[#1488DB] text-white rounded-lg">
            Export Reports
          </button>
        </div>
      </div>

      {/* Monitoring */}
      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-5 border rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-[#8E0000]">
            Tutors Missing Reports
          </h3>
          <p className="text-gray-600">5 tutors have not submitted this week.</p>
        </div>

        <div className="bg-white p-5 border rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-[#8E0000]">
            Students Frequently Absent
          </h3>
          <p className="text-gray-600">9 students flagged.</p>
        </div>

        <div className="bg-white p-5 border rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-[#8E0000]">
            Pending Validations
          </h3>
          <p className="text-gray-600">12 items require confirmation.</p>
        </div>

      </div>

    </div>
  );
}
