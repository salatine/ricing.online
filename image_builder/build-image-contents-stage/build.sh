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

mkdir -p "$IMAGES_OUTPUT"
docker buildx build "$DOCKER_CONTEXT" --progress plain --platform linux/386 --rm --tag "$IMAGE_NAME"
docker rm "$CONTAINER_NAME" || true
docker create --platform linux/386 -t -i --name "$CONTAINER_NAME" "$IMAGE_NAME" bash

docker export "$CONTAINER_NAME" > "$OUT_ROOTFS_TAR"

"$(dirname "$0")"/fs2json.py --ignore-mtime --out "$OUT_FSJSON" "$OUT_ROOTFS_TAR"

mkdir -p "$OUT_ROOTFS_FLAT"
# This emits way too much text
"$V86_SRC_PATH"/tools/copy-to-sha256.py "$OUT_ROOTFS_TAR" "$OUT_ROOTFS_FLAT" > /dev/null

# We won't really need this
rm "$OUT_ROOTFS_TAR"

echo "$OUT_ROOTFS_FLAT" and "$OUT_FSJSON" created.
