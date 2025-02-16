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

const ChartComponent = ({ label, data = [], borderColor, timeLabels = [], selectedRange }) => {
    console.log("Chart Data:", data);
    console.log("Time Labels:", timeLabels);

    // Ensure timeLabels has valid timestamps and format based on selected range
    const formattedTimeLabels = timeLabels.length > 0
        ? timeLabels.map(ts =>
              ts
                  ? selectedRange === "1hour"
                      ? new Date(ts).toLocaleTimeString() // Only time for 1 hour view
                      : new Date(ts).toLocaleString() // Full date & time for 12/24 hour view
                  : "N/A"
          )
        : Array.from({ length: Math.max(data.length, 10) }, (_, i) => `Point ${i + 1}`);

    const chartData = {
        labels: formattedTimeLabels,
        datasets: [
            {
                label,
                data: data.length ? data : new Array(10).fill(0), // Fallback to 0 values
                borderColor,
                borderWidth: 3,
                pointRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                tension: 0.4, // Smooth lines
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time",
                },
                ticks: {
                    maxTicksLimit: selectedRange === "1hour" ? 10 : 5, // Adjust ticks based on range
                    autoSkip: true, // Ensures only necessary ticks are shown
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

    return (
        <div style={{ width: "100%", height: "250px" }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ChartComponent;
