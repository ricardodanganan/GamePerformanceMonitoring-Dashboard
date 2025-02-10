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
                backgroundColor: "rgba(0, 0, 0, 0)",
                tension: 0.4,
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
