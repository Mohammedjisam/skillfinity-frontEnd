import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

const TutorRevenueChart = ({ data, timeFilter }) => {
  const filteredData = useMemo(() => {
    const endDate = moment();
    let startDate;

    switch (timeFilter) {
      case "days":
        startDate = moment().subtract(7, "days");
        break;
      case "weeks":
        startDate = moment().subtract(4, "weeks");
        break;
      case "month":
        startDate = moment().subtract(1, "month");
        break;
      case "year":
        startDate = moment().subtract(1, "year");
        break;
      default:
        startDate = moment(0); // Beginning of time
    }

    return data
      .filter((item) => {
        const itemDate = moment(item.date);
        return (
          itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate)
        );
      })
      .sort((a, b) => moment(a.date).diff(moment(b.date)));
  }, [data, timeFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      categories: filteredData.map((item) => item.date),
      labels: {
        formatter: function (value) {
          return moment(new Date(value)).format("DD MMM");
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatCurrency(value);
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: function (value) {
          return formatCurrency(value);
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    colors: ["#4F46E5"],
    grid: {
      borderColor: "#f1f1f1",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: filteredData.map((item) => item.revenue),
    },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tutor Revenue Chart</h3>
        <div className="h-[400px] flex items-center justify-center text-red-500">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            strokeCurrentColor
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No revenue data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Tutor Revenue Chart</h3>
      <div className="h-[400px]">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default TutorRevenueChart;
