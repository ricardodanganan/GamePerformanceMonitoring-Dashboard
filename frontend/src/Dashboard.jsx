import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import { FaMicrochip, FaMemory, FaHdd, FaGamepad, FaNetworkWired, FaThermometerHalf, FaThermometerQuarter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundVideo from "./assets/background-2.mp4"; 

const getCardBackgroundColor = (value) => {
    if (value < 50) return "#04ff00"; 
    if (value < 80) return "#fcff56"; 
    return "#ff1717"; 
};

// Function to play sound alert when showing toast
const playSoundAlert = () => {
    const audio = new Audio("/alert-sound-3.mp3");
    audio.play();
};

// Dashboard component to display metrics and alerts
const Dashboard = () => {
    const [cpuData, setCpuData] = useState([]);
    const [ramData, setRamData] = useState([]);
    const [diskData, setDiskData] = useState([]);
    const [gpuData, setGpuData] = useState([]); 
    const [gpuTempData, setGpuTempData] = useState([]); 
    const [cpuTempData, setCpuTempData] = useState([]); 
    const [latencyData, setLatencyData] = useState([]); 
    const activeToasts = new Set(); 

    const fetchData = async () => {
        try {
            const cpuRes = await fetch("http://localhost:3001/cpu");
            const ramRes = await fetch("http://localhost:3001/ram");
            const diskRes = await fetch("http://localhost:3001/disk");
            const gpuRes = await fetch("http://localhost:3001/gpu");
            const gpuTempRes = await fetch("http://localhost:3001/gpu-temp");
            const cpuTempRes = await fetch("http://localhost:3001/cpu-temp");
            const latencyRes = await fetch("http://localhost:3001/ping-latency");

            const cpu = await cpuRes.json();
            const ram = await ramRes.json();
            const disk = await diskRes.json();
            const gpu = await gpuRes.json();
            const gpuTemp = await gpuTempRes.json();
            const cpuTemp = await cpuTempRes.json();
            const latency = await latencyRes.json();

            // Ensure numeric values for GPU and CPU usage
            const gpuUsage = parseFloat(gpu.gpuUtil.replace("%", ""));
            const latencyValue = parseFloat(latency.latency.replace(" ms", ""));

            setCpuData((prev) => [...prev.slice(-9), cpu.value]);
            setRamData((prev) => [...prev.slice(-9), ram.value]);
            setDiskData((prev) => [...prev.slice(-9), disk.value]);
            setGpuData((prev) => [...prev.slice(-9), gpuUsage]);
            setGpuTempData((prev) => [...prev.slice(-9), gpuTemp.gpuTemp]);
            setCpuTempData((prev) => [...prev.slice(-9), cpuTemp.cpuTemp]);
            setLatencyData((prev) => [...prev.slice(-9), latencyValue]);

            checkThresholds(cpu.value, gpuUsage, cpuTemp.cpuTemp, gpuTemp.gpuTemp, ram.value, latencyValue);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to show toast alert messages
    const showToast = (type, title, message, link, id) => {
        if (activeToasts.has(id)) return; // Prevent duplicate notifications
        activeToasts.add(id);

        toast[type](
            <div>
                <strong>{title}</strong>
                <p>{message}</p>
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#66c0f4", textDecoration: "underline" }}>Learn more</a>
            </div>,
            {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: () => activeToasts.delete(id),
            }
        );
        // Play sound alert when showing toast
        playSoundAlert();
    };

    const checkThresholds = (cpu, gpu, cpuTemp, gpuTemp, ram, latency) => {
        if (cpu > 80) {
            showToast(
                "error",
                "High CPU Usage!",
                `Your CPU usage is at ${cpu}%. This might cause lag in-game. Consider closing background applications or upgrading your CPU if this is a frequent issue.`,
                "https://www.intel.com/content/www/us/en/gaming/resources/how-to-fix-high-cpu-usage.html",
                "cpu-high"
            );
        }
        if (gpu > 80) {
            showToast(
                "error",
                "High GPU Usage!",
                `Your GPU usage is at ${gpu}%. You might experience stuttering or frame drops. Lowering in-game settings or updating your GPU drivers can help.`,
                "https://cyfuture.cloud/kb/gpu/step-by-step-guide-to-fix-system-processes-using-100-gpu-on-windows",
                "gpu-high"
            );
        }
        if (cpuTemp > 70) {
            showToast(
                "warning",
                "High CPU Temperature!",
                `Your CPU temperature is at ${cpuTemp}°C. This could lead to thermal throttling and affect gaming performance. Ensure your cooling system is working properly.`,
                "https://www.intel.com/content/www/us/en/support/articles/000005791/processors/intel-core-processors.html",
                "cpu-temp-high"
            );
        }
        if (gpuTemp > 80) {
            showToast(
                "warning",
                "High GPU Temperature!",
                `Your GPU temperature is at ${gpuTemp}°C. High temperatures can cause hardware instability during gaming. Check for proper ventilation and clean your GPU fans.`,
                "https://www.partitionwizard.com/partitionmagic/gpu-overheating.html",
                "gpu-temp-high"
            );
        }
        if (ram > 85) {
            showToast(
                "warning",
                "High RAM Usage!",
                `Your RAM usage is at ${ram}%. This might cause slowdowns or crashes in games. Consider closing unused programs or upgrading your RAM.`,
                "https://example.com/high-ram-usage",
                "ram-high"
            );
        }
        if (latency > 100) {
            showToast(
                "info",
                "High Network Latency!",
                `Your latency is at ${latency} ms. This can cause lag or delays in online games. Switching to a wired connection or optimizing your network can help.`,
                "https://example.com/high-latency",
                "latency-high"
            );
        }
    };

    // Dismiss all toasts alert messages when the button is clicked
    const dismissAllToasts = () => {
        toast.dismiss();
        activeToasts.clear();
    };

    // Function to handle card hover 3d effect on mouse move 
    const handleMouseMove = (e, index) => {
        const card = document.querySelectorAll(".metric-card")[index];
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top; 

        const centerX = rect.width / 4; 
        const centerY = rect.height / 4; 

        const rotateX = ((y - centerY) / centerY) * 10; 
        const rotateY = ((centerX - x) / centerX) * 10; 

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.15)`;
        card.style.boxShadow = `0px 15px 20px rgba(0, 0, 0, 0.3)`;
    };

    const handleMouseLeave = (e, index) => {
        const card = document.querySelectorAll(".metric-card")[index];
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        card.style.boxShadow = "0 2px 3px rgb(153, 35, 35)";
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        {/* Video Background */}
        <video
            autoPlay
            loop
            muted
            playsInline
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: -1,
            }}
        >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
            
            <h1 style={{ textAlign: "center", marginTop: "20px", fontSize: "3rem", color: "#66c0f4" }}>
                Game Performance Dashboard
            </h1>
            <button
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    padding: "10px 20px",
                    backgroundColor: "#66c0f4",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: 'pointer',
                }}
                onClick={dismissAllToasts}
            >
                Dismiss All Alerts
            </button>
            <div
                className="dashboard-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", padding: "20px" }}
            >
                {[
                    { label: "CPU Usage", data: cpuData, borderColor: "red", icon: FaMicrochip },
                    { label: "CPU Temperature", data: cpuTempData, borderColor: "blue", icon: FaThermometerHalf },
                    { label: "RAM Usage", data: ramData, borderColor: "blue", icon: FaMemory },
                    { label: "Disk Usage", data: diskData, borderColor: "green", icon: FaHdd },
                    { label: "GPU Usage", data: gpuData, borderColor: "purple", icon: FaGamepad },
                    { label: "GPU Temperature", data: gpuTempData, borderColor: "orange", icon: FaThermometerQuarter },
                    { label: "Network Latency", data: latencyData, borderColor: "cyan", icon: FaNetworkWired },
                ].map((metric, index) => (
                    <div
                        key={index}
                        className="metric-card"
                        style={{
                            backgroundColor: getCardBackgroundColor(metric.data[metric.data.length - 1] || 0),
                            color: "#000000",
                            padding: "20px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transformStyle: "preserve-3d",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseLeave={(e) => handleMouseLeave(e, index)}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                            <metric.icon size={40} color={metric.borderColor} />
                            <h2 style={{ fontSize: "2.5rem", margin: 0 }}>{metric.data[metric.data.length - 1] || 0}</h2>
                        </div>
                        <ChartComponent label={metric.label} data={metric.data} borderColor={metric.borderColor} />
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
