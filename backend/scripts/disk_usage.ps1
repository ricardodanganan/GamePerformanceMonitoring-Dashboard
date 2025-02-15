# Description: PowerShell script to get disk usage information for C: drive in GB and percentage.
# The script calculates total disk space, free space, used space, disk usage percentage, and outputs the information in JSON format.

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
