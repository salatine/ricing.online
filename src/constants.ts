import { Options, StatusBarWidget } from "./config";
import { createIdentifiableWidget } from "./widgets";

export const AWESOME_CONFIG: string = "/root/.config/awesome";

const DEFAULT_WIDGETS: StatusBarWidget[] = [
    { type: 'launcher', command: 'osu!.exe', iconPath: 'peppy-carequinha.png' },
    { type: 'taglist', buttons: [], color: '#00ff00' },
    { type: 'tasklist', fontSize: 12 },
    { type: 'volume' },
    { type: 'battery' },
    { type: 'brightness' },
    { type: 'clock' },
    { type: 'systray' },
];

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
    statusBar: {
        position: 'top',
        height: 5,
        borderWidth: 5,
        color: '#ff0000',
        widgets: DEFAULT_WIDGETS.map(createIdentifiableWidget),
    }
};

export const MOD_KEYS = [
    'Alt',
    'Shift',
    'Lock',
    'Control',
    'Mod4',
];
