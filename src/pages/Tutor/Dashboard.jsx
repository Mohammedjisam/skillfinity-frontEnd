import React, { useState, useEffect } from 'react';
import axiosInstance from '../../AxiosConfig';
import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import TutorRevenueChart from '../../components/Courses/Tutor/TutorRevenueChart';
import { Menu, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const tutorData = useSelector((store) => store.tutor.tutorDatas);
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalCourses: 0,
    totalStudents: 0
  });
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
      const response = await axiosInstance.get(`/user/data/revenue/${tutorId}`);
      setOverviewData({
        totalRevenue: response.data.totalRevenue || 0,
        totalCourses: response.data.totalCourses || 0,
        totalStudents: response.data.totalStudents || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <SideBar 
        activeItem="Dashboard" 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'Total Revenue', value: formatCurrency(overviewData.totalRevenue) },
                { title: 'Total Courses', value: overviewData.totalCourses },
                { title: 'Total Students', value: overviewData.totalStudents },
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div className="flex flex-wrap space-x-2">
                    {['days', 'weeks', 'month', 'year'].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-64 mt-4">
                    <TutorRevenueChart tutorId={tutorId} timeFilter={selectedPeriod} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

