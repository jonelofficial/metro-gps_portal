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
    const odo = item?.odometer_done - item?.odometer;
    if (!plateNumbers[plateNumber]) {
      plateNumbers[plateNumber] = {
        plate_no: plateNumber,
        points: [...item.points],
        odo: odo,
      };
    } else {
      plateNumbers[plateNumber].points.push(...item.points);
      plateNumbers[plateNumber].odo = plateNumbers[plateNumber].odo + odo;
    }
  });

  const combinedData = Object.values(plateNumbers);

  const data = {
    labels: combinedData?.map((item) => item.plate_no),
    datasets: [
      {
        label: "Odometer KM",
        data: combinedData.map((item) => {
          return parseFloat(item.odo).toFixed(1);
        }),
        backgroundColor: "rgba(255, 0, 0, 0.5)",
      },
      {
        label: "Estimated Odo KM",
        data: combinedData?.map((item) => {
          const meter = getPathLength(item.points);
          const km = meter / 1000;
          return parseFloat(km.toFixed(1));
        }),
        backgroundColor: "rgba(255, 120, 36, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default DailyTravelKilometerRun;
