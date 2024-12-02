import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, X, Search } from 'lucide-react';
import AdminSidebar from "./AdminSidebar";
import { logoutTutor } from "@/redux/slice/TutorSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "@/AxiosConfig";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function TutorManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTutors();
  }, [currentPage, searchTerm]);

  const fetchTutors = async () => {
    try {
      const response = await axiosInstance.get("/admin/tutors", {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
      });
      setIsLoading(false);
      setTutors(response.data.tutors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  async function handleList(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to unblock this tutor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/admin/listtutor/${id}`, {
          withCredentials: true,
        });
        fetchTutors();
        Swal.fire("Unblocked!", "The tutor has been unblocked.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to unblock the tutor.", "error");
      }
    }
  }

  async function handleUnlist(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to block this tutor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, block!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/admin/unlisttutor/${id}`, {
          withCredentials: true,
        });
        fetchTutors();
        dispatch(logoutTutor());
        Swal.fire("Blocked!", "The tutor has been blocked.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to block the tutor.", "error");
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold">Tutor Management</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      <div className="flex flex-1">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-6 hidden md:block">Tutors</h1>

          <div className="mb-4 relative w-64">
            <Input
              type="text"
              placeholder="Search tutors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          {tutors.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Tutors Found</h2>
              <p className="text-gray-600">There are currently no tutors registered in the system.</p>
            </div>
          ) : (
            <>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sl. No.
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutor_ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutor Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutor Mail
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses Taken
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tutors.map((tutor, index) => (
                        <tr
                          key={tutor._id}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {tutor.user_id}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {tutor.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {tutor.email}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {typeof tutor.coursesTaken === "number"
                              ? tutor.coursesTaken > 0
                                ? `${tutor.coursesTaken} Course${
                                    tutor.coursesTaken > 1 ? "s" : ""
                                  }`
                                : "No Courses"
                              : "No Courses"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {tutor.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium">
                            <button
                              className={`text-white px-4 py-2 rounded-md hover:opacity-90 transition duration-300 ${
                                tutor.isActive ? "bg-red-600" : "bg-blue-600"
                              }`}
                              onClick={() =>
                                tutor.isActive
                                  ? handleUnlist(tutor._id)
                                  : handleList(tutor._id)
                              }
                              style={{ width: "80px" }}
                            >
                              {tutor.isActive ? "Block" : "Unblock"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 rounded text-sm ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 text-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

