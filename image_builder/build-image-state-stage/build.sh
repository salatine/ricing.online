#!/usr/bin/env bash
set -ev

IMAGES_PATH=$(realpath "$1")
V86_SRC_PATH=$(realpath "$2")
V86_BUILD_PATH=$(realpath "$3")
OUTPUT_PATH=$(realpath "$4")

DOCKER_CONTEXT="$(dirname "$0")"

rm -rf "$DOCKER_CONTEXT"/inputs
mkdir -p "$DOCKER_CONTEXT"/inputs

cp -rf "$IMAGES_PATH" "$DOCKER_CONTEXT"/inputs/images

mkdir -p "$DOCKER_CONTEXT"/inputs/v86
cp -rf "$V86_SRC_PATH" "$DOCKER_CONTEXT"/inputs/v86/src
cp -rf "$V86_BUILD_PATH" "$DOCKER_CONTEXT"/inputs/v86/build

docker buildx build --rm -t build-image-state-outputs \
    "$DOCKER_CONTEXT" \
    -o "$OUTPUT_PATH"

rm -rf "$DOCKER_CONTEXT"/inputs
