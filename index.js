import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:./rc.lua.hbs";

AWESOME_CONFIG = "/etc/xdg/awesome";

function runCommand(command) {
    window.emulator.serial0_send("DISPLAY=':0' " + command + "\n");
}

async function readFileIntoUint8Array(file) {
    const arrayBuffer = await file.arrayBuffer();
    
    return new Uint8Array(arrayBuffer);
}

function readStringIntoUint8Array(string) {
    const encoder = new TextEncoder();
    return encoder.encode(string);
}

async function changeBackground(event) {
    const backgroundFile = event.target.files[0];
    const backgroundFileContents = await readFileIntoUint8Array(backgroundFile);

    await window.emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
}

async function updatePreview() {
    const config = generateConfig({
        wallpaperPath: AWESOME_CONFIG + "/background",
        autostartApplications: [
            { commandLine: "fcitx &" },
            { commandLine: "feh something" },
        ],
    });

    console.log(config)
    await window.emulator.create_file(AWESOME_CONFIG + "/rc.lua", config);
    runCommand("echo 'awesome.restart()' | DISPLAY=':0' awesome-client");
}

function generateConfig(options) {
    const renderTemplate = Handlebars.compile(RcLuaTemplate);

    return readStringIntoUint8Array(renderTemplate(options))
}

window.addEventListener("load", () => {
    const backgroundInput = document.getElementById("file")
    backgroundInput.addEventListener("change", changeBackground)

    const updatePreviewButton = document.getElementById("updatePreview")
    updatePreviewButton.addEventListener("click", updatePreview)
})

window.runCommand = runCommand