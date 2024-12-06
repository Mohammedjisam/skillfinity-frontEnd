import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '@/AxiosConfig'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, FileText, User, Calendar, MessageCircle, AlertTriangle } from 'lucide-react'

const CourseReports = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { courseId } = useParams()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get(`/user/data/coursereports/${courseId}`)
        setReportData(response.data)
      } catch (err) {
        setError('Failed to fetch course reports')
        console.error('Error fetching course reports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [courseId])

  const getReasonColor = (reason) => {
    const colors = {
      'Inappropriate Content': 'bg-red-100 text-red-800',
      'Technical Issues': 'bg-yellow-100 text-yellow-800',
      'Outdated Information': 'bg-blue-100 text-blue-800',
      'Other': 'bg-purple-100 text-purple-800'
    }
    return colors[reason] || 'bg-gray-100 text-gray-800'
  }

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-64">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
              <p className="text-pink-500 font-medium text-lg">Loading cute reports...</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-64">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-500 font-medium text-lg">{error}</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (!reportData || reportData.reports.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-64">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <FileText className="h-12 w-12 text-teal-400" />
              <p className="text-teal-500 font-medium text-lg">No reports found for this course</p>
              <p className="text-gray-400">Everything looks perfect! 🎉</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    return reportData.reports.map((report, index) => (
      <TableRow key={report.id} className={index % 2 === 0 ? 'bg-white' : 'bg-pink-50'}>
        <TableCell className="py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{report.userName}</div>
              <div className="text-sm text-gray-500">{report.userEmail}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="py-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReasonColor(report.reason)}`}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            {report.reason}
          </span>
        </TableCell>
        <TableCell className="py-4 max-w-md">
          {report.comment ? (
            <div className="flex items-start space-x-2">
              <MessageCircle className="h-5 w-5 text-teal-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 break-words">{report.comment}</p>
            </div>
          ) : (
            <p className="text-gray-400 italic flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-gray-300" />
              No comments mentioned
            </p>
          )}
        </TableCell>
        <TableCell className="py-4 whitespace-nowrap text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>{new Date(report.reportedAt).toLocaleString()}</span>
          </div>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-pink-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 border-b-2 border-pink-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-pink-500" />
            <span className="break-words">Course Reports: {reportData?.courseTitle || 'Loading...'}</span>
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-medium border border-purple-200"
          >
            Total Reports: {reportData?.totalReports || 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="rounded-xl border-2 border-pink-200 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-pink-50 to-purple-50">
                <TableHead className="font-semibold text-gray-700 py-3">User</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3">Reason</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3">Comment</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3">Reported At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
        {reportData && reportData.reports.length <= 2 && (
          <div className="h-32 bg-gradient-to-b from-pink-50 to-purple-50 border-t-2 border-pink-200 mt-4 rounded-b-xl flex items-center justify-center">
            <p className="text-lg font-medium text-gray-600 text-center px-4">That's all the reports for now! 🌈</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CourseReports

