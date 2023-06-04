# image_builder

This builds a Debian emulator image running the awesome WM, suitable for usage with our website. The build process has two stages: the **build image contents** stage and the **build image state** stage.

The image build can be done by running `build.sh`. It takes the V86 sources location and the built V86 files location as inputs, and generates the emulator image files (contents and saved state) to the output folder.

## Build image contents stage

Here we build the emulator image contents, using the Dockerfile in `build-image-contents-stage/Dockerfile` to describe what should be in the resulting emulator image. After building the Docker image containing the emulator image contents, we extract it to a .tar file and do some processing, in order to make it usable by the V86 emulator.

The build process is described in `build-image-contents-stage/build.sh`. It takes the location of the V86 sources as an input, and the location where the emulator image contents should be placed as an output.

## Build image state stage

With the emulator image contents in hand, we can proceed to the **build image state** stage. Here, we run an emulator with the image contents until it fully loads into the awesome WM, and then save the emulator state into a file. Using this saved state allows us to skip the boot process entirely when we load the emulator on the website.

The state build process is described in `build-image-state-stage/build.sh`. It takes 3 _inputs_: the emulator image contents location, the V86 source location, and the built V86 files location; and produces a compressed state into the output folder.
