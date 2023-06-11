#!/usr/bin/env bash
set -veu

DOCKER_CACHE_FLAGS=()
if [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
    # mode=min only caches the final result, I think it's useful here because we won't change this a lot
    # so caching all layers is pretty useless
    DOCKER_CACHE_FLAGS=(
        "--cache-from=type=gha,scope=v86"
        "--cache-to=type=gha,mode=min,scope=v86"
    )
fi

# Buildar a imagem do v86, que irá conter os arquivos JS
docker buildx build --load -f v86/tools/docker/exec/Dockerfile -t v86:alpine-3.14 "${DOCKER_CACHE_FLAGS[@]}" v86

# Iniciar um container temporário rodando a imagem acima, para copiarmos os arquivos que precisamos
# O -d inicia ele em plano de fundo, o -q imprime o ID do container na saida padrão
CONTAINER_ID=$(docker run -d v86:alpine-3.14 sleep 600)
mkdir -p build/
docker cp "$CONTAINER_ID":/v86/build build/v86
docker kill "$CONTAINER_ID"