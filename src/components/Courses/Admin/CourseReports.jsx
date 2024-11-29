import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/AxiosConfig';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from 'lucide-react';

const CourseReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get(`/user/data/course-reports/${courseId}`);
        setReportData(response.data);
      } catch (err) {
        setError('Failed to fetch course reports');
        console.error('Error fetching course reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  }

  if (!reportData) {
    return <div className="flex justify-center items-center h-64">No reports found</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Course Reports: {reportData.courseTitle}
        </CardTitle>
        <Badge variant="secondary" className="mt-2">
          Total Reports: {reportData.totalReports}
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Reported At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div>{report.userName}</div>
                  <div className="text-sm text-gray-500">{report.userEmail}</div>
                </TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>{report.comment}</TableCell>
                <TableCell>{new Date(report.reportedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CourseReports;
