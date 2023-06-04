#!/usr/bin/env bash
set -ev

V86_SRC_PATH=$(realpath "$1")
V86_BUILD_PATH=$(realpath "$2")
IMAGES_OUTPUT_PATH=$(realpath "$3")

THIS_DIRECTORY="$(dirname "$0")"

"$THIS_DIRECTORY"/build-image-contents-stage/build.sh "$V86_SRC_PATH" "$IMAGES_OUTPUT_PATH"
"$THIS_DIRECTORY"/build-image-state-stage/build.sh "$IMAGES_OUTPUT_PATH" "$V86_SRC_PATH" "$V86_BUILD_PATH" "$IMAGES_OUTPUT_PATH"
