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

const DailyUserDuration = ({ tripData }) => {
  const options = {
    responsive: true,
  };

  // COMPUTE ALL DURATION
  const filteredData = tripData?.data.filter((item) => {
    return (
      dayjs(item.createdAt).format("MMM-DD-YY") == dayjs().format("MMM-DD-YY")
    );
  });

  let users = {};

  filteredData?.forEach((trip, index) => {
    let user = trip.user_id.first_name;
    if (!users[user]) {
      users[user] = {
        totalDuration: 0,
        user_id: user,
      };
    }
    const startDate = dayjs(trip.locations[0].date);
    const endDate = dayjs(trip.locations[trip.locations.length - 1].date);
    const duration = endDate.diff(startDate);
    users[user].totalDuration += duration;
  });

  const obj = Object.values(users);
  console.log(obj);
  // ENDS

  const data = {
    labels: obj?.map((item) => item.user_id),
    datasets: [
      {
        label: "Hours",
        data: obj.map((item) => {
          let totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
          let hours = Math.floor(totalMinutes / 60);
          return hours;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Minutes",
        data: obj.map((item) => {
          let totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
          let minutes = totalMinutes % 60;
          return minutes;
        }),
        backgroundColor: "rgba(78, 14, 229, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default DailyUserDuration;
