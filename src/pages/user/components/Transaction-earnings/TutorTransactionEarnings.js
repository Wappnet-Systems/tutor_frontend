import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import { transactionService } from "../../service/transaction.service";

const TutorTransactionEarnings = () => {
  const [transactionEarnings, setTransactionEarnings] = useState([]);
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Get the current month's index (0 to 11)
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);

  const generateDayLabels = () => {
    const days = daysInMonth[selectedMonth];
    return Array.from({ length: days }, (_, index) => index + 1);
  };

  const generateDefaultDateRange = (monthIndex) => {
    const year = new Date().getFullYear();
    const month = monthIndex;
    const startDay = "01";
    const endDay = daysInMonth[month].toString().padStart(2, "0"); // Ensure 2-digit day
    return {
      from_date: `${year}-${month + 1}-${startDay}`,
      to_date: `${year}-${month + 1}-${endDay}`
    };
  };

  useEffect(() => {
    // Initialize the date range when the component first loads
    const defaultDateRange = generateDefaultDateRange(selectedMonth);

    transactionService
      .getTransactionEarnings(
        defaultDateRange.from_date,
        defaultDateRange.to_date
      )
      .then((res) => {
        setTransactionEarnings(res?.data?.data);
      });
  }, [selectedMonth]);

  const handleMonthSelect = (selectedOption) => {
    setSelectedMonth(selectedOption.value);
  };

  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "Jun" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
  const maxEarning = Math.max(
    ...transactionEarnings.map((earning) => earning.amount),
    0
  );

  const options = {
    chart: {
      id: "basic-line",
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: generateDayLabels()
    },
    yaxis: {
      min: 0,
      max: maxEarning, // Add a buffer to make the chart look better
      labels: {
        formatter: (value) => `$${value.toFixed(1)}`
      }
    },
    markers: {
      size: 3 // Marker size
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      width: 1,
      dashArray: 0
    }
  };

  const generateDataForMonth = (month) => {
    const days = daysInMonth[month];
    const data = new Array(days).fill(0);

    transactionEarnings.forEach((earning) => {
      const earningDay = new Date(earning.date).getDate();
      if (earningDay <= days) {
        data[earningDay - 1] = earning.amount;
      }
    });

    return data;
  };

  const series = [
    {
      name: "Series 1",
      data: generateDataForMonth(selectedMonth)
    }
  ];

  return (
    <div className="tu-boxwrapper">
      <div className="tu-boxarea">
        <div className="tu-boxsm ">
          <div className="tu-boxsmtitle d-flex">
            <h4>Earning history</h4>
            <div className="d-flex ">
              <Select
                placeholder="Select Month"
                options={monthOptions}
                onChange={handleMonthSelect}
                defaultValue={monthOptions[currentMonthIndex]}
              />
            </div>
          </div>
        </div>
        <div className="tu-box">
          <div className="line-chart w-100">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorTransactionEarnings;
