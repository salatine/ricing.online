# ricing.online

<p align="center">
    <img src="docs/trip.gif">
</p>

[ricing.online](https://ricing.online) is a website that allows one to create a beautiful rice for the [awesome window manager](https://awesomewm.org/). It is built with [React.js](https://reactjs.org/), and uses [Docker](https://www.docker.com/), [Handlebars](https://handlebarsjs.com/) and the [v86](https://github.com/copy/v86) emulator to run and manage a Linux environment in the browser.

## Installing

1. Clone the repository.
2. Clone all the submodules with `git submodule update --init --recursive`
3. Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org). Remember to also install the `buildx` plugin for Docker and the `npm` package manager, if they aren't already.
4. Install the Node modules with `npm install`
5. Build the project with `build.sh`
6. Run the project with `npm run watch-and-serve`