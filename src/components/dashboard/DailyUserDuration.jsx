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

const DailyUserDuration = ({ tripData, date }) => {
  const options = {
    responsive: true,
  };

  // COMPUTE ALL DURATION
  const filteredData = tripData?.data.filter((item) => {
    return dayjs(item.createdAt).format("MMM-DD-YY") == date;
  });

  let users = {};

  filteredData?.forEach((trip, index) => {
    const newLocations = trip?.locations.filter(
      (location) => location.status == "left" || location.status == "arrived"
    );
    let user = trip.user_id.first_name;
    if (!users[user]) {
      users[user] = {
        totalDuration: 0,
        user_id: user,
      };
    }
    const startDate = dayjs(newLocations[0].date);
    const endDate = dayjs(newLocations[newLocations.length - 1].date);
    const duration = endDate.diff(startDate);
    users[user].totalDuration += duration;
  });

  const obj = Object.values(users);
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

export default DailyUserDuration;
