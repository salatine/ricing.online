import { waitForEmulatorStartup } from "./emulator"
import { readStringIntoUint8Array } from "./utils"

type Request = {
    jsonrpc: string,
    method: string,
    params: string[],
    id: number
}

type Response = {
    jsonrpc: string,
    result: string,
    id: number
}

export async function startRPCServer(emulator: any): Promise<void> {
    await waitForEmulatorStartup(emulator)
    await ping(emulator)
}

export async function runCommand(emulator: any, command: string): Promise<string> {
    const response: Response = await sendRequest(emulator, {
        "jsonrpc": "2.0",
        "method": "run_command",
        "params": [command],
        "id": 1
    })

    return response.result
}

async function ping(emulator: any): Promise<void> {
    const response = await sendRequest(emulator, {
        "jsonrpc": "2.0",
        "method": "ping",
        "params": [],
        "id": 1
    })

    if (response.result !== 'pong') {
        throw new Error('failed to ping RPC server')
    }
}

function sendRequest(emulator: any, request: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
        let capturedOutput = '';
        let complete = false;
        emulator.add_listener("serial0-output-char", function (char) {
            if (complete) return;

            capturedOutput += char;
            const capturedOutputLines = capturedOutput.split('\n');

            for (let i = 0; i < capturedOutputLines.length; i++) {
                const line = capturedOutputLines[i];
                if (line.endsWith("\r")) {
                    complete = true;
                    resolve(JSON.parse(line));
                }
            }
        });

        const bytes = readStringIntoUint8Array(JSON.stringify(request) + "\n");
        emulator.serial_send_bytes(1, bytes);
    });
}
