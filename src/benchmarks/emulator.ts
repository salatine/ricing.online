import path from 'path';
import { add, complete, cycle, save, suite } from 'benny'
import { startRPCServer } from '../rpc';
import { getConfigFiles, applyConfigFiles } from '../config';
import { DEFAULT_OPTIONS } from '../constants';

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
            const emulator = new V86({
                wasm_path: path.join(BUILD_DIR_PATH, "/v86/v86.wasm"),
                memory_size: 512 * 1024 * 1024,
                vga_memory_size: 8 * 1024 * 1024,
                initial_state: { url: path.join(BUILD_DIR_PATH, "/images/debian-state-base.bin.zst") },
                filesystem: { baseurl: path.join(BUILD_DIR_PATH, "/images/debian-9p-rootfs-flat/") },
                autostart: true,
                screen_dummy: true,
            });

            await startRPCServer(emulator);

            await emulator.destroy();
        }),
        add('applying config to emulator', async () => {
            const emulator = new V86({
                wasm_path: path.join(BUILD_DIR_PATH, "/v86/v86.wasm"),
                memory_size: 512 * 1024 * 1024,
                vga_memory_size: 8 * 1024 * 1024,
                initial_state: { url: path.join(BUILD_DIR_PATH, "/images/debian-state-base.bin.zst") },
                filesystem: { baseurl: path.join(BUILD_DIR_PATH, "/images/debian-9p-rootfs-flat/") },
                autostart: true,
                screen_dummy: true,
            });

            await startRPCServer(emulator);

            return async () => {
                const configFiles = getConfigFiles(DEFAULT_OPTIONS)
                await applyConfigFiles(emulator, configFiles);
                await emulator.destroy();
            }
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
