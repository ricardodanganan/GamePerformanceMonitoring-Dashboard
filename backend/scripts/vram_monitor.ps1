# VRAM Usage Monitoring Script for NVIDIA GPUs
# Fetches GPU Memory Usage using NVIDIA-SMI and outputs JSON

# Run nvidia-smi and extract VRAM usage
$gpuInfo = & nvidia-smi --query-gpu=memory.used,memory.total --format=csv,noheader,nounits

# Parse the output
$gpuStats = $gpuInfo -split ", "
$vramUsed = [math]::Round([double]$gpuStats[0], 2)  # VRAM Used in MB
$vramTotal = [math]::Round([double]$gpuStats[1], 2)  # Total VRAM in MB
$vramUsage = [math]::Round(($vramUsed / $vramTotal) * 100, 2)  # VRAM Usage Percentage

# Output JSON
Write-Output "{'vramUsed': $vramUsed, 'vramTotal': $vramTotal, 'vramUsage': $vramUsage}"
