import { Options, StatusBarWidget, StatusBarWidgetGroups, DefaultCommand, DefaultCommandKeybind, ModKey, MainModKey } from "./config";
import { createIdentifiableWidget } from "./widgets";

export const AWESOME_CONFIG: string = "/root/.config/awesome";

export const DEFAULT_COMMANDS = makeDefaultCommands({
    // Global keys
    restart: {
        name: "Restart awesome",
        description: "Restarts the awesome window manager",
        type: "global",
    },

    quit: {
        name: "Quit awesome",
        description: "Quits the awesome window manager",
        type: "global",
    },

    previousTag: {
        name: "Previous tag",
        description: "Switches to the previous tag",
        type: "global",
    },

    nextTag: {
        name: "Next tag",
        description: "Switches to the next tag",
        type: "global",
    },

    focusPreviousClient: {
        name: "Focus previous client",
        description: "Focuses the previous client",
        type: "global",
    },

    focusNextClient: {
        name: "Focus next client",
        description: "Focuses the next client",
        type: "global",
    },

    swapWithPreviousClient: {
        name: "Swap with previous client",
        description: "Swaps the current client with the previous client",
        type: "global",
    },

    swapWithNextClient: {
        name: "Swap with next client",
        description: "Swaps the current client with the next client",
        type: "global",
    },

    selectNextLayout: {
        name: "Select next layout",
        description: "Selects the next layout",
        type: "global",
    },

    selectPreviousLayout: {
        name: "Select previous layout",
        description: "Selects the previous layout",
        type: "global",
    },

    toggleWibarVisibility: {
        name: "Toggle wibar visibility",
        description: "Toggles the visibility of the wibar",
        type: "global",
    },

    openBrowser: {
        name: "Open browser",
        description: "Opens the browser",
        type: "global",
    },

    openFileManager: {
        name: "Open file manager",
        description: "Opens the file manager",
        type: "global",
    },

    openTerminal: {
        name: "Open terminal",
        description: "Opens the terminal",
        type: "global",
    },

    showMenubar: {
        name: "Show menubar",
        description: "Shows the menubar",
        type: "global",
    },

    // Client keys
    fullscreen: {
        name: "Toggle fullscreen",
        description: "Toggles fullscreen mode",
        type: "client",
    },

    closeWindow: {
        name: "Close window",
        description: "Closes the current window",
        type: "client",
    },

    toggleFloating: {
        name: "Toggle floating",
        description: "Toggles floating mode",
        type: "client",
    },

    moveToScreen: {
        name: "Move to screen",
        description: "Moves the current window to the next screen",
        type: "client",
    },

    toggleKeepOnTop: {
        name: "Toggle keep on top",
        description: "Toggles keep on top mode",
        type: "client",
    },

    minimize: {
        name: "Minimize",
        description: "Minimizes the current window",
        type: "client",
    },
    
    unminimize: {
        name: "Unminimize",
        description: "Unminimizes the current window",
        type: "client",
    },

    toggleMaximize: {
        name: "Toggle maximize",
        description: "Toggles maximize mode",
        type: "client",
    },   
})

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
    background: null,
    defaultCommandKeybinds: [
        { modKeys: ["MainModKey"], normalKey: "b", command: DEFAULT_COMMANDS.openBrowser },
        { modKeys: ["MainModKey"], normalKey: "e", command: DEFAULT_COMMANDS.openFileManager },
        { modKeys: ["MainModKey"], normalKey: "f", command: DEFAULT_COMMANDS.fullscreen },
        { modKeys: ["MainModKey"], normalKey: "j", command: DEFAULT_COMMANDS.focusNextClient },
        { modKeys: ["MainModKey"], normalKey: "k", command: DEFAULT_COMMANDS.focusPreviousClient },
        { modKeys: ["MainModKey"], normalKey: "m", command: DEFAULT_COMMANDS.toggleMaximize },
        { modKeys: ["MainModKey"], normalKey: "n", command: DEFAULT_COMMANDS.minimize },
        { modKeys: ["MainModKey"], normalKey: "o", command: DEFAULT_COMMANDS.moveToScreen },
        { modKeys: ["MainModKey"], normalKey: "p", command: DEFAULT_COMMANDS.showMenubar },
        { modKeys: ["MainModKey"], normalKey: "q", command: DEFAULT_COMMANDS.closeWindow },
        { modKeys: ["MainModKey"], normalKey: "t", command: DEFAULT_COMMANDS.toggleFloating },
        { modKeys: ["MainModKey"], normalKey: "s", command: DEFAULT_COMMANDS.toggleKeepOnTop },
        { modKeys: ["MainModKey"], normalKey: "Left", command: DEFAULT_COMMANDS.previousTag },
        { modKeys: ["MainModKey"], normalKey: "Return", command: DEFAULT_COMMANDS.openTerminal },
        { modKeys: ["MainModKey"], normalKey: "Right", command: DEFAULT_COMMANDS.nextTag },
        { modKeys: ["MainModKey"], normalKey: "space", command: DEFAULT_COMMANDS.selectNextLayout },
        { modKeys: ["MainModKey", "Control"], normalKey: "n", command: DEFAULT_COMMANDS.unminimize },
        { modKeys: ["MainModKey", "Control"], normalKey: "r", command: DEFAULT_COMMANDS.restart },
        { modKeys: ["MainModKey", "Shift"], normalKey: "j", command: DEFAULT_COMMANDS.swapWithNextClient },
        { modKeys: ["MainModKey", "Shift"], normalKey: "k", command: DEFAULT_COMMANDS.swapWithPreviousClient },
        { modKeys: ["MainModKey", "Shift"], normalKey: "q", command: DEFAULT_COMMANDS.quit },
        { modKeys: ["MainModKey", "Shift"], normalKey: "space", command: DEFAULT_COMMANDS.selectPreviousLayout },
        { modKeys: ["MainModKey", "Shift"], normalKey: "v", command: DEFAULT_COMMANDS.toggleWibarVisibility },
    ],
    customCommandKeybinds: [
        { modKeys: ['Control', 'Shift'], normalKey: 'r', command: 'reload something idk' },
    ],
    mainModKey: "Mod4",
    terminal: "kitty",
    browser: "firefox",
    fileManager: "nemo",
    window: {
        animationSpeed: 0,
        shadow: {
            radius: 12,
            opacity: 0,
        },
        opacity: {
            active: 1,
            inactive: 0.8,
        },
        border: {
            size: 0,
            normalColor: '#ffffff',
            focusColor: '#ff0000',
            markedColor: '#00ff00',
        },
        cornerRadius: 12,

    },
    font: {
        family: "Lato",
        size: 12,
        color: "#DCD7BA",
    }, 
    statusBar: {
        position: 'top',
        height: 24,
        color: '#020717',
        widgetGroups: Object.fromEntries(
            Object.entries(DEFAULT_WIDGETS).map(([group, widgets]) => [
                group,
                widgets.map(createIdentifiableWidget),
            ])
        ) as StatusBarWidgetGroups,
    }
};

export function makeDefaultCommands<K extends string>(commandFieldsById: Record<K, Omit<DefaultCommand, 'id'>>): Record<K, DefaultCommand> {
    return Object.fromEntries(
        Object.entries(commandFieldsById).map(([id, fields]) => [id, { id, ...(fields as object) }]) 
    ) as Record<K, DefaultCommand>
}

export function getModKeys(): ModKey[] {
    return [
        'Alt',
        'Shift',
        'Lock',
        'Control',
        'MainModKey',
    ];
}

export const MAIN_MOD_OPTIONS: MainModKey[] = [];
for (let i=1; i !== 5; i++) {MAIN_MOD_OPTIONS.push(`Mod${i}` as MainModKey)}