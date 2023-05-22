export default class NullEmulator {
    private serial0OutputCharCallbacks: SerialOutputCharCallback[] = []

    constructor(params: unknown) {
    }

    add_listener(name: string, callback: unknown): void {
        if (name === Serial0OutputCharEventName) {
            this.serial0OutputCharCallbacks.push(callback as SerialOutputCharCallback)
        }
    }

    async create_file(path: string, contents: unknown): Promise<void> {
    }

    is_running(): boolean {
        return true
    }

    async read_file(path: string): Promise<Uint8Array> {
        throw new Error('not implemented');
    }

    serial0_send(contents: string): void {
        const contentsWithCarriageReturn = contents.replace('\n', '\r\n')
        this.sendSerial0Callback(contentsWithCarriageReturn)

        if (contents === StartRPCServerCommand) {
            return
        }

        try {
            const rpcRequest = JSON.parse(contents)

            if (rpcRequest.method === 'ping') {
                this.sendRPCResponse(PongResponse)

                return
            }

            if (rpcRequest.method === 'run_command' && rpcRequest.params[0] === "fc-list :lang=en:style=Regular family") {
                this.sendRPCResponse(ListFontsRunCommandResponse)

                return
            }
        } catch {}

        throw new Error(`unexpected contents for serial0_send: "${contents}"`)
    }

    private sendRPCResponse(response: unknown): void {
        const jsonResponse = JSON.stringify(response) + '\r\n'
        // FIXME meio crime, mas a gente precisa q esse callback seja chamado
        // depois do serial0_send
        setTimeout(() => this.sendSerial0Callback(jsonResponse), 0)
    }

    private sendSerial0Callback(contents: string): void {
        const chars = [...contents]

        chars.forEach((char) => {
            this.serial0OutputCharCallbacks.forEach((callback) => callback(char))
        })
    }
}

type SerialOutputCharCallback = (char: string) => void
const Serial0OutputCharEventName = 'serial0-output-char'

// Expected serial commands during emulator usage
const StartRPCServerCommand = 'python3 vm_rpc_server.py\n'
const PongResponse = {
    jsonrpc: '2.0',
    result: 'pong',
    id: 1,
}

const ListFontsRunCommandResponse = {
    jsonrpc: "2.0",
    result: "Noto Sans Display\nLato\nNoto Serif\nIBM Plex Mono\nFira Sans\nUbuntu\nRubik,Rubik Light\nNoto Sans Mono\nNoto Sans\nIBM Plex Sans\nInconsolata\nNoto Serif Display\nUbuntu Mono\n",
    id: 1
}
