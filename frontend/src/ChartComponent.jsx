import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartComponent = ({ label, data, borderColor }) => {
    const chartData = {
        labels: Array.from({ length: data.length }, (_, i) => i + 1),
        datasets: [
            {
              label,
              data,
              borderColor,
              borderWidth: 3, // Increase thickness
              pointRadius: 3, // Make data points more visible
              backgroundColor: "rgb(255, 255, 255)", // Light fill under the line
              tension: 0.4, // Smooth curve effect
            },
          ],          
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time (5s intervals)",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Percentage (%)",
                },
                min: 0,
                max: 100,
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default ChartComponent;
