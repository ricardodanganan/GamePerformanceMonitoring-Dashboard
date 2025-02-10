# Description: This script is used to get the GPU usage of the NVIDIA GPU.
# The script uses the nvidia-smi command to get the GPU usage and outputs the usage to the console.
# This script is used to get the GPU usage in the frontend application.
$nvidiaOutput = & nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits
if ($nvidiaOutput) {
    $gpuUsage = $nvidiaOutput -replace "\s", "" # Clean up any whitespace
    Write-Output $gpuUsage
} else {
    Write-Output "0" # Default to 0 if no data is found
}
