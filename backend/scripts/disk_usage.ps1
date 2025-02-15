# Get total disk space and free space for C: drive
$totalDisk = (Get-PSDrive C | Select-Object -ExpandProperty Used) + (Get-PSDrive C | Select-Object -ExpandProperty Free)
$freeDisk = Get-PSDrive C | Select-Object -ExpandProperty Free
$usedDisk = $totalDisk - $freeDisk

# Calculate disk usage percentage
$diskUsage = ($usedDisk / $totalDisk) * 100
$diskUsage = [math]::Round($diskUsage, 2)

# Convert values to GB for better readability
$totalDiskGB = [math]::Round($totalDisk / 1GB, 2)
$usedDiskGB = [math]::Round($usedDisk / 1GB, 2)

# Output JSON format
$jsonOutput = @{
    totalDisk = $totalDiskGB
    usedDisk = $usedDiskGB
    diskUsage = $diskUsage
} | ConvertTo-Json -Compress

Write-Output $jsonOutput
