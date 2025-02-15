# Get all GPU Names
$gpuNames = Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name

# Filter to show only the dedicated GPU (ignore Intel Integrated Graphics)
$dedicatedGPU = $gpuNames | Where-Object {$_ -notmatch "Intel"}

# Get GPU Utilization (Usage %)
$gpuUsage = & nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits
$gpuUsage = [math]::Round([double]$gpuUsage, 2)

# Get GPU Clock Speed (MHz)
$gpuClockSpeed = & nvidia-smi --query-gpu=clocks.gr --format=csv,noheader,nounits
$gpuClockSpeed = [math]::Round([double]$gpuClockSpeed, 0)

# Get GPU Power Consumption (Watts)
$gpuPower = & nvidia-smi --query-gpu=power.draw --format=csv,noheader,nounits
$gpuPower = [math]::Round([double]$gpuPower, 2)

# Output as JSON
$jsonOutput = @{
    gpuName = $dedicatedGPU
    gpuUsage = $gpuUsage
    gpuClockSpeed = $gpuClockSpeed
    gpuPower = $gpuPower
} | ConvertTo-Json -Compress

Write-Output $jsonOutput
