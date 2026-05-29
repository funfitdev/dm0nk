#!/bin/bash

cd "$(dirname "$0")" || exit 1

if [ -z "$1" ]; then
    echo "Error: Version number is required"
    echo "Usage: ./build.sh <version>"
    echo "Example: ./build.sh 1.0.1"
    exit 1
fi

VERSION=$1

echo "Building Docker image for version $VERSION..."
docker build --platform=linux/amd64 -t ghcr.io/funfitdev/dm0nk:$VERSION .

echo "Pushing Docker image to registry..."
docker push ghcr.io/funfitdev/dm0nk:$VERSION

echo "Deployment complete for version $VERSION"