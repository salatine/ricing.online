#!/usr/bin/env bash

set -veu

function set_docker_cache_flags() {
    DOCKER_CACHE_FLAGS=()
    if [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
        SCOPE_PREFIX="$GITHUB_REF_NAME"
        if [[ "$GITHUB_WORKFLOW" == "E2E Tests" ]]; then
            SCOPE_PREFIX="e2e-tests"
        fi

        DOCKER_CACHE_FLAGS=(
            "--cache-from=type=gha,scope=$SCOPE_PREFIX-image-contents"
            "--cache-to=type=gha,mode=max,scope=$SCOPE_PREFIX-image-contents"
        )
    fi
}

export -f set_docker_cache_flags
