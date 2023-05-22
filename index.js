/// <reference types="./parcel.d.ts" />
import { createRoot } from "react-dom/client";
import ReactApp from "./src/ReactApp";
import { runCommand, startRPCServer } from "./src/rpc";
import { getAvailableFonts } from "./src/fonts";
import NullEmulator from "./src/NullEmulator";

import 'bootstrap/dist/css/bootstrap.min.css';

async function updateAwesomeLogs(emulator) {
    const stdoutTextarea = document.getElementById('awesome_stdout')
    const stderrTextarea = document.getElementById('awesome_stderr')

    // Sincronizar escritas que estão no cache em memória do disco, pois caso existam escritas
    // ainda em cache ela não irá aparecer no sistema de arquivos
    await syncCaches(emulator)

    const stdoutLogs = await readFileToString(emulator, '/var/log/awesome.stdout.log') ?? ''
    const stderrLogs = await readFileToString(emulator, '/var/log/awesome.stderr.log') ?? ''

    stdoutTextarea.value = stdoutLogs
    stderrTextarea.value = stderrLogs
}

async function readFileToString(emulator, path) {
    try {
        const bytes = await emulator.read_file(path)

        return readUint8ArrayIntoString(bytes)
    } catch {
        return null
    }
}

async function syncCaches(emulator) {
    await runCommand(emulator, 'sync')
}

window.addEventListener("load", async () => {
    const emulatorClass = NullEmulator // NullEmulator or V86Starter

    const emulator = new emulatorClass({
        wasm_path: "/build/v86/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        initial_state: { url: "/build/images/debian-state-base.bin.zst" },
        filesystem: { baseurl: "/build/images/debian-9p-rootfs-flat/" },
        autostart: true,
    });

    emulator.add_listener("serial0-output-char", function (char) {
        if(char === "\r") {
            return;
        }

        document.getElementById("serial").value += char;
    });

    await startRPCServer(emulator);

    const updateAwesomeLogsButton = document.getElementById("updateAwesomeLogs")
    updateAwesomeLogsButton.addEventListener("click", () => updateAwesomeLogs(emulator))

    const reactApp = document.getElementById("reactApp");
    createRoot(reactApp).render(<ReactApp emulator={emulator}/>);
})

window.runCommand = runCommand