import { useState } from 'react';
import { Home, List, Users, ShoppingCart, UserCheck, BookOpen, LogOut, PlusCircle, X } from 'lucide-react';
import { logoutAdmin } from '../../redux/slice/AdminSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import axiosInstance from '@/AxiosConfig';

const AdminSidebar = ({  isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path, itemName) => {
    setActiveItem(itemName);
    navigate(path);
    if (onClose) onClose();
  };

  const { showConfirmation } = ConfirmationDialog({
    title: "Are you sure?",
    text: "You will be logged out of the admin panel.",
    icon: "warning",
    confirmButtonText: "Yes, log out",
    onConfirm: async () => {
      try {
      await axiosInstance.post('/admin/logout');
      dispatch(logoutAdmin())
      navigate("/")
      toast.success('Logged out successfully!')
    }catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error during logout:", error);
      toast.error('Logout failed. Please try again.');
    }
  }
  });

  const handleLogout = () => {
    showConfirmation();
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: 'Category', icon: List, path: '/admin/category' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Tutors', icon: UserCheck, path: '/admin/tutors' },
    { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
  ];

  return (
    <div 
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30 bg-white shadow-lg w-64 p-4 flex flex-col`}
    >
      <div className="flex justify-between items-center lg:hidden mb-4">
        <span className="font-bold text-xl">Admin Menu</span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-2 overflow-hidden">
          <img
            src="/adminprofile.png"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm text-gray-600">admin@gmail.com</span>
      </div>
      <nav className="flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path, item.name)}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
              activeItem === item.name
                ? 'bg-gray-200 text-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 mb-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
      <button 
        onClick={() => handleNavigation('/admin/addcategory', 'Add Category')}
        className="flex items-center justify-center w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add new category
      </button>
    </div>
  );
};

export default AdminSidebar;