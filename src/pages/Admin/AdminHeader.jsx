import { useState } from 'react';
import { Menu, X, Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const adminData = useSelector((store) => store.admin.adminDatas);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/admin/dashboard');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="font-sans bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/logo-black-Photoroom.svg?height=60&width=60"
              alt="Skillfinity Logo"
              className="h-10 w-auto"
            />
          </div>
          {adminData ? (
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => navigate("/admin/dashboard")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</button>
              <button onClick={() => navigate("/admin/category")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Categories</button>
              <button onClick={() => navigate("/admin/courses")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Courses</button>
              <button onClick={() => navigate("/admin/students")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Students</button>
              <button onClick={() => navigate("/admin/tutors")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Tutors</button>
            </nav>
          ) : null}
          <div className="hidden md:flex items-center space-x-4">
            {adminData ? (
              <>
                
                <button 
                  className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 transition-colors duration-200" 
                  onClick={handleProfileClick}
                >
                  <User className="h-5 w-5 text-gray-600" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate("/admin/login")} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium"
              >
                Log in
              </button>
            )}
          </div>
          <button 
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => navigate("/admin/dashboard")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Home</button>
            <button onClick={() => navigate("/admin/category")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Categories</button>
            <button onClick={() => navigate("/admin/courses")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Courses</button>
            <button onClick={() => navigate("/admin/students")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Students</button>
            <button onClick={() => navigate("/admin/tutors")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Tutors</button>
          </nav>
          {adminData && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-1">
                <div className="relative mx-3 mb-3">
                  <input
                    type="text"
                    placeholder="Search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button 
                  onClick={handleProfileClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
                >
                  Profile
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

