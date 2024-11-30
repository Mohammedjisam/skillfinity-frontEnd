import React from 'react';
import { TrendingDown } from 'lucide-react';

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

export default EmptyRevenueChart;

