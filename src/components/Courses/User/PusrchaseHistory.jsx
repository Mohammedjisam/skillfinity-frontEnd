import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '@/AxiosConfig'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingBag, Calendar, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../../../pages/User/Sidebar'
import { Button } from "@/components/ui/button"

export default function PurchaseHistory() {
  const [orderHistory, setOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const userData = useSelector((store) => store.user.userDatas)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    fetchOrderHistory(currentPage)
  }, [userData._id, currentPage])

  const fetchOrderHistory = async (page) => {
    if (!userData._id) {
      console.error('User ID is undefined')
      setError('User ID is missing. Please log in again.')
      setLoading(false)
      return
    }

    try {
      const response = await axiosInstance.get(`/user/data/orderhistory/${userData._id}?page=${page}`)
      setOrderHistory(response.data.orderHistory)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching order history:', error.response?.data || error.message)
      setError('Failed to fetch order history. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const renderOrderHistory = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>
    }

    if (orderHistory.length === 0) {
      return <p className="text-center text-gray-600">You haven't made any purchases yet.</p>
    }

    return (
      <div className="space-y-4">
        {orderHistory.map((order) => (
          <Card key={order.orderId} className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order ID: ORDR{order.orderId.slice(0, 6)}
              </CardTitle>
              <CardDescription className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(order.purchaseDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.courseName} <Badge variant="secondary">by {item.tutorName}</Badge></span>
                    <span className="font-semibold">{formatCurrency(item.price)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Items: {order.items.length}</span>
              <span className="font-bold text-lg flex items-center">
                {formatCurrency(order.totalAmount)}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        size="sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span>{currentPage} of {totalPages}</span>
      <Button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        size="sm"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="My Orders" />
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
            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>
            {renderOrderHistory()}
            {!loading && !error && orderHistory.length > 0 && <Pagination />}
          </div>
        </main>
      </div>
    </div>
  )
}

