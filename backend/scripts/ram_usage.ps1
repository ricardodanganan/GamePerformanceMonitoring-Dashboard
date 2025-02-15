$totalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory
$freeMemory = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024
$usedMemory = $totalMemory - $freeMemory
$ramUsage = ($usedMemory / $totalMemory) * 100
$ramUsage = [math]::Round($ramUsage, 2)

# Convert memory values from bytes to MB
$totalMemoryMB = [math]::Round($totalMemory / 1MB, 0)
$usedMemoryMB = [math]::Round($usedMemory / 1MB, 0)

# Output JSON format
$jsonOutput = @{
    totalRAM = $totalMemoryMB
    usedRAM = $usedMemoryMB
    ramUsage = $ramUsage
} | ConvertTo-Json -Compress

Write-Output $jsonOutput
