#!/usr/bin/env bash
set -veu

IMAGES_PATH=$(realpath "$1")
V86_SRC_PATH=$(realpath "$2")
V86_BUILD_PATH=$(realpath "$3")
OUTPUT_PATH=$(realpath "$4")

THIS_DIRECTORY="$(realpath $(dirname "$0"))"
DOCKER_CONTEXT="/"
DOCKER_CACHE_FLAGS=()
if [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
    DOCKER_CACHE_FLAGS=(
        "--cache-from=type=gha,scope=$GITHUB_REF_NAME-image-state"
        "--cache-to=type=gha,mode=max,scope=$GITHUB_REF_NAME-image-state"
    )
fi

# Create .dockerignore file, specifying the files we're interested
echo '*' > "$THIS_DIRECTORY"/Dockerfile.dockerignore
echo "!$IMAGES_PATH" >> "$THIS_DIRECTORY"/Dockerfile.dockerignore
# echo "$IMAGES_PATH/debian-state-base.bin.zst" >> "$THIS_DIRECTORY"/Dockerfile.dockerignore
echo "!$V86_SRC_PATH" >> "$THIS_DIRECTORY"/Dockerfile.dockerignore
echo "!$V86_BUILD_PATH" >> "$THIS_DIRECTORY"/Dockerfile.dockerignore
echo "!$THIS_DIRECTORY" >> "$THIS_DIRECTORY"/Dockerfile.dockerignore

mkdir -p "$OUTPUT_PATH"

docker buildx build --progress plain --no-cache --rm -t build-image-state-outputs "${DOCKER_CACHE_FLAGS[@]}" \
    --build-arg "IMAGES_PATH=$IMAGES_PATH" \
    --build-arg "V86_SRC_PATH=$V86_SRC_PATH" \
    --build-arg "V86_BUILD_PATH=$V86_BUILD_PATH" \
    --build-arg "SCRIPTS_PATH=$THIS_DIRECTORY" \
    -f "$THIS_DIRECTORY"/Dockerfile \
    "$DOCKER_CONTEXT" \
    -o "$OUTPUT_PATH"
