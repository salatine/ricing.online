FROM alpine:3.18 AS build-stage

WORKDIR /build

RUN apk add bash nodejs zstd

COPY inputs /inputs
RUN mkdir /outputs

COPY build-state.js .
RUN ./build-state.js

COPY compress-state.sh .
RUN ./compress-state.sh

FROM scratch AS export-stage

# Export the compressed state
COPY --from=build-stage /outputs/*.zst /