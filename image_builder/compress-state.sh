#!/usr/bin/env bash
set -veu

IMAGES_OUTPUT="$(dirname "$0")"/../build/images
UNCOMPRESSED_STATE_FILE="$IMAGES_OUTPUT"/debian-state-base.bin
COMPRESSED_STATE_FILE="$UNCOMPRESSED_STATE_FILE".zst
# This value goes from 1 to 19 (up to 22 with ultra mode), 1 meaning less compression and 19 more compression
COMPRESSION_LEVEL=22

zstd -"$COMPRESSION_LEVEL" -f --ultra "$UNCOMPRESSED_STATE_FILE" -o "$COMPRESSED_STATE_FILE"