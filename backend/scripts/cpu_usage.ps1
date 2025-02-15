# Description: Get real-time CPU usage, CPU name, core count, and speed (GHz) using Get-Counter and Get-CimInstance cmdlets. 
# Convert the output to JSON format and output it to the console.

# Get real-time CPU usage using Get-Counter
$cpuUsage = (Get-Counter "\Processor(_Total)\% Processor Time" -SampleInterval 1).CounterSamples.CookedValue

# Round the value for better display
$cpuUsage = [math]::Round($cpuUsage, 2)

# Get CPU Name
$cpuName = (Get-CimInstance Win32_Processor).Name

# Get CPU Core Count
$cpuCores = (Get-CimInstance Win32_Processor).NumberOfCores

# Get CPU Speed (GHz)
$cpuSpeed = [math]::Round((Get-CimInstance Win32_Processor).MaxClockSpeed / 1000, 2)

# Convert to JSON format and output
Write-Output "{'cpuUsage': $cpuUsage, 'cpuName': '$cpuName', 'cpuCores': $cpuCores, 'cpuSpeed': $cpuSpeed}"
