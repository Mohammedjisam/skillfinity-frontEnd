import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../AxiosConfig';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from 'lucide-react';
import moment from 'moment';

const TutorRevenueChart = ({ tutorId, timeFilter }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, [tutorId]);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/user/data/revenue/${tutorId}`);
      const { revenue } = response.data;
      setChartData(revenue);
      console.log(response)
    } catch (err) {
      setError('Failed to fetch revenue data. Please try again later.');
      console.error('Error fetching revenue data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = (data, filter) => {
    const endDate = moment();
    let startDate;

    switch (filter) {
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
        return data;
    }

    return data.filter(item => {
      const itemDate = moment(item.date);
      return itemDate.isBetween(startDate, endDate, null, '[]');
    });
  };

  const filteredData = filterData(chartData, timeFilter);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Tutor Revenue Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorRevenueChart;

