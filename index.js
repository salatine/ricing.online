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

function readUint8ArrayIntoString(array) {
    const decoder = new TextDecoder();
    return decoder.decode(array);
}

async function changeBackground(event) {
    const backgroundFile = event.target.files[0];
    const backgroundFileContents = await readFileIntoUint8Array(backgroundFile);

    await window.emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
}

function getTerminal() {
    return document.getElementById("terminal").value;
}

async function applyConfig() {
    const options = {
        AWESOME_CONFIG: AWESOME_CONFIG,
        autostartApplications: [
            { commandLine: "fcitx &" },
            { commandLine: "feh something" },
        ],
        terminal: getTerminal(),
    }

    const config = getConfig(options)
    await window.emulator.create_file(AWESOME_CONFIG + "/rc.lua", config);
}

async function updatePreview() {
    await applyConfig()
    runCommand("awesome-client 'awesome.restart()'");
}

function getConfig(options) {
    const renderTemplate = Handlebars.compile(RcLuaTemplate);

    return readStringIntoUint8Array(renderTemplate(options))
}

async function updateAwesomeLogs() {
    const stdoutTextarea = document.getElementById('awesome_stdout')
    const stderrTextarea = document.getElementById('awesome_stderr')

    const stdoutLogs = await readFileToString('/var/log/awesome.stdout.log') ?? ''
    const stderrLogs = await readFileToString('/var/log/awesome.stderr.log') ?? ''

    stdoutTextarea.value = stdoutLogs
    stderrTextarea.value = stderrLogs
}

async function readFileToString(path) {
    try {
        const bytes = await window.emulator.read_file(path)

        return readUint8ArrayIntoString(bytes)
    } catch {
        return null
    }
}

window.addEventListener("load", () => {
    const backgroundInput = document.getElementById("file")
    backgroundInput.addEventListener("change", changeBackground)

    const updatePreviewButton = document.getElementById("updatePreview")
    updatePreviewButton.addEventListener("click", updatePreview)
    
    const updateAwesomeLogsButton = document.getElementById("updateAwesomeLogs")
    updateAwesomeLogsButton.addEventListener("click", updateAwesomeLogs)
})

window.runCommand = runCommand