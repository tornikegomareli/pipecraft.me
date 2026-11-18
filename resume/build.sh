#!/bin/sh
# Prints resume.html to public/resume.pdf with headless Chrome
set -e
cd "$(dirname "$0")/.."
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=public/resume.pdf "file://$PWD/resume/resume.html"
