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
const Consumption = ({ tripData }) => {
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
        kmpl: item.vehicle_id.km_per_liter,
      };
    } else {
      plateNumbers[plateNumber].points.push(...item.points);
    }
  });

  const obj = Object.values(plateNumbers);

  const data = {
    labels: obj?.map((item) => item.plate_no),
    datasets: [
      {
        label: "Fuel Liter",
        data: obj.map((item) => {
          const km = getPathLength(item.points) / 1000;

          return parseFloat(km / item.kmpl).toFixed(1);
        }),
        backgroundColor: "rgba(255, 0, 0, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default Consumption;
