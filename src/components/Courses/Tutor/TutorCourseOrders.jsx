import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/AxiosConfig";
import { ShoppingCart, ChevronLeft, ChevronRight, Menu, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TutorSidebar from "../../../pages/Tutor/SideBar";

export default function TutorCourseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterOption, setFilterOption] = useState("all");
  const tutorId = useSelector((state) => state.tutor.tutorDatas._id);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, tutorId, filterOption]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/tutor/courseorders/${tutorId}?page=${currentPage}&filter=${filterOption}`
      );
      const { orders, totalPages, totalRevenue, currentPage: responsePage } = response.data.data;
      setOrders(orders);
      setTotalPages(totalPages);
      setTotalRevenue(totalRevenue);
      setCurrentPage(responsePage);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? "default" : "outline"}
          className={`w-10 h-10 ${currentPage === i ? "bg-gray-900 text-white" : ""}`}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="w-full p-6">
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 max-w-md">
              You haven't received any course orders for the selected period. Try adjusting your filter or check back later.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Order #{order._id.slice(0, 8)}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <span className="font-semibold">Customer:</span>{" "}
                {order.user?.name || "N/A"} ({order.user?.email || "N/A"})
              </p>
              <div className="mt-2">
                <span className="font-semibold">Courses:</span>
                <ul className="list-disc list-inside">
                  {order.items?.map((item) => (
                    <li key={item.courseId} className="text-gray-700">
                      {item.courseName || "Unknown Course"} - ₹
                      {item.coursePrice?.toFixed(2) || "0.00"}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">Order Total:</span> ₹
                {order.totalAmount?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getFilterLabel = () => {
    switch (filterOption) {
      case 'lastDay':
        return 'Last 24 Hours';
      case 'lastWeek':
        return 'Last 7 Days';
      case 'lastMonth':
        return 'Last 30 Days';
      case 'lastYear':
        return 'Last Year';
      default:
        return 'All Time';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <TutorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="Revenue"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="py-4 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-8 px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Course Orders</h1>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Revenue ({getFilterLabel()})</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-500">
                Manage and track your course sales
              </p>
              <Select
                value={filterOption}
                onValueChange={(value) => {
                  setFilterOption(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="lastDay">Last 24 Hours</SelectItem>
                  <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                  <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderOrders()}
            
            {!loading && orders.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} • Showing 5 items per page
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  {renderPaginationNumbers()}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

