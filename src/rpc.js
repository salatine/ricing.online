export function startRPCServer() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (window.emulator.is_running()) {
                window.emulator.serial0_send("python3 vm_rpc_server.py\n");
                clearInterval(interval)

                resolve()
            }
        }, 500)
    })
}

export async function runCommand(command) {
    const result = await sendRequest({
        "jsonrpc": "2.0",
        "method": "run_command",
        "params": [command],
        "id": 1
    })

    return result
}

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
