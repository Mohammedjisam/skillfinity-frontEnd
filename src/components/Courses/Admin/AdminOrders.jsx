import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/AxiosConfig";
import { ShoppingCart, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSidebar from "../../../pages/Admin/AdminSideBar";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterOption, setFilterOption] = useState("all");
  const ordersPerPage = 4;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    filterOrders();
  }, [orders, filterOption]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/admin/orders?page=${currentPage}&limit=${ordersPerPage}`
      );
      setOrders(response.data.purchases || []);
      setTotalPages(
        Math.max(1, Math.ceil((response.data.total || 0) / ordersPerPage))
      );
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    const now = new Date();
    let filtered = [];

    switch (filterOption) {
      case "lastDay":
        filtered = orders.filter(
          (order) =>
            new Date(order.createdAt) >= new Date(now - 24 * 60 * 60 * 1000)
        );
        break;
      case "lastWeek":
        filtered = orders.filter(
          (order) =>
            new Date(order.createdAt) >= new Date(now - 7 * 24 * 60 * 60 * 1000)
        );
        break;
      case "lastMonth":
        filtered = orders.filter(
          (order) =>
            new Date(order.createdAt) >=
            new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        );
        break;
      case "lastYear":
        filtered = orders.filter(
          (order) =>
            new Date(order.createdAt) >=
            new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        );
        break;
      default:
        filtered = orders;
    }

    setFilteredOrders(filtered);
    calculateTotalRevenue(filtered);
  };

  const calculateTotalRevenue = (ordersToCalculate) => {
    const revenue = ordersToCalculate.reduce(
      (total, order) =>
        total +
        (order.items?.reduce(
          (subTotal, item) => subTotal + (item.courseId?.price || 0),
          0
        ) || 0),
      0
    );
    setTotalRevenue(revenue);
  };

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="w-full">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }

    if (filteredOrders.length === 0) {
      return <p className="text-center text-gray-600">No orders found.</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map((order) => (
          <Card
            key={order._id}
            className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
               Order #{order._id.slice(0, 8)}*%$@# 
              </CardTitle>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <span className="font-semibold">Customer:</span>{" "}
                {order.userId?.name || "N/A"} ({order.userId?.email || "N/A"})
              </p>
              <div className="mt-2">
                <span className="font-semibold">Courses:</span>
                <ul className="list-disc list-inside">
                  {order.items?.map((item) => (
                    <li key={item._id}>
                      {item.courseId?.coursetitle || "Unknown Course"} - $
                      {item.courseId?.price || 0}
                    </li>
                  )) || <li>No courses</li>}
                </ul>
              </div>
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">Total:</span> $
                {order.items?.reduce(
                  (total, item) => total + (item.courseId?.price || 0),
                  0
                ) || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} • Showing{" "}
          {Math.min(filteredOrders.length, ordersPerPage)} items per page
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <Button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                variant={currentPage === pageNumber ? "default" : "outline"}
                className="px-3 py-1"
              >
                {pageNumber}
              </Button>
            );
          })}
          {totalPages > 5 && <span className="px-2">...</span>}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem="Orders"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">View Orders</h1>
              <div className="text-xl font-semibold text-gray-700">
                Total Revenue: ${totalRevenue.toFixed(2)}
              </div>
            </div>
            <div className="mb-6">
              <Select
                value={filterOption}
                onValueChange={(value) => {
                  setFilterOption(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] bg-gray-200 border-none">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent className="bg-pink-50 border-none">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="lastDay">Last 24 Hours</SelectItem>
                  <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                  <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderOrders()}
            {renderPagination()}
          </div>
        </main>
      </div>
    </div>
  );
}

