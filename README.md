# Game Performance & IT Monitoring Dashboard

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Core Features of Iteration 1 Successfully Implemented](#-core-features-of-iteration-1-successfully-implemented)
- [Planned Features for Iteration 2](#-planned-features-for-iteration-2)
- [Deployment](#Deployment)
- [Contributors](#contributors)
- [License](#license)

---

## Introduction

The **Game Performance** & **IT Monitoring Dashboard** is my final year IT Management project, developed as part of my 4th-year finals. This real-time monitoring and optimization tool is designed to enhance gaming performance by providing comprehensive system insights.

It tracks CPU and GPU usage, temperatures, RAM consumption, disk activity, VRAM usage, and network performance, ensuring gamers have a clear view of their system’s health. Equipped with threshold-based alerts, historical performance tracking, and Steam API integration, it helps optimize system resources, detect installed games, and provide tailored recommendations.

Additionally, I have integrated Grafana monitoring for advanced data visualization and real-time analytics, and implemented CSV/JSON data export functionality for deeper analysis. An in-game overlay, powered by Electron, allows players to monitor system performance (FPS, usage, temps) without exiting their game.

The entire dashboard runs as a standalone desktop application via Electron, removing the need to launch it in a browser or rely on localhost, delivering a seamless, app-like experience.

---

## Features

✅ **Real-time performance tracking** – Monitor CPU, GPU, RAM, VRAM, disk usage, temperatures, and network latency using PowerShell scripts.  
✅ **System alerts for overheating & resource overuse** – Visual and sound alerts using toast notifications when resource thresholds are exceeded.  
✅ **Standalone desktop app** – Powered by Electron, the dashboard runs as a native Windows application without needing a browser or localhost.  
✅ **In-game overlay (FPS HUD)** – Display real-time FPS, CPU/GPU usage, and temperatures inside an always-on-top overlay window.  
✅ **Historical performance tracking** – Logs system data into a local SQLite database with support for CSV/JSON exports by time range.  
✅ **Grafana integration** – Open Grafana dashboard with real-time metrics visualization and historical trends.  
✅ **Background customization** – Switch between animated backgrounds for a personalized dashboard experience.  
✅ **Steam API integration (Planned)** – Detect installed Steam games for future optimization features.  
✅ **Game optimization (Planned)** – Use machine learning to provide tailored performance recommendations (future enhancement).

---

## Usage

### View system performance metrics in real-time
- **CPU & GPU Usage & Temperature**: Graphical representation via Chart.js.
- **RAM & Disk Usage**: Track memory and storage performance.
- **Network Monitoring**: Display ping and latency.
- **Grafana Performance Metrics**: Advanced real-time monitoring dashboard with customizable panels for each metric.
- **Optimized CPU & GPU monitoring** to reduce system overhead.

### Receive alerts when system thresholds are exceeded
- **Automatic notifications** appear when CPU, GPU, or RAM usage reaches critical levels.
- **Audio alerts** trigger for immediate attention.

### Access the in-game overlay
- **Live stats inside your game** even when running in **fullscreen mode**.
- **Toggle visibility via a hotkey** to enable/disable the overlay.
- **Click-through mode enabled**, so the overlay does not interfere with gameplay.

### Use the game optimization module *(Upcoming Feature)*
- **Detect installed games** via Steam API.
- **Compare system hardware** to recommended settings.
- **Receive optimization suggestions** based on detected hardware and software.

---

## Dependencies

### Frontend:
- **React.js** – For UI components
- **Chart.js** – For real-time graphical data visualization
- **React Toastify** – For system alerts & notifications

### Backend:
- **Node.js** – For API handling
- **Express.js** – For managing requests
- **WebSockets** – For real-time updates
- **PowerShell Scripts** – For retrieving system performance data
- **SQLite** – For storing and retrieving historical system metrics

### APIs & Tools:
- **Steam API** – For detecting installed games
- **NVIDIA API (Planned)** – For AI-driven optimizations 
- **(Electron.js)** - for an In-game overlay feature

---

## ✅ Core Features of Iteration 1 Successfully Implemented

### 🔹 Live CPU, RAM, Disk, GPU Monitoring ✅
- Tracks real-time **CPU usage, CPU temperature, RAM usage, Disk activity, GPU usage, GPU temperature, VRAM usage, and Network Latency** using PowerShell scripts.

### 🔹 Real-Time Graphs (Chart.js) ✅
- Uses **Chart.js** to display performance metrics as **smooth, interactive line graphs**, updating automatically every few seconds.

### 🔹 System Alerts & Sound Notifications ✅
- Implements **toast alerts and warning sounds** when critical performance limits (high CPU/GPU usage, overheating, network latency) are exceeded.

### 🔹 Historical Data Storage (SQLite) ✅
- Stores real-time performance data in an **SQLite database** (`performance_data.db`), allowing users to track historical trends over **1hr, 12hr, and 24hr periods**.

### 🔹 Export Data (CSV & JSON) ✅
- Provides an option to **download historical performance logs** in **CSV or JSON format** for further analysis.

### 🔹 Historical Data View ✅
- Allows users to switch between **1hr, 12hr, and 24hr views**, dynamically fetching past performance data from the database.

---

## 🚀 Planned Features for Iteration 2

### 🔹 **Steam API Integration - Game Detection**
- Uses the **Steam API** to fetch a list of installed games, allowing for system performance tracking based on the user's active game library.

### 🔹 **Game Optimization Feature**
- Compares detected games with system hardware specifications and **recommends performance optimizations** such as adjusting resolution, background processes, and power settings.

### 🔹 Separate Electron Window for the Dashboard ✅
- The entire **Game Performance Dashboard now runs inside Electron**, instead of a web browser.
- This allows for **faster performance, better integration with system resources, and improved fullscreen support**.
- Users can launch the dashboard as a **dedicated app** using `npm run start-all`.
- This eliminates the need to manually open `localhost:5173`, making the experience smoother.
- **Optimized Electron Performance** by reducing CPU usage through background throttling, GPU acceleration, and efficient event handling.

### 🔹 Electron Performance Issue & Fixes ✅
During testing, we observed that Electron's CPU usage **fluctuated significantly**, leading to performance concerns when running the overlay. The following optimizations were implemented to reduce CPU consumption:

**🔍 Issue:**
- The Electron overlay would **consume high CPU resources**, especially when running real-time updates.
- `requestAnimationFrame()` **locked FPS at 60**, causing unnecessary rendering cycles.
- Background processes **kept running at full speed**, even when Electron was minimized.

**🛠 Fixes Applied:**
✅ **Lowered data fetching rate** → Reduced polling frequency for CPU/GPU stats to avoid excessive updates.  
✅ **Optimized FPS counter updates** → Limited `requestAnimationFrame()` calls to match actual game FPS.  
✅ **Enabled background throttling** → Prevented Electron from consuming CPU when minimized.  
✅ **Forced GPU acceleration** → Offloaded rendering to the GPU instead of overloading the CPU.  
✅ **Improved overlay performance** → Used `setIgnoreMouseEvents(true, { forward: true })` to prevent unnecessary event handling.

After these fixes, **Electron now consumes significantly less CPU**, making the dashboard more efficient, even while running in fullscreen mode.

### 🔹 In-Game Overlay Integration ✅
- Successfully implemented an **Electron-based in-game overlay**, displaying **FPS, CPU usage, GPU usage, CPU temperature, and GPU temperature**.
- The overlay stays **on top of fullscreen games**, providing real-time performance insights without needing to switch out of the game.
- Features include **adjustable transparency, always-on-top mode, and click-through functionality** to ensure minimal interference with gameplay.
- Future improvements may include **Steam API FPS integration or DirectX hooks for more accurate game FPS tracking**.

### 🔹 **Further UI Improvements** ✅
- Enhances **visual effects, animation smoothness, and responsiveness** for a **sleek, modern dashboard experience**.

### 🔹 Grafana Optional View (Performance Monitoring Dashboard) ✅
- In addition to the built-in game performance tracking in the Electron dashboard, an optional Grafana-based monitoring view was implemented to provide a more   customizable and professional performance dashboard.

**What Was Done**
- Connected Grafana to SQLite:
- Used an SQLite data source in Grafana to pull system performance data directly from performance_data.db.
- Queries were structured using SQL to fetch time-series data.

- Created Real-Time Performance Panels:
- CPU Usage, GPU Usage, CPU Temp, GPU Temp, VRAM Usage, RAM Usage, Disk Usage, and Network Latency were displayed using gauge and time-series panels.
- Each metric was retrieved dynamically from the SQLite database.
- Added a Button to Open Grafana from Electron:
- A new button was placed below the "Toggle Overlay" button in the Electron dashboard.
- Clicking it opens the Grafana dashboard in a browser, allowing users to view a professional performance monitoring panel.

**How to Use**
- Start the Grafana Server
- Run grafana-server.exe (or the equivalent startup command in the Grafana installation).
- Open http://localhost:3000/ in a browser to access Grafana.
- Ensure SQLite Database is Available
- The SQLite data source must be correctly set up in Grafana.
- Performance data must be actively logged into performance_data.db.
- Access the Grafana Dashboard from the Electron App
- Click the "View Grafana Dashboard" button to open the optional Grafana view.

**Why This Was Added**
- Alternative to Built-in Charts → Allows users to leverage Grafana’s advanced visualization capabilities.
- Customizable & Expandable → Users can modify and extend the panels without changing the core project code.
- Separate from the Main Dashboard → Provides an alternative method to view system performance, rather than replacing the built-in monitoring.

### 🔹 Customizable Performance Alerts and UI theme 
- Future updates will allow users to **adjust threshold levels** for CPU, GPU, RAM, and network alerts, and toggle button for UI theme for the Dashboard.

---

## Contributors

👤 **Ricardo Danganan Jnr** *(Developer)*  
📧 Contact: [ricardo_danganan@yahoo.com](mailto:ricardo_danganan@yahoo.com)  

---

## License

📝 **MIT License**  
This project is open-source and available under the **MIT License**.

