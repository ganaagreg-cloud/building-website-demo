<#
.SYNOPSIS
  Generate grayscale depth maps for all Five Star dollhouse images.
  Prerequisites: pip install -r tools/depth/requirements.txt
.EXAMPLE
  npm run render:depth
#>

$ErrorActionPreference = "Stop"
$scriptDir  = $PSScriptRoot
$repoRoot   = (Get-Item $scriptDir).Parent.Parent.FullName

$dollhouses = @(
  "$repoRoot\public\clients\five-star\unit-types\2br-43-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\2br-44-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\2br-51-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\2br-56-dollhouse.png",
  "$repoRoot\public\clients\five-star\unit-types\3br-63-dollhouse.png"
)

$existing = $dollhouses | Where-Object { Test-Path $_ }
if ($existing.Count -eq 0) {
    Write-Error "No dollhouse PNGs found under public/clients/five-star/unit-types/."
    exit 1
}

$pyScript = Join-Path $scriptDir "generate_depth.py"
python $pyScript @existing
