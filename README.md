# Game Performance & IT Monitoring Dashboard

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Expected Outcomes](#expected-outcomes)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting & Contingency Plans](#troubleshooting--contingency-plans)
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

1. **Launch the application** and grant the necessary system permissions.
2. **View system performance metrics in real-time**:
   - CPU & GPU temperature
   - RAM & disk usage
   - Network bandwidth & latency
3. **Receive alerts** when system thresholds are exceeded.
4. **Use the game optimization module** to adjust settings based on your system specs.

---

## Dependencies

- **Frontend:** React.js, Chart.js  
- **Backend:** WebSockets, PowerShell Scripts  
- **APIs:** Steam API (for game detection)  
- **Database (Future Phase):** Supabase (for cloud-based performance tracking)  
---

## Future Enhancements

💡 Multi-system monitoring across LAN  
💡 Cloud-based performance tracking  
💡 In-game overlay for real-time stats  
💡 AI-based game optimization recommendations  

---

## Troubleshooting & Contingency Plans

⚠ **Hardware Compatibility Issues**  
🔹 Solution: Provide alternative monitoring methods if some system data is inaccessible.  

⚠ **PowerShell Script Execution Issues**  
🔹 Solution: Guide users on enabling script execution securely or create an alternative solution.  

⚠ **High Resource Consumption from Real-Time Monitoring**  
🔹 Solution: Optimize backend scripts and use WebSockets for efficient data transfer.  

⚠ **Steam API or NVIDIA API Limitations**  
🔹 Solution: Implement manual game detection and allow users to enter their system specs for optimization recommendations.  

---

## Contributors

👤 **Ricardo Danganan Jnr** *(Developer)*  
📧 Contact: [ricardo_danganan@yahoo.com](mailto:ricardo_danganan@yahoo.com)  

---

## License

📝 **MIT License**  
This project is open-source and available under the **MIT License**.

