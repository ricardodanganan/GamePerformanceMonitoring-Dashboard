# Latency Monitoring Script
# This script measures the network latency (ping) to a specified target server.
# It calculates the Round-Trip Time (RTT) in milliseconds and outputs the result.
# This is particularly helpful for gamers to monitor their connection stability and detect potential lag issues.

# Target server for the ping
$target = "8.8.8.8"  # Google DNS is used as a reliable and globally accessible server

# Perform the ping and extract the average Round-Trip Time (RTT)
$pingResult = Test-Connection -ComputerName $target -Count 1 -ErrorAction SilentlyContinue

if ($pingResult) {
    # Output the latency (in milliseconds)
    $pingResult.ResponseTime
} else {
    # If ping fails, output an error
    Write-Output "PingFailed"
}

# Purpose:
# 1. Measures latency to a game server or reliable target like Google DNS.
# 2. Helps gamers understand their network performance and identify high latency, which can cause lag.
# 3. Useful for troubleshooting network issues in real-time during gameplay.
