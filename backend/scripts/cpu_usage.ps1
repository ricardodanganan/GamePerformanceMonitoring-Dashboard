# Description: This script is used to get the CPU usage of the system.
# The script uses the Get-Counter cmdlet to get the percentage of processor time used by the system.
# The script outputs the CPU usage to the console and frontend application.
$cpuUsage = Get-Counter '\Processor(_Total)\% Processor Time' | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue
$cpuUsage = [math]::Round($cpuUsage, 2)
Write-Output $cpuUsage
