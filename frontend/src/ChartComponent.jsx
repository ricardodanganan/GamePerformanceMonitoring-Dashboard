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

const ChartComponent = ({ label, data, borderColor, cpuChange, cpuAvg30s, cpuAvg1m }) => {
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
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const changeText = cpuChange > 0 
                            ? `\n(Increased by ${cpuChange}%)` 
                            : cpuChange < 0 
                                ? `\n(Decreased by ${Math.abs(cpuChange)}%)`
                                : "\n(No Change)";
                        
                        return [
                            `${label}: ${value}%`,
                            changeText,
                            `Last 30s Avg: ${cpuAvg30s}%`,
                            `Last 1m Avg: ${cpuAvg1m}%`
                        ];
                    },
                },
                bodyFont: {
                    size: 14,
                    lineHeight: 1.5,
                },
                padding: 12,
                displayColors: false,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                borderColor: "#ffffff",
                borderWidth: 1,
                cornerRadius: 10,
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
