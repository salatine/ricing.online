#!/usr/bin/env bash
set -veu

V86_PATH="$(dirname "$0")"/../v86/
IMAGES_OUTPUT="$(dirname "$0")"/../build/images
OUT_ROOTFS_TAR="$IMAGES_OUTPUT"/debian-9p-rootfs.tar
OUT_ROOTFS_FLAT="$IMAGES_OUTPUT"/debian-9p-rootfs-flat
OUT_FSJSON="$IMAGES_OUTPUT"/debian-base-fs.json
CONTAINER_NAME=debian-full
IMAGE_NAME=i386/debian-full

mkdir -p "$IMAGES_OUTPUT"
docker build . --platform linux/386 --rm --tag "$IMAGE_NAME"
docker rm "$CONTAINER_NAME" || true
docker create --platform linux/386 -t -i --name "$CONTAINER_NAME" "$IMAGE_NAME" bash

docker export "$CONTAINER_NAME" > "$OUT_ROOTFS_TAR"

"$V86_PATH"/tools/fs2json.py --out "$OUT_FSJSON" "$OUT_ROOTFS_TAR"

# Note: Not deleting old files here
mkdir -p "$OUT_ROOTFS_FLAT"
# paraaaaaaaa
"$V86_PATH"/tools/copy-to-sha256.py "$OUT_ROOTFS_TAR" "$OUT_ROOTFS_FLAT"

echo "$OUT_ROOTFS_TAR", "$OUT_ROOTFS_FLAT" and "$OUT_FSJSON" created.
