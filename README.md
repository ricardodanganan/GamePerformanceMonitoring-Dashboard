# Game Performance & IT Monitoring Dashboard

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Project Iterations](#project-iterations)
  - [Iteration 1: Real-Time System Monitoring](#iteration-1-real-time-system-monitoring)
  - [Iteration 2: Game Optimization Module](#iteration-2-game-optimization-module)
- [Expected Outcomes](#expected-outcomes)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting & Contingency Plans](#troubleshooting--contingency-plans)
- [Contributors](#contributors)
- [License](#license)

---

## Introduction

The **Game Performance & IT Monitoring Dashboard** is a **real-time monitoring tool** designed to track system performance metrics and optimize gaming experiences. It provides users with detailed insights into their CPU, GPU, RAM, disk usage, and network performance while offering optimization recommendations tailored to their system specifications.

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

## Configuration

To use Steam API for detecting installed games, configure your API key in `.env`:
```sh
STEAM_API_KEY=your_steam_api_key
```

For PowerShell monitoring scripts, ensure you have:
```sh
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
*(Run this command in PowerShell as Administrator if scripts are blocked.)*

---

## Project Iterations

### Iteration 1: Real-Time System Monitoring (Ongoing)
- **Track** CPU, GPU, RAM, and disk usage in real-time using Windows PowerShell scripts.
- **Implement alert notifications** for overheating and high resource consumption.
- **Monitor network performance** (ping, bandwidth, latency) via WebSockets.
- **Identify connection issues** affecting gameplay.

### Iteration 2: Game Optimization Module (Started & TBC)
- **Detect installed games** via the Steam API.
- **Recommend optimal system settings** based on hardware vs. game requirements.
- **Store historical performance data** in a local JSON file.
- **Future enhancement:** Sync data to a cloud database for multi-device access.

---

## Expected Outcomes

By the end of this semester, the project will:
✔ **Provide a functional real-time monitoring dashboard.**  
✔ **Track system metrics & alert users when thresholds are exceeded.**  
✔ **Measure network latency & bandwidth for multiplayer gaming.**  
✔ **Recommend performance optimizations based on system hardware.**  
✔ **Store historical performance logs for trend analysis.**
✔ **In-game overlay.**   

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

