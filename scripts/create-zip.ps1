param(
  [string]$Source = "$PSScriptRoot\..",
  [string]$Destination = "$PSScriptRoot\..\kumarpoojastore.zip"
)

Write-Host "Creating ZIP from $Source to $Destination"
Compress-Archive -Path $Source -DestinationPath $Destination -Force
Write-Host "Done. Zip created at $Destination"
