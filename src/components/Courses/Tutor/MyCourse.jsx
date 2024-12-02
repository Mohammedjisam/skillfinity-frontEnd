import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Menu, ChevronLeft, ChevronRight, BookOpen, Sparkles, GraduationCap, Tag, BarChart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SideBar from "../../../pages/Tutor/SideBar";
import axiosInstance from "../../../AxiosConfig";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { useSelector } from "react-redux";

// Add custom font imports
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const MyCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const tutorData = useSelector((store) => store.tutor.tutorDatas);
  const itemsPerPage = 9; // Changed to 9 for 3x3 grid

  useEffect(() => {
    fetchCourses();
  }, [currentPage, tutorData._id]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/tutor/course/viewcourse/${tutorData._id}?page=${currentPage}&limit=${itemsPerPage}`
      );
      setCourses(response.data.courses);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/tutor/editcourse/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    const { showConfirmation } = ConfirmationDialog({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonText: "Yes, delete it!",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/tutor/course/viewcourse/`, {
            params: {
              tutorId: tutorData._id,
              courseId,
            },
          });
          toast.success("Course deleted successfully");
          fetchCourses();
        } catch (error) {
          console.error("Error deleting course:", error);
          toast.error("Failed to delete course");
        }
      },
    });

    showConfirmation();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors
            ${currentPage === i 
              ? "bg-gray-900 text-white rounded-full" 
              : "text-gray-700 hover:bg-gray-100 rounded-full"}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="Courses"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-lg z-10">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <span className="bg-gradient-to-r from-gray-600 to-indigo-800 text-transparent bg-clip-text">
                My Courses
              </span>
            </h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading courses... ⌛</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-xl border border-gray-200">
                <BookOpen className="mx-auto h-16 w-16 text-indigo-500" />
                <h3 className="mt-4 text-xl font-bold text-gray-900">No courses yet 📚</h3>
                <p className="mt-2 text-gray-600">Get started by creating your first course!</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/tutor/addcourse')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform transition hover:-translate-y-0.5"
                  >
                    <Pencil className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create New Course ✨
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={course.thumbnail || "/placeholder-course.png"}
                        alt={course.coursetitle}
                        className="w-full h-full object-cover transform transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                        {course.coursetitle}
                      </h3>
                      <div className="space-y-3 mb-6">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">Category: {course.category?.title}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <BarChart className="w-5 h-5 text-orange-600" />
                          <span className="font-medium">Difficulty: {course.difficulty}</span>
                        </p>
                        <p className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                          💰 ₹{course.price}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(course._id)}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && courses.length > 0 && (
              <div className="mt-12 mb-6">
                <div className="text-base text-gray-700 text-center mb-6 font-medium">
                  Page {currentPage} of {totalPages} • Showing {itemsPerPage} items per page
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center justify-center w-12 h-12 text-sm font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md
                          ${currentPage === index + 1
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-2 border-transparent"
                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyCourses;

