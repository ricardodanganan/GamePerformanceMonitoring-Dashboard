# Get CPU Usage
$cpuUsage = Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average

# Get CPU Name
$cpuName = (Get-CimInstance Win32_Processor).Name

# Get CPU Core Count
$cpuCores = (Get-CimInstance Win32_Processor).NumberOfCores

# Get CPU Speed (GHz)
$cpuSpeed = [math]::Round((Get-CimInstance Win32_Processor).MaxClockSpeed / 1000, 2)

# Convert to JSON format and output
Write-Output "{'cpuUsage': $cpuUsage, 'cpuName': '$cpuName', 'cpuCores': $cpuCores, 'cpuSpeed': $cpuSpeed}"
