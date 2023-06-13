#!/usr/bin/env bash

set -veu

function set_docker_cache_flags {
    local IMAGE_NAME="$1"

    DOCKER_CACHE_FLAGS=()
    if [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
        local SCOPE_PREFIX="$GITHUB_REF_NAME"
        if [[ "$GITHUB_WORKFLOW" == "E2E Tests" ]]; then
            SCOPE_PREFIX="e2e-tests"
        fi

        DOCKER_CACHE_FLAGS=(
            "--cache-from=type=gha,scope=$SCOPE_PREFIX-$IMAGE_NAME"
            "--cache-to=type=gha,mode=max,scope=$SCOPE_PREFIX-$IMAGE_NAME"
        )
    fi
}

export -f set_docker_cache_flags
