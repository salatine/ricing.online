import { Options } from "./config";

export const AWESOME_CONFIG: string = "/root/.config/awesome";

export const DEFAULT_OPTIONS: Options = {
    autostartApplications: [
        { commandLine: "fcitx &" },
        { commandLine: "feh something" },
    ],
    customKeybinds: [
        { modKeys: ['Control', 'Shift'], normalKey: 'r', command: 'reload something idk' },
    ],
    terminal: "kitty",
    windowBorder: {
        size: 0,
        normalColor: '#ffffff',
        focusColor: '#ff0000',
        markedColor: '#00ff00',
    },
    font: {
        family: "Ubuntu Mono",
        size: 12,
    }, 
};

export const MOD_KEYS = [
    'Alt',
    'Shift',
    'Lock',
    'Control',
    'Mod4',
];