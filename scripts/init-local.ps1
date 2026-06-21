# Konfydence Challenge local scaffold helper
# Run from PowerShell.

$target = "C:\Users\mbanw\konfydencechallenge"

if (!(Test-Path $target)) {
  New-Item -ItemType Directory -Path $target | Out-Null
}

Write-Host "Target folder ready: $target"

$folders = @(
  "app",
  "app/(public)",
  "app/(auth)",
  "app/challenge",
  "app/admin",
  "components",
  "components/challenge",
  "components/dashboard",
  "data",
  "data/scenarios",
  "docs",
  "lib",
  "lib/challenge",
  "lib/scoring",
  "lib/certificates",
  "prisma",
  "public",
  "public/assets",
  "scripts",
  "tests",
  "types"
)

foreach ($folder in $folders) {
  $path = Join-Path $target $folder
  if (!(Test-Path $path)) {
    New-Item -ItemType Directory -Path $path | Out-Null
  }
}

Write-Host "Folders created."
Write-Host "Next: copy README.md, docs, data/scenarios, .env.example, and .gitignore into the target folder."
