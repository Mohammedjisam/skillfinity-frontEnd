import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TutorRevenueChart from '../../components/Courses/Tutor/TutorRevenueChart';
import axiosInstance from '@/AxiosConfig';
import TutorSidebar from './SideBar';
import { DollarSign, BookOpen, Users, ShoppingCart, Menu } from 'lucide-react';
import EmptyRevenueChart from './EmptyRevenue';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const tutorData = useSelector((store) => store.tutor.tutorDatas);
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalOrders: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('days');
  const tutorId = tutorData?._id;

  useEffect(() => {
    if (tutorId) {
      fetchDashboardData();
    }
  }, [tutorId]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/user/data/tutorrevenue/${tutorId}`);
      const { data } = response.data;
      setOverviewData({
        totalRevenue: data.totalRevenue || 0,
        totalCourses: data.totalCourses || 0,
        totalStudents: data.totalStudents || 0,
        totalOrders: data.totalOrders || 0
      });
      setRevenueData(data.revenue || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const statsCards = [
    { title: 'Total Revenue', value: formatCurrency(overviewData.totalRevenue), icon: DollarSign },
    { title: 'Total Courses', value: overviewData.totalCourses, icon: BookOpen },
    { title: 'Total Students', value: overviewData.totalStudents, icon: Users },
    { title: 'Total Orders', value: overviewData.totalOrders, icon: ShoppingCart },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <TutorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="Dashboard"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                    <item.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <div className="flex flex-wrap gap-2">
                    {['days', 'weeks', 'month', 'year'].map((period) => (
                      <button
                        key={period}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          selectedPeriod === period
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : revenueData.length > 0 ? (
                  <TutorRevenueChart data={revenueData} timeFilter={selectedPeriod} />
                ) : (
                  <EmptyRevenueChart />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

