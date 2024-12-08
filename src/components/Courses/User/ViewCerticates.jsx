import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../AxiosConfig'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Skeleton } from "../../../components/ui/skeleton"
import { Award, Calendar, Menu, BookOpen, GraduationCap, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../../../pages/User/Sidebar'
import { Button } from "../../../components/ui/button"
import { useNavigate } from 'react-router-dom'

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const userData = useSelector((store) => store.user.userDatas)
  const navigate = useNavigate()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    fetchCertificates(currentPage)
  }, [userData._id, currentPage])

  const fetchCertificates = async (page) => {
    if (!userData._id) {
      console.error('User ID is undefined')
      setError('User ID is missing. Please log in again.')
      setLoading(false)
      return
    }

    try {
      const response = await axiosInstance.get(`/user/data/usercertificates/${userData._id}?page=${page}`)
      if (response.data.certificates.length === 0) {
        setError('no_certificates')
      } else {
        setCertificates(response.data.certificates)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching certificates:', error.response?.data || error.message)
      setError('fetch_failed')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const NoCertificates = () => (
    <Card className="w-full bg-white shadow-lg border-none">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Ready to Earn Your First Certificate?
        </CardTitle>
        <CardDescription className="text-base">
          Complete these steps to earn your certificate
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">1. Complete Course Content</h3>
              <p className="text-sm text-gray-500">Watch all lessons and complete the course materials</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">2. Take the Quiz</h3>
              <p className="text-sm text-gray-500">Complete the course quiz to test your knowledge</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">3. Score 90% or Higher</h3>
              <p className="text-sm text-gray-500">Achieve a score of 90% or higher to earn your certificate</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-600">
          <p>You haven't achieved any certificates yet. Participate in the quiz and complete the course to earn your completion certificate!</p>
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate('/courses')} size="lg" className="w-full sm:w-auto">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </CardContent>
    </Card>
  )
  
  const renderCertificates = () => {
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

    if (error === 'fetch_failed') {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <div className="font-bold text-lg mb-2">No Certificates</div>
          <div className="text-base">
            You did not achieve any certificates. First, complete the lessons, 
            attend the quizzes, and achieve at least 90% marks to earn the course 
            completion certificate.
          </div>
        </div>
      )
    }

    if (error === 'no_certificates') {
      return <NoCertificates />
    }

    return (
      <div className="space-y-4">
        {certificates.map((certificate) => (
          <Card key={certificate._id} className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                {certificate.courseId.coursetitle}
              </CardTitle>
              <CardDescription className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Issued on: {formatDate(certificate.issuedDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Tutor: {certificate.courseId.tutor.name}</p>
              <p className="text-gray-700">Score: {certificate.quizScorePercentage.toFixed(2)}%</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant="secondary">
                Certificate ID: {certificate._id.slice(0, 6)}%@#$&{certificate._id.slice(-2)}
              </Badge>
              <div className="space-x-2">
                <Button onClick={() => navigate(`/certificate/${certificate.courseId._id}`)}>
                  View Certificate
                </Button>
              </div>
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="Certifications" />
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
            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Certificates</h1>
            {renderCertificates()}
            {!loading && !error && <Pagination />}
          </div>
        </main>
      </div>
    </div>
  )
}

