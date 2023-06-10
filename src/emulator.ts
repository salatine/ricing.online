import { runCommand } from "./rpc";
import { sleep } from "./utils";

// @ts-ignore
export function createEmulator(options: Record<string, unknown>, emulatorClass: any = V86Starter) {
    const defaultOptions = {
        wasm_path: "/build/v86/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        initial_state: { url: "/build/images/debian-state-base.bin.zst" },
        filesystem: { baseurl: "/build/images/debian-9p-rootfs-flat/" },
        autostart: true,
        uart1: true,
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options
    }

    return new emulatorClass(mergedOptions)
}

export async function waitForEmulatorStartup(emulator: any, pollingIntervalMs: number = 500): Promise<void> {
    while (!emulator.is_running()) {
        await sleep(pollingIntervalMs)
    }
}

export async function waitForAwesomeStartup(emulator: any, pollingIntervalMs: number = 500): Promise<void> {
    while (!await hasAwesomeStartedUp(emulator)) {
        await sleep(pollingIntervalMs);
    }
}

export async function restoreState(emulator: any, initialStateUrl: string): Promise<void> {
    const response = await fetch(initialStateUrl)

    await emulator.restore_state(await response.arrayBuffer())
}

async function hasAwesomeStartedUp(emulator: any): Promise<boolean> {
    // somewhat unintuitively, `awesome.startup` contains whether awesome is starting up (therefore, when
    // it finishes starting up it returns false)
    return (await runCommand(emulator, "echo 'return awesome.startup' | DISPLAY=':0' awesome-client") ?? '').includes('false');
}
