import path from 'path';
import { add, complete, cycle, save, suite } from 'benny'
import { runCommand, startRPCServer } from '../rpc';
import { getConfigFiles, applyConfigFiles } from '../config';
import { DEFAULT_OPTIONS } from '../constants';
import { createEmulator, waitForAwesomeStartup } from '../emulator';

if (!global.gc) {
    console.error('this benchmark suite must be ran with the --expose-gc flag set');

    process.exit(1);
}

const BUILD_DIR_PATH = path.join(__dirname, '../../build')

async function main() {
    const { V86 } = await import(`file:///${path.join(BUILD_DIR_PATH, '/v86/libv86.js')}`)

    await suite(
        'Emulator',
        add('wait for RPC server to be started', async () => {
            const emulator = createEmulator({
                wasm_path: path.join(BUILD_DIR_PATH, "/v86/v86.wasm"),
                initial_state: { url: path.join(BUILD_DIR_PATH, "/images/debian-state-base.bin.zst") },
                filesystem: { baseurl: path.join(BUILD_DIR_PATH, "/images/debian-9p-rootfs-flat/") },
                screen_dummy: true,
            });

            await startRPCServer(emulator);

            await emulator.destroy();
        }),
        add('applying config to emulator', async () => {
            const emulator = createEmulator({
                wasm_path: path.join(BUILD_DIR_PATH, "/v86/v86.wasm"),
                initial_state: { url: path.join(BUILD_DIR_PATH, "/images/debian-state-base.bin.zst") },
                filesystem: { baseurl: path.join(BUILD_DIR_PATH, "/images/debian-9p-rootfs-flat/") },
                screen_dummy: true,
            });

            await startRPCServer(emulator);

            const configFiles = getConfigFiles(DEFAULT_OPTIONS);
            await applyConfigFiles(emulator, configFiles);

            await runCommand(emulator, "DISPLAY=:0 awesome-client 'awesome.emit_signal(\"load-rc-lua\")'");
        }),
        cycle(() => {
            if (global.gc) {
                gc()
            }
        }),
        complete(),
        save({
            file: (summary) => summary.date.toISOString().replace(/:/g, '-'),
            format: 'json',
            details: true
        }),
    )

    // FIXME should probably have proper teardown on each emulator instance
    process.exit(0)
}

main()
