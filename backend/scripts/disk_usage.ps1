# Description: This script calculates the disk usage percentage of the C drive on a Windows machine.
# The script uses the Get-PSDrive cmdlet to get information about the C drive, calculates the total space on the drive,
# and then calculates the percentage of used space. The script outputs the disk usage percentage to the console.
$disk = Get-PSDrive C | Select-Object Used, Free
$totalSpace = $disk.Used + $disk.Free
$usedPercentage = ($disk.Used / $totalSpace) * 100
$usedPercentage = [math]::Round($usedPercentage, 2)
Write-Output $usedPercentage
