import { Options, StatusBarWidget, StatusBarWidgetGroups } from "./config";
import { createIdentifiableWidget } from "./widgets";

export const AWESOME_CONFIG: string = "/root/.config/awesome";

export const DEFAULT_WIDGETS: Record<keyof StatusBarWidgetGroups, StatusBarWidget[]> = {
    left: [
        { type: 'launcher', command: 'osu!.exe', iconPath: 'peppy-carequinha.png' },
        { type: 'taglist', buttons: [], color: '#00ff00' },
    ],
    middle: [
        { type: 'tasklist', fontSize: 12 },
    ],
    right: [
        { type: 'volume' },
        { type: 'battery' },
        { type: 'brightness' },
        { type: 'clock' },
        { type: 'systray' },
    ],
};

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
        widgetGroups: Object.fromEntries(
            Object.entries(DEFAULT_WIDGETS).map(([group, widgets]) => [
                group,
                widgets.map(createIdentifiableWidget),
            ])
        ) as StatusBarWidgetGroups,
    }
};

export const MOD_KEYS = [
    'Alt',
    'Shift',
    'Lock',
    'Control',
    'Mod4',
];
