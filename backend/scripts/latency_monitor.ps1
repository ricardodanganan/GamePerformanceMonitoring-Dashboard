$server = "8.8.8.8"  # Google DNS for latency test
$pingResult = Test-Connection -ComputerName $server -Count 5 -ErrorAction SilentlyContinue

# If ping fails, return an error
if (-not $pingResult) {
    Write-Output "PingFailed"
    exit
}

# Extract latency (Ping time)
$latencyValues = $pingResult.ResponseTime
$avgLatency = [math]::Round(($latencyValues | Measure-Object -Average).Average, 2)

# Simulate packet loss calculation
$totalPackets = 5
$receivedPackets = ($latencyValues | Measure-Object).Count
$packetLoss = [math]::Round((($totalPackets - $receivedPackets) / $totalPackets) * 100, 2)

# Detect Wi-Fi or Ethernet Connection Type
$networkType = "Unknown"
$interfaces = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }

foreach ($interface in $interfaces) {
    if ($interface.InterfaceDescription -match "Wi-Fi") {
        $networkType = "Wi-Fi"
        break
    } elseif ($interface.InterfaceDescription -match "Ethernet") {
        $networkType = "Ethernet"
        break
    }
}

# Output as JSON
$jsonOutput = @{
    latency = "$avgLatency ms"
    packetLoss = "$packetLoss %"
    connectionType = "$networkType"
} | ConvertTo-Json -Compress

Write-Output $jsonOutput
