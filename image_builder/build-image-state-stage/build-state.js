#!/usr/bin/env node
"use strict";

const path = require("path");

const fs = require("fs");
const IMAGE_INPUTS_FOLDER = '/inputs/images/';
const OUTPUT_FOLDER = '/outputs/';

const V86 = require("/inputs/v86/build/libv86.js").V86;
const V86_ROOT = path.join("/inputs/v86/src");

const OUTPUT_FILE = path.join(OUTPUT_FOLDER, "debian-state-base.bin");

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", handle_key);
}

const emulator = new V86({
    bios: { url: path.join(V86_ROOT, "/bios/seabios.bin") },
    vga_bios: { url: path.join(V86_ROOT, "/bios/vgabios.bin") },
    autostart: true,
    memory_size: 512 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    network_relay_url: "<UNUSED>",
    bzimage_initrd_from_filesystem: true,
    cmdline: "rw init=/bin/systemd root=host9p console=ttyS0 spectre_v2=off pti=off",
    filesystem: {
        basefs: {
            url: path.join(IMAGE_INPUTS_FOLDER, "debian-base-fs.json"),
        },
        baseurl: path.join(IMAGE_INPUTS_FOLDER, "debian-9p-rootfs-flat/"),
    },
    screen_dummy: true,
});

console.log("Now booting, please stand by ...");

var boot_start = Date.now();
var serial_text = "";
let booted = false;

emulator.add_listener("serial0-output-char", function(c)
{
    process.stdout.write(c);

    serial_text += c;

    if(!booted && serial_text.endsWith("JSON RPC server is ready!"))
    {
        console.error("\nBooted in %d", (Date.now() - boot_start) / 1000);
        booted = true;

        // wait for startx to finish
        setTimeout(function() {
            // send a RPC commmand to sync and drop caches: Makes it safer to change the filesystem as fewer files are rendered
            const rpcRequest = {
                jsonrpc: '2.0',
                id: '1',
                method: 'run_command',
                params: ['sync;echo 3 >/proc/sys/vm/drop_caches']
            }
            emulator.serial0_send(JSON.stringify(rpcRequest) + "\n");

            setTimeout(async function ()
                {
                    const s = await emulator.save_state();

                    fs.writeFile(OUTPUT_FILE, new Uint8Array(s), function(e)
                        {
                            if(e) throw e;
                            console.error("Saved as " + OUTPUT_FILE);
                            stop();
                        });
                }, 10 * 1000);
        }, 90 * 1000);
    }
});

function handle_key(c)
{
    if(c === "\u0003")
    {
        // ctrl c
        stop();
    }
    else
    {
        emulator.serial0_send(c);
    }
}

function stop()
{
    emulator.stop();
    process.stdin.pause();
}
