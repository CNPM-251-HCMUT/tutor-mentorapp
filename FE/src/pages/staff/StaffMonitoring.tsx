// FE/src/pages/staff/MonitoringPage.tsx

export default function MonitoringPage() {
  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-[#0B1F6B] mb-6">
        Live Monitoring Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500 text-sm">Active Classes</p>
          <p className="text-3xl font-bold mt-2 text-[#0B1F6B]">14</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500 text-sm">Students Online</p>
          <p className="text-3xl font-bold mt-2 text-green-600">87</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500 text-sm">Tutors Online</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">15</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500 text-sm">Late / Absent Rate</p>
          <p className="text-3xl font-bold mt-2 text-red-500">12%</p>
        </div>
      </div>

      {/* CHART MOCKUP */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Attendance Trend</h2>
        <div className="w-full h-64 bg-[#EEF3FF] rounded-lg flex items-end gap-2 p-4">

          {[40, 60, 80, 30, 95, 70, 50].map((h, i) => (
            <div
              key={i}
              className="bg-[#1488DB] rounded-t-lg"
              style={{ height: `${h}%`, width: "14%" }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* TIMELINE MOCKUP */}
      <div className="bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-semibold text-[#0A3A75] mb-4">
          Today's Sessions Timeline
        </h2>

        <div className="grid grid-cols-12 gap-2">
          {[2,4,7,10].map((col) => (
            <div
              style={{ gridColumn: `span 2` }}
              className="bg-blue-200 rounded-lg p-3"
            >
              <p className="font-medium">Math 1</p>
              <p className="text-sm text-gray-600">Tutor: Tran B</p>
              <p className="text-sm text-gray-600">Student: Nguyen A</p>
            </div>
          ))}
        </div>
      </div>

      {/* ALERT TABLE */}
      <div className="bg-white rounded-xl shadow p-6 mt-10">
        <h2 className="text-xl font-semibold text-[#0A3A75] mb-4">
          Alerts & Warnings
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Type</th>
              <th>Description</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2 text-red-600 font-bold">Warning</td>
              <td>Student absent for 2 consecutive sessions</td>
              <td>09:20 AM</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2 text-yellow-600 font-bold">Notice</td>
              <td>Tutor was late by 10 minutes</td>
              <td>10:45 AM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
