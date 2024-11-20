import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  UserCircle, 
  BookOpen, 
  DollarSign, 
  MessageSquare, 
  LogOut, 
  X, 
  PlusCircle 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutTutor } from '@/redux/slice/TutorSlice'
import { toast } from 'sonner'
import axiosInstance from '@/AxiosConfig'
import Swal from 'sweetalert2'

const ConfirmationDialog = ({
  title,
  text,
  icon,
  confirmButtonText,
  onConfirm
}) => {
  const showConfirmation = () => {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return { showConfirmation };
};

const SideBar = ({ isOpen, onClose, activeItem = 'Profile' }) => {
  const tutorData = useSelector((store) => store.tutor.tutorDatas)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNavigation = (path) => {
    navigate(path)
    onClose?.()
  }

  const handleLogout = async () => {
    const { showConfirmation } = ConfirmationDialog({
      title: "Logout Confirmation",
      text: "Are you sure you want to log out?",
      icon: "warning",
      confirmButtonText: "Yes, log out",
      onConfirm: async () => {
        try {
          await axiosInstance.post('/tutor/logout');
          dispatch(logoutTutor());
          navigate("/");
          onClose?.();
          toast.success('Logged out successfully!');
        } catch (error) {
          // Handle any errors that occur during the API call
          console.error("Error during logout:", error);
          toast.error('Logout failed. Please try again.');
        }
      }
    });
  
    showConfirmation();
  };
  

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/tutor/dashboard' },
    { name: 'Profile', icon: UserCircle, path: '/tutor/profile' },
    { name: 'Courses', icon: BookOpen, path: '/tutor/mycourse' },
    { name: 'Revenue', icon: DollarSign, path: '/tutor/dashboard' },
    { name: 'Chat & Video', icon: MessageSquare, path: '/tutor/chat' },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white shadow-lg flex flex-col`}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center p-4 lg:hidden">
          <span className="font-bold text-xl text-gray-800">Menu</span>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Profile section */}
        <div className="flex flex-col items-center p-6 border-b border-gray-100">
          <div className="relative">
            <img
              src={tutorData?.profileImage || "/tutoravatar.png?height=96&width=96"}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md object-cover"
            />
          </div>
          <span className="mt-4 text-sm text-gray-600 text-center break-all">
            {tutorData?.email || 'No email available'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-150 ${
                  activeItem === item.name
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 mt-4 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
          {/* Add Course Button */}
          <button
            onClick={() => handleNavigation('/tutor/addcourse')}
            className="flex items-center w-full p-3 mt-6 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-3" />
            <span className="font-medium">Add new course</span>
          </button>
        </nav>
      </div>
    </>
  )
}

export default SideBar