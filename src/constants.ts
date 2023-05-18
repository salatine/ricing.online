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
    defaultCommandKeybinds: [
        { modKeys: ["Mod4"], normalKey: "b", command: DEFAULT_COMMANDS.openBrowser },
        { modKeys: ["Mod4"], normalKey: "e", command: DEFAULT_COMMANDS.openFileManager },
        { modKeys: ["Mod4"], normalKey: "f", command: DEFAULT_COMMANDS.fullscreen },
        { modKeys: ["Mod4"], normalKey: "j", command: DEFAULT_COMMANDS.focusNextClient },
        { modKeys: ["Mod4"], normalKey: "k", command: DEFAULT_COMMANDS.focusPreviousClient },
        { modKeys: ["Mod4"], normalKey: "m", command: DEFAULT_COMMANDS.toggleMaximize },
        { modKeys: ["Mod4"], normalKey: "n", command: DEFAULT_COMMANDS.minimize },
        { modKeys: ["Mod4"], normalKey: "o", command: DEFAULT_COMMANDS.moveToScreen },
        { modKeys: ["Mod4"], normalKey: "p", command: DEFAULT_COMMANDS.showMenubar },
        { modKeys: ["Mod4"], normalKey: "q", command: DEFAULT_COMMANDS.closeWindow },
        { modKeys: ["Mod4"], normalKey: "t", command: DEFAULT_COMMANDS.toggleFloating },
        { modKeys: ["Mod4"], normalKey: "s", command: DEFAULT_COMMANDS.toggleKeepOnTop },
        { modKeys: ["Mod4"], normalKey: "Left", command: DEFAULT_COMMANDS.previousTag },
        { modKeys: ["Mod4"], normalKey: "Return", command: DEFAULT_COMMANDS.openTerminal },
        { modKeys: ["Mod4"], normalKey: "Right", command: DEFAULT_COMMANDS.nextTag },
        { modKeys: ["Mod4"], normalKey: "space", command: DEFAULT_COMMANDS.selectNextLayout },
        { modKeys: ["Mod4", "Control"], normalKey: "n", command: DEFAULT_COMMANDS.unminimize },
        { modKeys: ["Mod4", "Control"], normalKey: "r", command: DEFAULT_COMMANDS.restart },
        { modKeys: ["Mod4", "Shift"], normalKey: "j", command: DEFAULT_COMMANDS.swapWithNextClient },
        { modKeys: ["Mod4", "Shift"], normalKey: "k", command: DEFAULT_COMMANDS.swapWithPreviousClient },
        { modKeys: ["Mod4", "Shift"], normalKey: "q", command: DEFAULT_COMMANDS.quit },
        { modKeys: ["Mod4", "Shift"], normalKey: "space", command: DEFAULT_COMMANDS.selectPreviousLayout },
        { modKeys: ["Mod4", "Shift"], normalKey: "v", command: DEFAULT_COMMANDS.toggleWibarVisibility },
    ],
    customCommandKeybinds: [
        { modKeys: ['Control', 'Shift'], normalKey: 'r', command: 'reload something idk' },
    ],
    mainModKey: "Mod4",
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

function makeDefaultCommands<K extends string>(commandFieldsById: Record<K, Omit<DefaultCommand, 'id'>>): Record<K, DefaultCommand> {
    return Object.fromEntries(
        Object.entries(commandFieldsById).map(([id, fields]) => [id, { id, ...(fields as object) }]) 
    ) as Record<K, DefaultCommand>
}

export function updateMainModKeyInModKeys(newMainModKey: MainModKey) {
    for (const mainModOption of MAIN_MOD_OPTIONS) {
        if (MOD_KEYS.includes(mainModOption)) {
            MOD_KEYS.splice(MOD_KEYS.indexOf(mainModOption), 1);
        }
    }

    MOD_KEYS.push(newMainModKey);
}

export const MOD_KEYS: ModKey[] = [
    'Alt',
    'Shift',
    'Lock',
    'Control',
    DEFAULT_OPTIONS.mainModKey,
];

export const MAIN_MOD_OPTIONS: MainModKey[] = [
    'Mod1',
    'Mod2',
    'Mod3',
    'Mod4',
    'Mod5',
];

