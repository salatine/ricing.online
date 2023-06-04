#!/usr/bin/env bash

# Exit with nonzero exit code if anything fails
set -e

# Create dist folder
mkdir dist

# Build the Debian image used by the emulator
./build-image.sh

# Install the dependencies
npm install

# Build the JS/CSS files
parcel build

# Copy the files to the dist folder
cp -r build dist/build

# Copy index files to the dist folder
cp index.html dist/
cp index.css dist/
