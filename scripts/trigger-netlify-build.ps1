param(
  [string]$HookUrl = $env:NETLIFY_BUILD_HOOK
)

if (-not $HookUrl) {
  Write-Error "No build hook URL provided. Set the NETLIFY_BUILD_HOOK environment variable or pass the URL as the first argument."
  exit 1
}

# POST an empty JSON payload to the Netlify build hook
$cmd = "curl.exe -s -o response.txt -w \"%{http_code}\" -X POST -H \"Content-Type: application/json\" -d \"{}\" $HookUrl"
Write-Output "Triggering Netlify build hook..."
try {
  $code = Invoke-Expression $cmd
  if ($LASTEXITCODE -ne 0) { throw "curl failed with exit code $LASTEXITCODE" }
  Write-Output "Netlify build hook returned HTTP code: $code"
} finally {
  Remove-Item response.txt -ErrorAction SilentlyContinue
}
