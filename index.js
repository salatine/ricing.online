import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:./rc.lua.hbs";

const AWESOME_CONFIG = "/etc/xdg/awesome";

function sendRequest(request) {
    return new Promise((resolve, reject) => {
        let capturedOutput = '';
        let complete = false;
        window.emulator.add_listener("serial0-output-char", function (char) {
            if (complete) return;

            capturedOutput += char;
            const capturedOutputLines = capturedOutput.split('\n');

            for (let i = 1; i < capturedOutputLines.length - 1; i++) {
                const line = capturedOutputLines[i];
                if (line.endsWith("\r")) {
                    complete = true;

                    resolve(JSON.parse(line));
                }
            }
        });

        window.emulator.serial0_send(JSON.stringify(request) + "\n");
    });
}


function startRPCServer() {
    const interval = setInterval(() => {
        if (window.emulator.is_running()) {
            window.emulator.serial0_send("python3 vm_rpc_server.py\n");

            clearInterval(interval)
        }
    }, 500)
}

async function runCommand(command) {
    const result = await sendRequest({
        "jsonrpc": "2.0",
        "method": "run_command",
        "params": [command],
        "id": 1
    })

    return result
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

    // Sincronizar escritas que estão no cache em memória do disco, pois caso existam escritas
    // ainda em cache ela não irá aparecer no sistema de arquivos
    await syncAndDropCaches()

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

async function syncAndDropCaches() {
    runCommand('sync;echo 3 >/proc/sys/vm/drop_caches')

    await sleep(500)
}

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

window.addEventListener("load", () => {
    const backgroundInput = document.getElementById("file")
    backgroundInput.addEventListener("change", changeBackground)

    const updatePreviewButton = document.getElementById("updatePreview")
    updatePreviewButton.addEventListener("click", updatePreview)

    const updateAwesomeLogsButton = document.getElementById("updateAwesomeLogs")
    updateAwesomeLogsButton.addEventListener("click", updateAwesomeLogs)
})

window.startRPCServer = startRPCServer
window.runCommand = runCommand