import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, TrendingDown } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import axiosInstance from '@/AxiosConfig';

const EmptyRevenueChart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <TrendingDown className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Revenue Data Available</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        There's currently no revenue data to display. As you start earning, your revenue chart will appear here.
      </p>
    </div>
  );
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('days');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/admin/revenue');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const filteredData = useMemo(() => {
    if (!dashboardData || !dashboardData.revenue) return [];

    const endDate = moment();
    let startDate;

    switch (selectedFilter) {
      case 'days':
        startDate = moment().subtract(7, 'days');
        break;
      case 'weeks':
        startDate = moment().subtract(4, 'weeks');
        break;
      case 'month':
        startDate = moment().subtract(1, 'month');
        break;
      case 'year':
        startDate = moment().subtract(1, 'year');
        break;
      default:
        return dashboardData.revenue;
    }

    return dashboardData.revenue.filter(item => {
      const itemDate = moment(item.date);
      return itemDate.isBetween(startDate, endDate, null, '[]');
    });
  }, [dashboardData, selectedFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  };

  const stats = dashboardData ? [
    { title: "Total Revenue", value: formatCurrency(dashboardData.totalRevenue), icon: "₹" },
    { title: "Total Courses", value: dashboardData.totalCourses, icon: "📚" },
    { title: "Total Tutors", value: dashboardData.totalTutors, icon: "👨‍🏫" },
    { title: "Total Students", value: dashboardData.totalStudents, icon: "👨‍🎓" }
  ] : [];

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      categories: filteredData.map(item => item.date),
      labels: {
        formatter: function(value) {
          return moment(value).format('DD MMM');
        }
      }
    },
    yaxis: {
      title: {
        text: 'Revenue (₹)'
      },
      labels: {
        formatter: function(value) {
          return formatCurrency(value);
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      },
      y: {
        formatter: function(value) {
          return formatCurrency(value);
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    colors: ['#4F46E5']
  };

  const series = [{
    name: 'Revenue',
    data: filteredData.map(item => item.revenue)
  }];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeItem="Dashboard"/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button className="md:hidden p-2 rounded-md hover:bg-gray-200" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="text-3xl mr-4">{stat.icon}</div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h2>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <div className="flex space-x-2">
                {['days', 'weeks', 'month', 'year'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px]">
              {filteredData.length > 0 ? (
                <ReactApexChart options={chartOptions} series={series} type="area" height={350} />
              ) : (
                <EmptyRevenueChart />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

