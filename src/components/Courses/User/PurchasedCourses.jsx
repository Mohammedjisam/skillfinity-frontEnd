import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '@/AxiosConfig'
import { BookOpen, User, Tag, Clock, Menu } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from '../../../pages/User/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function PurchasedCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const userData = useSelector((store) => store.user.userDatas)
  const navigate=useNavigate()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!userData._id) {
        console.error('User ID is undefined')
        setError('User ID is missing. Please log in again.')
        setLoading(false)
        return
      }

      try {
        console.log(`Fetching purchased courses for User ID: ${userData._id}`)
        const response = await axiosInstance.get(`/user/data/buyedcourses/${userData._id}`)
        console.log("API Response:", response.data)
        const coursesWithUniqueIds = response.data.purchasedCourses.map((course, index) => ({
          ...course,
          uniqueId: `${course._id}-${index}`
        }))
        setCourses(coursesWithUniqueIds)
      } catch (error) {
        console.error('Error fetching purchased courses:', error.response?.data || error.message)
        setError('Failed to fetch purchased courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPurchasedCourses()
  }, [userData._id])

  const renderCourses = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="w-full">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>
    }

    if (courses.length === 0) {
      return <p className="text-center text-gray-600">You haven't purchased any courses yet.</p>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.uniqueId} className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">{course.coursetitle}</CardTitle>
              <CardDescription className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-1" />
                {course.tutor?.name || 'Unknown Tutor'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full mb-4 overflow-hidden rounded-md">
                <img src={course.thumbnail || "/placeholder.svg?height=200&width=300"} alt={course.coursetitle} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <Badge variant="secondary" className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {course.category?.title || 'Uncategorized'}
                </Badge>
              </div>
              <p className="text-gray-700"> Competency level : <b>{course.difficulty || 'No description available.'}</b></p>
            </CardContent>
            <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate(`/coursedetails/${course._id}`)} >
                <BookOpen className="w-4 h-4 mr-2" /> Continue Learning
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="Courses" />
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
            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Purchased Courses</h1>
            {renderCourses()}
          </div>
        </main>
      </div>
    </div>
  )
}