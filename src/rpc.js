export function startRPCServer(emulator) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (emulator.is_running()) {
                emulator.serial0_send("python3 vm_rpc_server.py\n");
                clearInterval(interval)

                resolve()
            }
        }, 500)
    })
}

export async function runCommand(emulator, command) {
    const result = await sendRequest(emulator, {
        "jsonrpc": "2.0",
        "method": "run_command",
        "params": [command],
        "id": 1
    })

    return result
}

function sendRequest(emulator, request) {
    return new Promise((resolve, reject) => {
        let capturedOutput = '';
        let complete = false;
        emulator.add_listener("serial0-output-char", function (char) {
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

        emulator.serial0_send(JSON.stringify(request) + "\n");
    });
}
