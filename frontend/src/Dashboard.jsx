import React, { useEffect, useState } from "react"; 
import ChartComponent from "./ChartComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
// Import icons for each metric card
import cpuIcon from "./assets/icon/chip-icon.gif";
import cpuTempIcon from "./assets/icon/cpuTemp-icon.gif";
import latencyIcon from "./assets/icon/latency-icon.gif";
import gpuIcon from "./assets/icon/gpu-icon.gif";
import gpuTempIcon from "./assets/icon/gpuTemp-icon.gif";
import ramIcon from "./assets/icon/ram-icon.gif";
import diskIcon from "./assets/icon/disk-icon.gif";
// Import background videos
import bg1 from "./assets/background/animated-background-1.mp4";
import bg2 from "./assets/background/animated-background-2.mp4";
import bg3 from "./assets/background/animated-background-3.mp4";
import bg4 from "./assets/background/animated-background-4.mp4";
import bg5 from "./assets/background/animated-background-5.mp4";
import bg6 from "./assets/background/animated-background-6.mp4";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];

// Dashboard component to display metrics and alerts
const Dashboard = () => {

    // Sound alert state
    const [soundEnabled, setSoundEnabled] = useState(true);
    // Cpu usage, name, cores, speed state
    const [cpuData, setCpuData] = useState([]);
    const [cpuName, setCpuName] = useState("");
    const [cpuCores, setCpuCores] = useState("");
    const [cpuSpeed, setCpuSpeed] = useState("");
    // ram state
    const [ramData, setRamData] = useState([]);
    const [totalRAM, setTotalRAM] = useState(0);
    const [usedRAM, setUsedRAM] = useState(0);
    // disk state
    const [diskData, setDiskData] = useState([]);
    const [totalDisk, setTotalDisk] = useState(0);
    const [usedDisk, setUsedDisk] = useState(0);
    // gpu state
    const [gpuData, setGpuData] = useState([]);
    const [gpuName, setGpuName] = useState("");
    const [gpuClockSpeed, setGpuClockSpeed] = useState(0);
    const [gpuPower, setGpuPower] = useState(0);
    // VRAM ysage, total, used state
    const [vramData, setVramData] = useState([]);
    const [vramUsed, setVramUsed] = useState(0);
    const [vramTotal, setVramTotal] = useState(0);
    // gpu temp state
    const [gpuTempData, setGpuTempData] = useState([]); 
    // cpu temp state
    const [cpuTempData, setCpuTempData] = useState([]); 
     // latency state
    const [latencyData, setLatencyData] = useState([]);
    const [packetLoss, setPacketLoss] = useState(0);
    const [connectionType, setConnectionType] = useState("Unknown");
    // Expanded card state     
    const [expandedCard, setExpandedCard] = useState(null);
    // Time range state
    const [timeRange, setTimeRange] = useState("1hour");
    const [historyData, setHistoryData] = useState({
        cpu_usage: [],
        cpu_temp: [],
        ram_usage: [],
        disk_usage: [],
        gpu_usage: [],
        gpu_temp: [],
        vram_usage: [],
        network_latency: [],
        timestamps: [], // Ensure timestamps are initialized
    });
    // Background video state
    const [currentBg, setCurrentBg] = useState(0);
    // Title color state
    const [titleColor, setTitleColor] = useState("#66c0f4"); // Default color
    // Toast alert state
    const activeToasts = new Set(); 

    const fetchData = async () => {
        try {
            // Fetch data from API endpoints using async/await syntax 
            const cpuRes = await fetch("http://localhost:3001/cpu");
            const ramRes = await fetch("http://localhost:3001/ram");
            const diskRes = await fetch("http://localhost:3001/disk");
            const gpuRes = await fetch("http://localhost:3001/gpu");
            const gpuTempRes = await fetch("http://localhost:3001/gpu-temp");
            const cpuTempRes = await fetch("http://localhost:3001/cpu-temp");
            const latencyRes = await fetch("http://localhost:3001/ping-latency");
            const vramRes = await fetch("http://localhost:3001/vram");

            // Fetch data from API endpoints and convert to JSON format
            const cpu = await cpuRes.json();
            const ram = await ramRes.json();
            const disk = await diskRes.json();
            const gpu = await gpuRes.json();
            const gpuTemp = await gpuTempRes.json();
            const cpuTemp = await cpuTempRes.json();
            const latency = await latencyRes.json();
            const vram = await vramRes.json();

            // cpu usage, name and cores, speed state update
            setCpuData((prev) => [...prev.slice(-9), cpu.cpuUsage]);
            setCpuName(cpu.cpuName);
            setCpuCores(cpu.cpuCores);
            setCpuSpeed(cpu.cpuSpeed);
            // ram usage, total, used state update
            setRamData((prev) => [...prev.slice(-9), ram.ramUsage]);
            setTotalRAM(ram.totalRAM);
            setUsedRAM(ram.usedRAM);
            // disk usage, total, used state update
            setDiskData((prev) => [...prev.slice(-9), disk.diskUsage]);
            setTotalDisk(disk.totalDisk);
            setUsedDisk(disk.usedDisk);
            // gpu usage, name, clock speed, power state update
            setGpuData((prev) => [...prev.slice(-9), gpu.gpuUsage]);
            setGpuName(gpu.gpuName);
            setGpuClockSpeed(gpu.gpuClockSpeed);
            setGpuPower(gpu.gpuPower);
            // gpu temp state update
            setGpuTempData((prev) => [...prev.slice(-9), gpuTemp.gpuTemp]);
            // cpu temp state update
            setCpuTempData((prev) => [...prev.slice(-9), cpuTemp.cpuTemp]);
            // latency state update
            setLatencyData((prev) => [...prev.slice(-9), parseFloat(latency.latency)]);
            setPacketLoss(parseFloat(latency.packetLoss));       
            setPacketLoss(parseFloat(latency.packetLoss));
            setConnectionType(latency.connectionType);
            // VRAM usage, total, used state update
            setVramData((prev) => [...prev.slice(-9), vram.vramUsage]);
            setVramUsed(vram.vramUsed);  
            setVramTotal(vram.vramTotal); 
            // Check for threshold values and show toast alerts
            // Fire Alerts IMMEDIATELY after setting state
            // Check for threshold values and show toast alerts
            checkThresholds(
                cpu.cpuUsage,
                gpu.gpuUsage,
                cpuTemp.cpuTemp,
                gpuTemp.gpuTemp,
                ram.ramUsage,
                parseFloat(latency.latency),
                vram.vramUsage // ✅ Added VRAM usage here
            );
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to play sound alert when threshold is reached
    const playSoundAlert = () => {
        setTimeout(() => {
            // Use functional update to get the latest value of soundEnabled
            setSoundEnabled((prevSoundEnabled) => {
                if (!prevSoundEnabled) return prevSoundEnabled; // If disabled, do nothing
                const audio = new Audio("/alerts/alert-sound-3.mp3");
                audio.play().catch(error => console.error("Audio play error:", error)); // Catch any errors
                return prevSoundEnabled;
            });
        }, 50); // Small delay ensures latest state is considered
    };


    // Function to fetch historical data based on time range
    // Fetch function to get historical data
    // http://localhost:3001/history/12hours
    // http://localhost:3001/history/24hours
    // http://localhost:3001/history/1hour
    const fetchHistoricalData = async (selectedRange = timeRange) => {
        try {
            console.log(`Fetching historical data for ${selectedRange}...`);
            const response = await fetch(`http://localhost:3001/history/${selectedRange}`);
            const data = await response.json();
    
            if (Array.isArray(data) && data.length > 0) {
                // Set different max points based on the time range
                let maxPoints;
                if (selectedRange === "1hour") maxPoints = 10;
                else if (selectedRange === "12hours") maxPoints = 15;
                else if (selectedRange === "24hours") maxPoints = 20;
    
                const step = Math.ceil(data.length / maxPoints);
    
                // Downsampling to reduce overcrowding
                const sampledData = data.filter((_, index) => index % step === 0);
    
                setHistoryData({
                    cpu_usage: sampledData.map(entry => entry.cpu_usage ?? 0),
                    cpu_temp: sampledData.map(entry => entry.cpu_temp ?? 0),
                    ram_usage: sampledData.map(entry => entry.ram_usage ?? 0),
                    disk_usage: sampledData.map(entry => entry.disk_usage ?? 0),
                    gpu_usage: sampledData.map(entry => entry.gpu_usage ?? 0),
                    gpu_temp: sampledData.map(entry => entry.gpu_temp ?? 0),
                    vram_usage: sampledData.map(entry => entry.vram_usage ?? 0),
                    network_latency: sampledData.map(entry => entry.network_latency ?? 0),
                    timestamps: sampledData.map(entry =>
                        entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ""
                    ),
                });
            } else {
                console.warn(`No historical data available for ${selectedRange}.`);
                setHistoryData({
                    cpu_usage: [],
                    cpu_temp: [],
                    ram_usage: [],
                    disk_usage: [],
                    gpu_usage: [],
                    gpu_temp: [],
                    vram_usage: [],
                    network_latency: [],
                    timestamps: [],
                });
            }
        } catch (error) {
            console.error(`Error fetching historical data for ${selectedRange}:`, error);
        }
    };        
      
    // Fetch historical data on component mount
    useEffect(() => {
        fetchHistoricalData();
    }, []);
    
    // Function to toggle expanded card view
    const toggleShowMore = (index) => {
        if (expandedCard === index) {
            setExpandedCard(null);
        } else {
            setExpandedCard(index);
        }
    };

    // Function to change background video
    const changeBackground = () => {
        setCurrentBg((prevBg) => (prevBg + 1) % backgrounds.length);
    };

    // Function to download historical data as CSV file
    const [loadingMetric, setLoadingMetric] = useState(null); // Track which button is loading

    // Function to download historical data as CSV file
    const handleDownload = async (metric) => {
        try {
            setLoadingMetric(metric); // Show spinner on the clicked button
    
            // Include the selected time range in the request
            const response = await fetch(`http://localhost:3001/export/${metric}/csv/${timeRange}`);
            if (!response.ok) {
                throw new Error("Failed to download data");
            }
    
            const blob = await response.blob();
            saveAs(blob, `${metric}_${timeRange}.csv`); // ✅ Updated filename to include time range
        } catch (error) {
            console.error("Error downloading file:", error);
        } finally {
            setLoadingMetric(null); // Hide spinner after download is complete
        }
    };    
        
    // Function to show toast alerts with improved UI 
    const showToast = (type, title, message, link, id) => {
        if (activeToasts.has(id)) return; // Prevent duplicate notifications
        activeToasts.add(id);

        toast[type](
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Manually added custom icon */}
                <span className={`toast-icon toast-icon-${type}`}>
                    {type === "error" && "❗"}
                    {type === "warning" && "⚠️"}
                    {type === "info" && "ℹ️"}
                </span>

                <div style={{ lineHeight: "1.6" }}>
                    <strong>{title}</strong>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>{message}</p>
                    <a href={link} target="_blank" rel="noopener noreferrer" style={{ 
                        color: "#ffffff", 
                        textDecoration: "underline",
                        fontWeight: "bold",
                        display: "inline-block",
                        marginTop: "5px"
                    }}>
                        Learn more
                    </a>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false, // removes the default Toastify icon
                style: { marginBottom: "15px" },
                onClose: () => activeToasts.delete(id),
            }
        );

        // Play sound alert when showing toast
        playSoundAlert();
    };

    // Function to check threshold values and show toast alerts messages based on metrics 
    const checkThresholds = (cpu, gpu, cpuTemp, gpuTemp, ram, latency, vram) => {
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
        if (vram > 85) {
            showToast(
                "warning",
                "High VRAM Usage!",
                `Your VRAM usage is at ${vram}%. Running out of VRAM can cause texture pop-ins and stutters in games. Consider lowering in-game texture settings.`,
                "https://www.techpowerup.com/forums/threads/vram-usage-optimization-guide.287359/",
                "vram-high"
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

        const rotateX = ((y - centerY) / centerY) * 4; 
        const rotateY = ((centerX - x) / centerX) * 4; 

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.05)`;
        card.style.transition = "transform 0.1s ease-out";
        card.style.backgroundPosition = `${50 + rotateY * 2}% ${50 + rotateX * 2}%`; 
        card.style.boxShadow = `0px 15px 20px rgba(0, 0, 0, 0.3)`;
    };

    const handleMouseLeave = (e, index) => {
        const card = document.querySelectorAll(".metric-card")[index];
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
        card.style.transition = "transform 0.5s ease-in-out";
        card.style.backgroundPosition = "50% 50%"; 
        card.style.boxShadow = "0 2px 3px rgb(153, 35, 35)";
    };

    // Fetch data on component mount and every 10 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Match backend update speed
        return () => clearInterval(interval);
    }, []);
    
    // Function to determine if the background is bright or dark
    const updateTitleColor = () => {
        const video = document.querySelector(".background-video");

        if (video) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = 100;
            canvas.height = 100;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

            let totalBrightness = 0;
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                totalBrightness += (r + g + b) / 3;
            }
            const avgBrightness = totalBrightness / (canvas.width * canvas.height);

            // If brightness is high, make text dark; otherwise, make it light
            setTitleColor(avgBrightness > 128 ? "#000000" : "#ffffff");
        }
    };

    // Run when the background changes
    useEffect(() => {
        setTimeout(updateTitleColor, 500); // Delay to ensure video has rendered
    }, [currentBg]);

    // Render dashboard component with metrics and alerts 
    return (
        <div style={{position: "relative",height: "200vh", overflowY: "auto", }}>
        
        {/* Video Background with Dynamic Source configurable with a button */}
        <video
            key={backgrounds[currentBg]}
            autoPlay
            loop
            muted
            playsInline
            className="background-video"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "fill",
                zIndex: -1,
            }}
        >
            <source src={backgrounds[currentBg]} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        {/* Background Toggle Button - Placed Below Dismiss Alerts Button */}
        <button
            style={{
                position: "absolute",
                top: 70, // Adjusted to appear below the dismiss button
                left: 50,
                padding: "10px 20px",
                backgroundColor: "#ff9800",
                color: "white",
                width: "200px",
                border: "none",
                borderRadius: "15px",
                cursor: "url('http://www.rw-designer.com/cursor-extern.php?id=225968'), auto", // Custom cursor
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
            }}
            onClick={changeBackground}
        >
            Change Background
        </button>

        {/* Button to Toggle Sound Alerts */}
        <button
            style={{
                position: "absolute",
                top: 120, // Adjusted position below other buttons
                left: 50,
                padding: "10px 20px",
                backgroundColor: soundEnabled ? "#ff0000" : "#00cc00",
                color: "white",
                width: "200px",
                border: "none",
                borderRadius: "15px",
                cursor: "url('http://www.rw-designer.com/cursor-extern.php?id=225968'), auto", // Custom cursor
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
            }}
            onClick={() => setSoundEnabled((prev) => !prev)} // ✅ Now updates correctly
        >
            {soundEnabled ? "🔊 Disable Alert Sound" : "🔇 Enable Alert Sound"}
        </button>

            {/* Dashboard Title */}
            <h1 className="dashboard-title" style={{ color: titleColor }}>
            Game Performance Dashboard
            </h1>

            {/* View History Dropdown */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
                <label style={{ color: "#fff", fontSize: "18px", marginRight: "10px" }}>
                    View History:
                </label>
                <select
                    value={timeRange}
                    onChange={(e) => {
                        const newTimeRange = e.target.value;
                        setTimeRange(newTimeRange);
                        fetchHistoricalData(newTimeRange); // Pass new time range dynamically
                    }}                    
                    style={{ padding: "5px", fontSize: "16px", borderRadius: "5px", cursor: "url('http://www.rw-designer.com/cursor-extern.php?id=225968'), auto" }}
                >
                    <option value="1hour">Last 1 Hour</option>
                    <option value="12hours">Last 12 Hours</option>
                    <option value="24hours">Last 24 Hours</option>
                </select>
            </div>
            {/* Dismiss All Alerts Button */}
            <button
                style={{
                    position: "absolute",
                    top: 20,
                    left: 50,
                    width: "200px",
                    padding: "10px 20px",
                    backgroundColor: "#66c0f4",
                    color: "white",
                    border: "none",
                    borderRadius: "15px",
                    cursor: "url('http://www.rw-designer.com/cursor-extern.php?id=225968'), auto", // Custom cursor
                }}
                onClick={dismissAllToasts}
            >
                Dismiss All Alerts
            </button>
            {/* Dashboard Container */}
            <div
                className="dashboard-container"
                style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", padding: "2px" }}
            >   
            {/* Metric Cards */}
                {[
                    { label: "CPU Usage", data: cpuData, borderColor: "red", icon: cpuIcon, size: 50, api: "cpu_usage" },
                    { label: "GPU Usage", data: gpuData, borderColor: "purple", icon: gpuIcon, size: 50, api: "gpu_usage" },
                    { label: "VRAM Usage", data: vramData, borderColor: "yellow", icon: gpuIcon, size: 50, api: "vram_usage" },
                    { label: "RAM Usage", data: ramData, borderColor: "blue", icon: ramIcon, size: 50, api: "ram_usage" },
                    { label: "Disk Usage", data: diskData, borderColor: "green", icon: diskIcon, size: 45, api: "disk_usage" },
                    { label: "Network Latency", data: latencyData, borderColor: "cyan", icon: latencyIcon, size: 45, api: "network_latency" },
                    { label: "CPU Temperature", data: cpuTempData, borderColor: "blue", icon: cpuTempIcon, size: 45, api: "cpu_temp" },
                    { label: "GPU Temperature", data: gpuTempData, borderColor: "orange", icon: gpuTempIcon, size: 50, api: "gpu_temp" },
                ]
                .map((metric, index) => (
                    <div
                        key={index}
                        className="metric-card" 
                        style={{
                            color: "#ffffff",
                            fontFamily: "Arial, sans-serif",
                            padding: "20px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transformStyle: "preserve-3d",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "url('http://www.rw-designer.com/cursor-extern.php?id=226107'), auto", // Custom cursor
                            backgroundColor: "#20232a",
                            width: "300px",
                            textAlign: "center",
                            position: "relative",
                            filter: expandedCard !== null && expandedCard !== index ? "blur(50px)" : "none", // Blur effect
                            opacity: expandedCard !== null && expandedCard !== index ? "0.5" : "1", // Darken effect
                            pointerEvents: expandedCard !== null && expandedCard !== index ? "none" : "auto", // Prevent clicks on blurred cards
                        }}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseLeave={(e) => handleMouseLeave(e, index)}
                    >
                        {/* Metric Icon and Data */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                            <img src={metric.icon} alt={metric.label} width={metric.size} height={metric.size} />
                            <h2 style={{ fontSize: "2.5rem", margin: 0 }}>{metric.data[metric.data.length - 1] || 0}</h2>
                        </div>
                        {/* Metric Label */}
                        <ChartComponent 
                            label={metric.label} 
                            data={timeRange === "1hour" ? metric.data : historyData[metric.label.replace(" ", "_").toLowerCase()] || []} 
                            borderColor={metric.borderColor} 
                        />
                        {/* Show More Button */}
                        <button
                            onClick={() => toggleShowMore(index)}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                background: "linear-gradient(90deg, #2a2d35, #3c3f47)",
                                color: "white",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: "10px",
                                minWidth: "160px",
                                transition: "all 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                fontSize: "12px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                boxShadow: "0px 0px 8px rgba(60, 63, 71, 0.5)",
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                                cursor: "url('http://www.rw-designer.com/cursor-extern.php?id=225968'), auto", // Custom cursor 
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "linear-gradient(90deg, #3c3f47, #2a2d35)";
                                e.target.style.boxShadow = "0px 0px 15px rgba(60, 63, 71, 0.8)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "linear-gradient(90deg, #2a2d35, #3c3f47)";
                                e.target.style.boxShadow = "0px 0px 8px rgba(60, 63, 71, 0.5)";
                            }}
                        >
                            {expandedCard === index ? "Show Less" : "Show More"}
                        </button>
                        {/* 🟢 Download Button for Each Metric */}
                        <button
                            onClick={() => handleDownload(metric.api)}
                            style={{
                                marginTop: "10px",
                                padding: "10px 20px",
                                background: "linear-gradient(90deg, #2a2d35, #3c3f47)",
                                color: "white",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: "10px",
                                minWidth: "160px",
                                height: "40px", /* ✅ Ensures the button height remains fixed */
                                transition: "all 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                fontSize: "12px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                boxShadow: "0px 0px 8px rgba(60, 63, 71, 0.5)",
                                display: "flex", // ✅ Ensures alignment of spinner & text
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "auto",
                                marginRight: "auto",
                                cursor: loadingMetric === metric.api ? "not-allowed" : "url('http://www.rw-designer.com/cursor-extern.php?id=225968'), auto", // avoid clicking when loading
                                opacity: loadingMetric === metric.api ? 0.7 : 1, // ✅ Reduce opacity when loading
                            }}
                            disabled={loadingMetric === metric.api} // ✅ Prevent multiple clicks
                            onMouseEnter={(e) => {
                                if (loadingMetric !== metric.api) {
                                    e.target.style.background = "linear-gradient(90deg, #3c3f47, #2a2d35)";
                                    e.target.style.boxShadow = "0px 0px 15px rgba(60, 63, 71, 0.8)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (loadingMetric !== metric.api) {
                                    e.target.style.background = "linear-gradient(90deg, #2a2d35, #3c3f47)";
                                    e.target.style.boxShadow = "0px 0px 8px rgba(60, 63, 71, 0.5)";
                                }
                            }}
                        >
                            {loadingMetric === metric.api ? (
                                <span className="spinner"></span> // Show spinner when loading
                            ) : (
                                "Download Data"
                            )}
                        </button>

                        {/* Extra Information Section */}
                        <div className={`extra-info ${expandedCard === index ? "expanded" : "collapsed"}`}
                            style={{
                                marginTop: "10px",
                                backgroundColor: "#282c34",
                                padding: expandedCard === index ? "10px" : "0px",
                                borderRadius: "5px",
                                textAlign: "left",
                                fontSize: "14px",
                                maxHeight: expandedCard === index ? "200px" : "0px",
                                overflow: "hidden",
                                transition: "max-height 0.3s ease-in-out, padding 0.3s ease-in-out"
                            }}
                            >
                            {/* Expanded cards for extra information for each metrics */}
                            {expandedCard === index && (
                            <div style={{marginTop: "10px",backgroundColor: "#282c34",padding: "10px",borderRadius: "5px",textAlign: "left",fontSize: "14px",}}>
                                 {metric.label === "VRAM Usage" ? (
                                <>
                                    <p><strong>VRAM Total:</strong> {vramTotal} GB</p>
                                    <p><strong>VRAM Used:</strong> {vramUsed} GB</p>
                                    <p><strong>VRAM Usage:</strong> {metric.data[metric.data.length - 1] || 0}%</p>
                                </>
                                ) : metric.label === "CPU Usage" ? (
                                <>
                                    <p><strong>CPU Name:</strong> {cpuName}</p>
                                    <p><strong>CPU Cores:</strong> {cpuCores}</p>
                                    <p><strong>CPU Speed:</strong> {cpuSpeed} GHz</p>
                                </>
                                ) : metric.label === "RAM Usage" ? (
                                    <>
                                    <p><strong>Total RAM:</strong> {totalRAM} GB</p>
                                    <p><strong>Used RAM:</strong> {usedRAM} GB</p>
                                    <p><strong>RAM Usage:</strong> {metric.data[metric.data.length - 1] || 0}%</p>
                                </>
                                ) : metric.label === "Disk Usage" ? (
                                    <>
                                    <p><strong>Total Disk Space:</strong> {totalDisk} GB</p>
                                    <p><strong>Used Disk Space:</strong> {usedDisk} GB</p>
                                    <p><strong>Disk Usage:</strong> {metric.data[metric.data.length - 1] || 0}%</p>
                                    </>
                                ) : metric.label === "CPU Temperature" ? (
                                    <>
                                    <p><strong>CPU Name:</strong> {cpuName}</p>
                                    <p><strong>CPU Cores:</strong> {cpuCores}</p>
                                    <p><strong>CPU Speed:</strong> {cpuSpeed} GHz</p>
                                    </>
                                ) : metric.label === "GPU Usage" ? (
                                    <>
                                    <p><strong>GPU Model:</strong> {gpuName}</p>
                                    <p><strong>Core Clock Speed:</strong> {gpuClockSpeed} MHz</p>
                                    <p><strong>Power Consumption:</strong> {gpuPower} W</p>
                                    </>
                                ) : metric.label === "GPU Temperature" ? (
                                    <>
                                    <p><strong>GPU Model:</strong> {gpuName}</p>
                                    <p><strong>Core Clock Speed:</strong> {gpuClockSpeed} MHz</p>
                                    <p><strong>Power Consumption:</strong> {gpuPower} W</p>
                                    </>
                                ) : metric.label === "Network Latency" ? (
                                    <>
                                    <p><strong>Ping:</strong> {metric.data[metric.data.length - 1] || 0} ms</p>
                                    <p><strong>Packet Loss:</strong> {packetLoss} %</p>
                                    <p><strong>Connection Type:</strong> {connectionType}</p>
                                    </>
                                ) : null}
                            </div>
                        )}
                    </div>
                    {/* End of Metric Cards */}
                    </div>
                ))}
                {/* End of Dashboard Container */}
            </div>  
            {/* End of Dashboard Component */} 
            <ToastContainer /> 
        </div>
    );
};

export default Dashboard;
