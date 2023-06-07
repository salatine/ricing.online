#!/usr/bin/env bash
set -veu

V86_SRC_PATH=$(realpath "$1")
IMAGES_OUTPUT=$(realpath "$2")

DOCKER_CONTEXT="$(dirname "$0")"
OUT_ROOTFS_TAR="$IMAGES_OUTPUT"/debian-9p-rootfs.tar
OUT_ROOTFS_FLAT="$IMAGES_OUTPUT"/debian-9p-rootfs-flat
OUT_FSJSON="$IMAGES_OUTPUT"/debian-base-fs.json
CONTAINER_NAME=debian-full
IMAGE_NAME=i386/debian-full

DOCKER_CACHE_FLAGS=()
if [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
    DOCKER_CACHE_FLAGS=(
        "--cache-from=type=gha,scope=$GITHUB_REF_NAME-image-contents"
        "--cache-to=type=gha,mode=max,scope=$GITHUB_REF_NAME-image-contents"
    )
fi

mkdir -p "$IMAGES_OUTPUT"
docker buildx build "$DOCKER_CONTEXT" --progress plain --platform linux/386 --rm --tag "$IMAGE_NAME" \
    "${DOCKER_CACHE_FLAGS[@]}" -o "type=tar,dest=$OUT_ROOTFS_TAR"

"$(dirname "$0")"/fs2json.py --ignore-mtime --out "$OUT_FSJSON" "$OUT_ROOTFS_TAR"

rm -rf "$OUT_ROOTFS_FLAT"
mkdir -p "$OUT_ROOTFS_FLAT"
# This emits way too much text
"$V86_SRC_PATH"/tools/copy-to-sha256.py "$OUT_ROOTFS_TAR" "$OUT_ROOTFS_FLAT" > /dev/null 2>&1

# We won't really need this
rm "$OUT_ROOTFS_TAR"

echo "$OUT_ROOTFS_FLAT" and "$OUT_FSJSON" created.
