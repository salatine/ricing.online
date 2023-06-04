#!/usr/bin/env bash
set -e

./build-v86.sh
./image_builder/build-container.sh
./image_builder/build-state.cjs
./image_builder/compress-state.sh
