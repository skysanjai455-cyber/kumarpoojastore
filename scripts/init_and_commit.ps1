# Init and commit script for Windows PowerShell
# Usage: Open PowerShell at project root and run: .\scripts\init_and_commit.ps1

Set-StrictMode -Version Latest

$repoRoot = Resolve-Path .
if(-not (Get-Command git -ErrorAction SilentlyContinue)){
  Write-Host 'Git is not installed or not in PATH. Please install Git first.'; exit 1
}

# Initialize repo if needed
if(-not (Test-Path .git)){
  git init
  Write-Host 'Initialized empty git repository.'
} else {
  Write-Host 'Git repository already initialized.'
}

# Ensure .gitignore exists
if(-not (Test-Path .gitignore)){
  "node_modules/`n.next/`n.DS_Store" | Out-File -FilePath .gitignore -Encoding utf8
  Write-Host 'Created basic .gitignore.'
}

# Stage all files except those ignored
git add -A

# If no changes to commit, exit
$changes = git status --porcelain
if([string]::IsNullOrWhiteSpace($changes)){
  Write-Host 'No changes to commit.'; exit 0
}

# Commit
$commitMsg = 'chore: initial commit - prepare project for Netlify'
git commit -m $commitMsg
Write-Host ('Committed with message: {0}' -f $commitMsg)

Write-Host 'Next steps: create a repository on GitHub (or your git host), add it as remote:'
Write-Host '  git remote add origin "<your-repo-url>"'
Write-Host '  git branch -M main'
Write-Host '  git push -u origin main'

Write-Host 'Then connect the repo to Netlify and deploy. See scripts/DEPLOY_README.md for notes.'
