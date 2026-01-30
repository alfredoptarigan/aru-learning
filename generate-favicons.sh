#!/bin/bash

# Favicon Generation Script for ARU Learning
# This script generates all necessary favicon files from logo.svg
# Requires: ImageMagick (install with: brew install imagemagick on macOS)

set -e

LOGO_SVG="public/logo.svg"
PUBLIC_DIR="public"

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick is not installed"
    echo ""
    echo "Please install ImageMagick:"
    echo "  macOS:   brew install imagemagick"
    echo "  Ubuntu:  sudo apt-get install imagemagick"
    echo "  CentOS:  sudo yum install imagemagick"
    echo ""
    echo "Alternatively, use an online tool:"
    echo "  https://realfavicongenerator.net/"
    exit 1
fi

# Check if logo.svg exists
if [ ! -f "$LOGO_SVG" ]; then
    echo "❌ Error: $LOGO_SVG not found"
    exit 1
fi

echo "🎨 Generating favicons from $LOGO_SVG..."
echo ""

# Function to convert SVG to PNG
convert_svg() {
    local size=$1
    local output=$2
    
    if command -v magick &> /dev/null; then
        magick -background none -density 300 "$LOGO_SVG" -resize "${size}x${size}" "$output"
    else
        convert -background none -density 300 "$LOGO_SVG" -resize "${size}x${size}" "$output"
    fi
}

# Generate favicon.ico (16x16, 32x32, 48x48)
echo "📦 Generating favicon.ico..."
convert_svg 16 "$PUBLIC_DIR/favicon-16.png"
convert_svg 32 "$PUBLIC_DIR/favicon-32.png"
convert_svg 48 "$PUBLIC_DIR/favicon-48.png"

if command -v magick &> /dev/null; then
    magick "$PUBLIC_DIR/favicon-16.png" "$PUBLIC_DIR/favicon-32.png" "$PUBLIC_DIR/favicon-48.png" "$PUBLIC_DIR/favicon.ico"
else
    convert "$PUBLIC_DIR/favicon-16.png" "$PUBLIC_DIR/favicon-32.png" "$PUBLIC_DIR/favicon-48.png" "$PUBLIC_DIR/favicon.ico"
fi

# Clean up temporary files
rm "$PUBLIC_DIR/favicon-16.png" "$PUBLIC_DIR/favicon-32.png" "$PUBLIC_DIR/favicon-48.png"
echo "✅ favicon.ico created"

# Generate PNG favicons
echo "📦 Generating PNG favicons..."
convert_svg 16 "$PUBLIC_DIR/favicon-16x16.png"
echo "✅ favicon-16x16.png created"

convert_svg 32 "$PUBLIC_DIR/favicon-32x32.png"
echo "✅ favicon-32x32.png created"

# Generate Apple Touch Icons
echo "📦 Generating Apple Touch Icons..."
convert_svg 180 "$PUBLIC_DIR/apple-touch-icon.png"
echo "✅ apple-touch-icon.png created"

# Generate Android Chrome icons
echo "📦 Generating Android Chrome icons..."
convert_svg 192 "$PUBLIC_DIR/android-chrome-192x192.png"
echo "✅ android-chrome-192x192.png created"

convert_svg 512 "$PUBLIC_DIR/android-chrome-512x512.png"
echo "✅ android-chrome-512x512.png created"

# Generate Safari Pinned Tab (should be monochrome)
echo "📦 Generating Safari Pinned Tab..."
convert_svg 150 "$PUBLIC_DIR/safari-pinned-tab-temp.png"

# Convert to monochrome SVG (simplified version)
if command -v magick &> /dev/null; then
    magick "$PUBLIC_DIR/safari-pinned-tab-temp.png" -alpha off -colorspace gray -threshold 50% "$PUBLIC_DIR/safari-pinned-tab.svg"
else
    convert "$PUBLIC_DIR/safari-pinned-tab-temp.png" -alpha off -colorspace gray -threshold 50% "$PUBLIC_DIR/safari-pinned-tab.svg"
fi

rm "$PUBLIC_DIR/safari-pinned-tab-temp.png"
echo "✅ safari-pinned-tab.svg created"

echo ""
echo "🎉 All favicons generated successfully!"
echo ""
echo "Generated files:"
echo "  - favicon.ico"
echo "  - favicon-16x16.png"
echo "  - favicon-32x32.png"
echo "  - apple-touch-icon.png"
echo "  - android-chrome-192x192.png"
echo "  - android-chrome-512x512.png"
echo "  - safari-pinned-tab.svg"
echo ""
echo "✅ Your application is now ready with all favicon files!"
