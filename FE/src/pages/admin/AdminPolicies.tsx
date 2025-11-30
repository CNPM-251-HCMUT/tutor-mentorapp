export default function AdminPolicies() {
  const mockPolicies = [
    { id: 1, name: "Tutor Code of Conduct", desc: "Ethical guidelines for tutors", status: "Active" },
    { id: 2, name: "Attendance Rules", desc: "Required attendance for tutoring sessions", status: "Active" },
    { id: 3, name: "Student Safety Policy", desc: "Campus safety obligations", status: "Updating" },
    { id: 4, name: "Online Learning Policy", desc: "Rules for virtual sessions", status: "Inactive" },
  ];

  const statusColor = {
    Active: "bg-green-500",
    Updating: "bg-yellow-500",
    Inactive: "bg-gray-500",
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#001A72] mb-6">System Policies</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3">Policy</th>
              <th className="py-3">Description</th>
              <th className="py-3">Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {mockPolicies.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100">
                <td className="py-3 font-medium">{p.name}</td>
                <td>{p.desc}</td>
                <td>
                  <span className={`px-3 py-1 text-white rounded-full ${statusColor[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
