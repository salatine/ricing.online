FROM alpine:3.18 AS build-stage
ARG IMAGES_PATH
ARG V86_SRC_PATH
ARG V86_BUILD_PATH
ARG SCRIPTS_PATH

WORKDIR /build

RUN apk add bash nodejs zstd

COPY ${IMAGES_PATH} /inputs/images
COPY ${V86_SRC_PATH} /inputs/v86/src
COPY ${V86_BUILD_PATH} /inputs/v86/build

RUN mkdir /outputs

COPY ${SCRIPTS_PATH}/build-state.js .
RUN ./build-state.js

COPY ${SCRIPTS_PATH}/compress-state.sh .
RUN ./compress-state.sh

FROM scratch AS export-stage

# Export the compressed state
COPY --from=build-stage /outputs/*.zst /