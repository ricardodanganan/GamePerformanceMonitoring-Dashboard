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

// Register the ChartJS plugins
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
// Chart component to display the data in a line chart
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
                    text: "Time (5s intervals)", // X-axis title (time) 
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Percentage (%)", // Y-axis title (percentage)
                },
                min: 0,
                max: 100,
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default ChartComponent;
