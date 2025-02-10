# Game Performance & IT Monitoring Dashboard

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Contributors](#contributors)
- [License](#license)

---

## Introduction

The **Game Performance** & **IT Monitoring Dashboard** is my final year IT Management project, developed as part of my 4th-year finals project. This real-time monitoring and optimization tool is designed to enhance gaming performance by providing comprehensive system insights. It tracks CPU and GPU usage, temperatures, RAM consumption, disk activity, and network performance, ensuring gamers have a clear view of their system’s health. Equipped with threshold-based alerts, historical performance tracking, and Steam API integration, it helps optimize system resources, detect installed games, and provide tailored recommendations. Additionally, I am implementing an in-game overlay feature, allowing players to monitor system performance without exiting their game. Future enhancements include cloud-based monitoring, AI-driven game optimization, and multi-system performance tracking across LAN environments.

---

## Features

✅ **Real-time performance tracking** – Monitor CPU, GPU, RAM, disk usage, and network performance dynamically.  
✅ **System alerts for overheating & resource overuse** – Receive notifications when resource consumption exceeds safe limits.  
✅ **Steam API integration** – Automatically detect installed games based on the user's Steam library.  
✅ **Optimized system recommendations** – Suggest best performance settings based on game requirements and hardware specifications.  
✅ **Historical performance tracking** – Store real-time monitoring data in a local JSON file for future analysis.  
✅ **Cloud synchronization (Future Enhancement)** – Allow users to sync performance logs across multiple devices via cloud storage.  
✅ **Multi-system monitoring across LAN (Planned)** – Track performance data from multiple systems within a local network.  
✅ **In-game overlay (Planned)** – Display real-time system stats while gaming without exiting the application.  
✅ **AI-driven game optimization (Planned)** – Use machine learning to recommend system tweaks for better performance.  

---

## Usage

### View system performance metrics in real-time
- **CPU & GPU Usage & Temperature**: Graphical representation via Chart.js.
- **RAM & Disk Usage**: Track memory and storage performance.
- **Network Monitoring**: Display ping, bandwidth usage, and latency.

### Receive alerts when system thresholds are exceeded
- **Automatic notifications** will appear when CPU, GPU, or RAM usage reaches critical levels.
- **Audio alerts** will trigger for immediate attention.

### Use the game optimization module *(Upcoming Feature)*
- **Detect installed games** via Steam API.
- **Compare system hardware** to recommended settings.
- **Receive optimization suggestions** based on detected hardware and software.

### Access in-game overlay *(Planned Feature)*
- **Live stats inside your game** without minimizing it.
- **Toggle visibility via a hotkey** to enable/disable the overlay.

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

### APIs & Tools:
- **Steam API** – For detecting installed games
- **NVIDIA API (Planned)** – For AI-driven optimizations 

---

## Contributors

👤 **Ricardo Danganan Jnr** *(Developer)*  
📧 Contact: [ricardo_danganan@yahoo.com](mailto:ricardo_danganan@yahoo.com)  

---

## License

📝 **MIT License**  
This project is open-source and available under the **MIT License**.

