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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailyTravelDuration = ({ tripData, date }) => {
  const options = {
    responsive: true,
  };

  const filteredData = tripData?.data.filter((item) => {
    return dayjs(item.createdAt).format("MMM-DD-YY") == date;
  });

  let plateNos = {};

  filteredData.forEach((trip, index) => {
    const newLocations = trip?.locations.filter(
      (location) => location.status == "left" || location.status == "arrived"
    );
    let plateNo = trip.vehicle_id.plate_no;
    if (!plateNos[plateNo]) {
      plateNos[plateNo] = {
        totalDuration: 0,
        // locations: [],
        plate_no: plateNo,
      };
    }

    const startDate = dayjs(newLocations[0].date);
    const endDate = dayjs(newLocations[newLocations.length - 1].date);
    const duration = endDate.diff(startDate);
    plateNos[plateNo].totalDuration += duration;
    // plateNos[plateNo].locations.push(location);
  });

  const obj = Object.values(plateNos);

  const data = {
    labels: obj?.map((item) => item.plate_no),
    datasets: [
      {
        label: "Hours",
        data: obj.map((item) => {
          let totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
          let hours = Math.floor(totalMinutes / 60);
          return hours;
        }),
        backgroundColor: "rgba(255, 0, 0, 0.5)",
      },
      {
        label: "Minutes",
        data: obj.map((item) => {
          let totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
          let minutes = totalMinutes % 60;
          return minutes;
        }),
        backgroundColor: "rgba(255, 120, 36, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default DailyTravelDuration;
