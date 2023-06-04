#!/usr/bin/env bash
set -veu

DOCKER_CACHE_FLAGS=()
if [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
    DOCKER_CACHE_FLAGS=(
        "--cache-from=type=gha"
        "--cache-to=type=gha,mode=max"
    )
fi

# Buildar a imagem do v86, que irá conter os arquivos JS
docker buildx build -f v86/tools/docker/exec/Dockerfile -t v86:alpine-3.14 "${DOCKER_CACHE_FLAGS[@]}" v86

# Iniciar um container temporário rodando a imagem acima, para copiarmos os arquivos que precisamos
# O -d inicia ele em plano de fundo, o -q imprime o ID do container na saida padrão
CONTAINER_ID=$(docker run -d v86:alpine-3.14 sleep 600)
mkdir -p build/
docker cp "$CONTAINER_ID":/v86/build build/v86
docker kill "$CONTAINER_ID"