export default function UsersManagement() {
  const users = [
    { id: 1, name: "Nguyen Van A", role: "Student", dept: "Computer Science" },
    { id: 2, name: "Tran Thi B", role: "Tutor", dept: "Software Eng." },
    { id: 3, name: "Le Quang C", role: "Admin", dept: "IT Department" },
    { id: 4, name: "Pham D", role: "Staff", dept: "Academic Affairs" },
  ];

  const color = {
    Student: "bg-blue-500",
    Tutor: "bg-green-500",
    Staff: "bg-purple-500",
    Admin: "bg-red-500",
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#001A72] mb-6">User Management</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3">User</th>
              <th>Department</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-100">
                <td className="py-3 flex items-center gap-3">
                  <img src="/avatar.jpg" className="w-8 h-8 rounded-full" />
                  {u.name}
                </td>
                <td>{u.dept}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-white ${color[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-blue-600 hover:underline cursor-pointer">
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
