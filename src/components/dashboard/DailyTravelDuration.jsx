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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailyTravelDuration = ({ vehicleData, tripData }) => {
  // GRAPH

  const options = {
    responsive: true,
  };

  const labels = tripData?.data.map((item) => {
    return item.vehicle_id.plate_no;
  });

  const filteredLabels = [...new Set(labels.map((item) => item))];

  const data = {
    labels: filteredLabels,
    datasets: [
      {
        label: "Duration",
        // data: tripData?.data.map((item) => item.trip_date),
        data: filteredLabels?.map(() => 123),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default DailyTravelDuration;
