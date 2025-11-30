// FE/src/pages/staff/ReportsPage.tsx
import { useState } from "react";

export default function ReportsPage() {
  const [filter, setFilter] = useState("attendance");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0B1F6B] mb-6">
        Reports & Analytics
      </h1>

      {/* FILTER BAR */}
      <div className="bg-white shadow-md rounded-xl p-4 flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="attendance">Attendance Report</option>
          <option value="summary">Session Summary</option>
          <option value="performance">Tutor Performance</option>
          <option value="activity">Class Activity</option>
        </select>

        <input type="date" className="border rounded-lg px-3 py-2" />
        <input type="date" className="border rounded-lg px-3 py-2" />

        <button className="px-4 py-2 bg-[#1488DB] text-white rounded-lg">
          Export CSV
        </button>
        <button className="px-4 py-2 bg-[#0B1F6B] text-white rounded-lg">
          Export PDF
        </button>
      </div>

      {/* REPORT TABLE (MOCKUP) */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          {filter === "attendance" && "Student Attendance Report"}
          {filter === "summary" && "Session Summary Report"}
          {filter === "performance" && "Tutor Performance Overview"}
          {filter === "activity" && "Class Activity Report"}
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#EFF5FF] text-left">
              <th className="p-3">Student</th>
              <th className="p-3">Tutor</th>
              <th className="p-3">Class</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((n) => (
              <tr key={n} className="border-b">
                <td className="p-3">Nguyen Van {n}</td>
                <td className="p-3">Tutor {n}</td>
                <td className="p-3">Math {n}01</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                    Present
                  </span>
                </td>
                <td className="p-3">2025-02-{10 + n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
