import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import { getPathLength } from "geolib";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailyTravelKilometerRun = ({ tripData }) => {
  const options = {
    responsive: true,
  };

  const filteredData = tripData?.data.filter((item) => {
    return (
      dayjs(item.createdAt).format("MMM-DD-YY") == dayjs().format("MMM-DD-YY")
    );
  });

  const plateNumbers = {};
  filteredData?.forEach((item) => {
    const plateNumber = item.vehicle_id.plate_no;
    if (!plateNumbers[plateNumber]) {
      plateNumbers[plateNumber] = {
        plate_no: plateNumber,
        points: [...item.points],
      };
    } else {
      plateNumbers[plateNumber].points.push(...item.points);
    }
  });

  const combinedData = Object.values(plateNumbers);

  const data = {
    labels: combinedData?.map((item) => item.plate_no),
    datasets: [
      {
        label: "KM",
        data: combinedData?.map((item) => {
          const meter = getPathLength(item.points);
          const km = meter / 1000;
          return parseFloat(km.toFixed(1));
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default DailyTravelKilometerRun;
