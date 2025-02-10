# Description: This script calculates the RAM usage of the system and returns the value in percentage.
# The script uses the Get-CimInstance cmdlet to get the total physical memory and free physical memory of the system.
# It then calculates the used memory, RAM usage percentage, and outputs the RAM usage to the console and frontend application.
$totalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory
$freeMemory = (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024
$usedMemory = $totalMemory - $freeMemory
$ramUsage = ($usedMemory / $totalMemory) * 100
$ramUsage = [math]::Round($ramUsage, 2)
Write-Output $ramUsage
