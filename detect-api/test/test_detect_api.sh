#!/bin/bash

# Test script for detect API
# Usage: ./test_detect_api.sh [image_path]

# Default image path (replace with your actual image path)
DEFAULT_IMAGE="/home/cacc/Repositories/SDDMES/data/test_images/0a2c9f2e5.jpg"

# Check if image path is provided as argument
IMAGE_PATH="${1:-$DEFAULT_IMAGE}"

# Check if image file exists
if [ ! -f "$IMAGE_PATH" ]; then
    echo "Error: Image file not found at $IMAGE_PATH"
    echo "Please provide a valid image path or place a test image at $DEFAULT_IMAGE"
    exit 1
fi

echo "Testing detect API with image: $IMAGE_PATH"

# Curl command to test the detect API
curl -X POST "http://localhost:5000/api/detect" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "images=@$IMAGE_PATH"

echo -e "\n\nAPI test completed."

# Additional test with multiple images (if you have multiple test images)
# Uncomment and modify the paths below if you want to test with multiple images
# curl -X POST "http://localhost:5000/api/detect" \
#   -H "accept: application/json" \
#   -H "Content-Type: multipart/form-data" \
#   -F "images=@image1.jpg" \
#   -F "images=@image2.jpg" \
#   -F "images=@image3.jpg"
