import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:./rc.lua.hbs";
import { saveAs } from "file-saver";
import { createRoot } from "react-dom/client";
import ReactApp from "./src/ReactApp";
import { AWESOME_CONFIG } from "./src/constants";
import { runCommand, startRPCServer } from "./src/rpc";
import { readFileIntoUint8Array, readStringIntoUint8Array, readUint8ArrayIntoString } from "./src/utils";

async function updateAwesomeLogs() {
    const stdoutTextarea = document.getElementById('awesome_stdout')
    const stderrTextarea = document.getElementById('awesome_stderr')

    // Sincronizar escritas que estão no cache em memória do disco, pois caso existam escritas
    // ainda em cache ela não irá aparecer no sistema de arquivos
    await syncCaches()

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

async function syncCaches() {
    await runCommand('sync')
}

window.addEventListener("load", () => {
    const updateAwesomeLogsButton = document.getElementById("updateAwesomeLogs")
    updateAwesomeLogsButton.addEventListener("click", updateAwesomeLogs)

    window.emulator = new V86Starter({
        wasm_path: "/build/v86/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        initial_state: { url: "/build/images/debian-state-base.bin.zst" },
        filesystem: { baseurl: "/build/images/debian-9p-rootfs-flat/" },
        autostart: true,
    });
    
    startRPCServer();

    window.emulator.add_listener("serial0-output-char", function (char) {
        if(char === "\r") {
            return;
        }

        document.getElementById("serial").value += char;
    });

    const reactApp = document.getElementById("reactApp");
    createRoot(reactApp).render(<ReactApp emulator={window.emulator}/>)
})

window.runCommand = runCommand