# Purpose: Get the GPU temperature of the NVIDIA GPU on the system.
# The script uses the nvidia-smi command to get the GPU temperature and outputs the temperature to the console.
# This script is used to get the GPU temperature in the frontend application.
$output = nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader
$output = $output.Trim()
Write-Output $output
