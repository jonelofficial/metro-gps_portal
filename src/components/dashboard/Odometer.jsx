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
const Odometer = ({ tripData }) => {
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
    // console.log(item.odometer_done);
    if (!plateNumbers[plateNumber]) {
      plateNumbers[plateNumber] = {
        plate_no: plateNumber,
        points: [...item.points],
        odo: item.odometer_done,
      };
    } else {
      plateNumbers[plateNumber].points.push(...item.points);
      plateNumbers[plateNumber].odo =
        plateNumbers[plateNumber].odo + item.odometer_done;
    }
    console.log(item.odometer_done);
    // console.log(plateNumbers[plateNumber].odo);
  });

  const obj = Object.values(plateNumbers);

  const data = {
    labels: obj?.map((item) => item.plate_no),
    datasets: [
      {
        label: "Odometer",
        data: obj.map((item) => {
          return parseFloat(item.odo).toFixed(1);
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Estimated Odometer",
        data: obj.map((item) => {
          const meter = getPathLength(item.points);
          const km = meter / 1000;
          return parseFloat(km.toFixed(1));
        }),
        backgroundColor: "rgba(78, 14, 229, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default Odometer;
