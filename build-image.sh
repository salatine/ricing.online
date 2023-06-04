#!/usr/bin/env bash
set -e

./build-v86.sh
./image_builder/build.sh v86/ build/v86/ build/images/
