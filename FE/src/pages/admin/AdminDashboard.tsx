import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  return (
    <div className="p-6">
      
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Users" value="6,230" color="blue" />
        <StatCard label="Total Tutors" value="482" color="green" />
        <StatCard label="Active Classes" value="128" color="purple" />
        <StatCard label="Pending Feedback" value="23" color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Tutor Registration Growth</h2>
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Tutors",
                  data: [12, 19, 25, 40, 55, 70],
                  borderColor: "#2563eb",
                  backgroundColor: "rgba(37, 99, 235, 0.3)",
                },
              ],
            }}
          />
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Class Distribution</h2>
          <Pie
            data={{
              labels: ["Math", "Physics", "Chemistry", "IT"],
              datasets: [
                {
                  data: [30, 25, 20, 25],
                  backgroundColor: ["#3b82f6", "#22c55e", "#f97316", "#a855f7"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      <span className="text-gray-600">{label}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
      <div className={`w-10 h-1 mt-3 rounded ${colors[color]}`}></div>
    </div>
  );
}
