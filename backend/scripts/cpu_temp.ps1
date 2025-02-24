# Description: This script is used to generate a random number between 40 and 45 to simulate the CPU temperature.
# The script uses the Get-Random cmdlet to generate a random number between 40 and 45 and outputs the number to the console.
# This script is used to simulate the CPU temperature in the frontend application.
$cpuTemp = Get-Random -Minimum 50 -Maximum 55
Write-Output $cpuTemp
