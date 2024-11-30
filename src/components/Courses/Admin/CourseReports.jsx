'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '@/AxiosConfig'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, FileText } from 'lucide-react'

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

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-64">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="text-gray-500 font-medium">Loading reports...</p>
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
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-red-500 font-medium">{error}</p>
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
              <FileText className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 font-medium">No reports found for this course</p>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    return reportData.reports.map((report, index) => (
      <TableRow key={report.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <TableCell className="py-4">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{report.userName}</div>
            <div className="text-sm text-gray-500">{report.userEmail}</div>
          </div>
        </TableCell>
        <TableCell className="py-4">
          <span className="inline-flex px-2 py-1 rounded-full text-sm  text-gray-800">
            {report.reason}
          </span>
        </TableCell>
        <TableCell className="py-4 max-w-md">
          {report.comment ? (
            <p className="text-gray-700 break-words">{report.comment}</p>
          ) : (
            <p className="text-gray-400 italic">No comments mentioned</p>
          )}
        </TableCell>
        <TableCell className="py-4 whitespace-nowrap text-gray-500">
          {new Date(report.reportedAt).toLocaleString()}
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Course Reports: {reportData?.courseTitle || 'Loading...'}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-gray-200 text-gray-700 px-3 py-1 text-sm font-medium"
          >
            Total Reports: {reportData?.totalReports || 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
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
          <div className="h-32 bg-gray-50 border-t border-gray-200 mt-4 rounded-b-lg"></div>
        )}
      </CardContent>
    </Card>
  )
}

export default CourseReports

