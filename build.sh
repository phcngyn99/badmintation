#!/bin/bash

# Build script for badminton tournament scheduler
# Optimizes files for production deployment

echo "=================================="
echo "Building Badminton Tournament App"
echo "=================================="

# Clean and create dist directory
echo "1. Cleaning dist directory..."
rm -rf dist
mkdir -p dist/css dist/js

# Copy and minify HTML (manual minification)
echo "2. Minifying HTML..."
cat index.html | \
  sed 's/<!--.*-->//g' | \
  tr -s ' ' | \
  sed 's/> </></g' | \
  sed '/^[[:space:]]*$/d' > dist/index.html

# Copy and minify CSS (remove comments and whitespace)
echo "3. Minifying CSS..."
for file in css/*.css; do
  filename=$(basename "$file")
  cat "$file" | \
    sed 's|/\*.*\*/||g' | \
    tr -s ' ' | \
    sed 's/: /:/g' | \
    sed 's/ {/{/g' | \
    sed 's/{ /{/g' | \
    sed 's/ }/}/g' | \
    sed '/^[[:space:]]*$/d' > "dist/css/$filename"
done

# Copy and minify JS (remove comments and extra whitespace)
echo "4. Minifying JS..."
for file in js/*.js; do
  filename=$(basename "$file")
  cat "$file" | \
    sed 's|//.*$||g' | \
    sed 's|/\*.*\*/||g' | \
    tr -s ' ' | \
    sed '/^[[:space:]]*$/d' > "dist/js/$filename"
done

# Copy configuration files
echo "5. Copying configuration files..."
cp _headers dist/_headers 2>/dev/null || true
cp netlify.toml dist/netlify.toml 2>/dev/null || true
cp README.md dist/README.md 2>/dev/null || true
cp PROJECT_SUMMARY.md dist/PROJECT_SUMMARY.md 2>/dev/null || true
cp AI_AGENT_GUIDE.md dist/AI_AGENT_GUIDE.md 2>/dev/null || true

# Calculate sizes
echo ""
echo "=================================="
echo "Build Complete!"
echo "=================================="
echo ""
echo "Size comparison:"
ORIGINAL_SIZE=$(du -sh . 2>/dev/null | awk '{print $1}')
DIST_SIZE=$(du -sh dist 2>/dev/null | awk '{print $1}')
echo "Original: $ORIGINAL_SIZE"
echo "Optimized: $DIST_SIZE"
echo ""
echo "Files ready in dist/ directory"
echo "=================================="

