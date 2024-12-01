import { useState } from 'react';
import { Menu, X, Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const tutorData = useSelector((store) => store.tutor.tutorDatas);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => navigate('/tutor/profile');
  const handleLoginClick = () => navigate('/tutor');
  const handleSignUpClick = () => navigate('/tutor/signup');
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
          {tutorData ? (
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => navigate("/tutor/dashboard")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</button>
              <button onClick={() => navigate("/tutor/mycourse")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Courses</button>
              <button onClick={() => navigate("/tutor/revenue")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Revenue</button>
              <button onClick={() => navigate("/tutor/profile")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Profile</button>
              <button onClick={() => navigate("/tutor/chat")} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Chat</button>
            </nav>
          ) : null}
          <div className="hidden md:flex items-center space-x-4">
            {tutorData ? (
              <>
                
                <button 
                  className="rounded-full bg-gray-200 p-1 hover:bg-gray-300 transition-colors duration-200" 
                  onClick={handleProfileClick}
                >
                  {tutorData.profileImage ? (
                    <img 
                      src={tutorData.profileImage} 
                      alt="Profile" 
                      className="h-8 w-8 object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-600" />
                  )}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLoginClick} 
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                >
                  Log in
                </button>
                <button 
                  onClick={handleSignUpClick} 
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
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
            {tutorData ? (
              <>
                <button onClick={() => navigate("/tutor/dashboard")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Home</button>
                <button onClick={() => navigate("/tutor/mycourse")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Courses</button>
                <button onClick={() => navigate("/tutor/revenue")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Revenue</button>
                <button onClick={() => navigate("/tutor/profile")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Profile</button>
                <button onClick={() => navigate("/tutor/chat")} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">Chat</button>
              </>
            ) : null}
          </nav>
          {tutorData ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-1">
                <div className="relative mx-3 mb-3">
                  <input
                    type="text"
                    placeholder="Search Course"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button 
                  onClick={handleProfileClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left flex items-center"
                >
                  {tutorData.profileImage ? (
                    <img 
                      src={tutorData.profileImage} 
                      alt="Profile" 
                      className="h-6 w-6 object-cover rounded-full mr-2"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-600 mr-2" />
                  )}
                  <span>Profile</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-2">
              <button onClick={handleLoginClick} className="w-full px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md text-base font-medium">Log in</button>
              <button onClick={handleSignUpClick} className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-base font-medium">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

