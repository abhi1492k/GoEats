# Netlify build hook trigger scripts

Two small scripts to trigger the configured Netlify build hook for the project.

1) PowerShell (Windows)

Usage:

```powershell
# set env var for this session
$env:NETLIFY_BUILD_HOOK = 'https://api.netlify.com/build_hooks/your_hook_here'
.\scripts\trigger-netlify-build.ps1
# -or- pass URL directly
.\scripts\trigger-netlify-build.ps1 -HookUrl 'https://api.netlify.com/build_hooks/your_hook_here'
```

2) Node (cross-platform)

Usage:

```powershell
# set env var and run
$env:NETLIFY_BUILD_HOOK = 'https://api.netlify.com/build_hooks/your_hook_here'
node scripts/trigger-netlify-build.js

# or pass the URL as the first argument
node scripts/trigger-netlify-build.js https://api.netlify.com/build_hooks/your_hook_here
```

Replace `your_hook_here` with your actual Netlify build hook ID/URL. Be careful not to commit secrets to the repo — prefer setting the environment variable on your CI or locally.