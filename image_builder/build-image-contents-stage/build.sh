#!/usr/bin/env bash
set -veu

THIS_DIRECTORY="$(dirname "$0")"

V86_SRC_PATH=$(realpath "$1")
IMAGES_OUTPUT=$(realpath "$2")

DOCKER_CONTEXT="$THIS_DIRECTORY"
OUT_ROOTFS_TAR="$IMAGES_OUTPUT"/debian-9p-rootfs.tar
OUT_ROOTFS_FLAT="$IMAGES_OUTPUT"/debian-9p-rootfs-flat
OUT_FSJSON="$IMAGES_OUTPUT"/debian-base-fs.json

source "$THIS_DIRECTORY"/../set-docker-cache-flags.sh
set_docker_cache_flags "image-contents"

mkdir -p "$IMAGES_OUTPUT"
docker buildx build "$DOCKER_CONTEXT" --progress plain --platform linux/386 --rm \
    "${DOCKER_CACHE_FLAGS[@]}" -o "type=tar,dest=$OUT_ROOTFS_TAR"

"$(dirname "$0")"/fs2json.py --ignore-mtime --out "$OUT_FSJSON" "$OUT_ROOTFS_TAR"

mkdir -p "$OUT_ROOTFS_FLAT"
# This emits way too much text
"$V86_SRC_PATH"/tools/copy-to-sha256.py "$OUT_ROOTFS_TAR" "$OUT_ROOTFS_FLAT" > /dev/null 2>&1

# We won't really need this
rm "$OUT_ROOTFS_TAR"

echo "$OUT_ROOTFS_FLAT" and "$OUT_FSJSON" created.
