#!/usr/bin/env bash
set -euo pipefail
command -v gh >/dev/null || { echo '需要先安装 GitHub CLI: https://cli.github.com/'; exit 1; }
gh auth status >/dev/null || { echo '请先运行 gh auth login'; exit 1; }
[ -d .git ] || git init -b main
git add .
git commit -m 'Launch DataSlices with Disappearing Stars' || true
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/tseng71/dataslices.git
fi
git push -u origin main
echo '代码已推送。请在仓库 Settings → Pages 中选择 GitHub Actions。'
