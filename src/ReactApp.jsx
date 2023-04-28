import { AWESOME_CONFIG } from "./constants";
import { useState } from 'react';
import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:../rc.lua.hbs";
import { runCommand } from "./rpc";
import { saveAs } from "file-saver";
import { readFileIntoUint8Array, readStringIntoUint8Array, readUint8ArrayIntoString } from './utils'
import CustomKeybindsChooser from "./components/CustomKeybindsChooser";

const DEFAULT_OPTIONS = {
    AWESOME_CONFIG: AWESOME_CONFIG,
    autostartApplications: [
        { commandLine: "fcitx &" },
        { commandLine: "feh something" },
    ],
    customKeybinds: [
        { modKeys: ['Control', 'Shift'], normalKey: 'r', command: 'reload something idk' },
    ],
    terminal: "kitty",
};

export default function ReactApp({ emulator }) {
    const [options, setOptions] = useState(DEFAULT_OPTIONS);

    function updateOption(name, value) {
        // Duplicar o options
        const newOptions = { ...options };
        newOptions[name] = value;

        setOptions(newOptions);
    }

    function getConfig(options) {
        const renderTemplate = Handlebars.compile(RcLuaTemplate);
    
        return renderTemplate(options)
    }

    async function applyConfig() {
        const config = readStringIntoUint8Array(getConfig(options))

        await emulator.create_file(AWESOME_CONFIG + "/rc.lua", config);
    }

    function handleTerminalSelected(newTerminal) {
        updateOption('terminal', newTerminal);
    }

    async function handleBackgroundSelected(backgroundFile) {
        const backgroundFileContents = await readFileIntoUint8Array(backgroundFile);

        await emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
    }

    function handleCustomKeybindsUpdated(newCustomKeybinds) {
        updateOption('customKeybinds', newCustomKeybinds)
    }

    async function handleUpdatePreviewClicked() {
        await applyConfig()
        runCommand("DISPLAY=:0 awesome-client 'awesome.restart()'"); 
    }

    function handleExportRcLuaClicked() {
        const content = getConfig(options)
        const rcLua = new Blob([content], { type: "text/plain;charset=utf-8" })
        
        saveAs(rcLua, "rc.lua")
    }

    function handleLockMouseClicked() {
        emulator.lock_mouse();
    }

    return (
        <div>
            <TerminalSelector terminal={options.terminal} onTerminalSelected={handleTerminalSelected}/>
            <BackgroundSelector onBackgroundSelected={handleBackgroundSelected}/>
            <CustomKeybindsChooser customKeybinds={options.customKeybinds} onCustomKeybindsUpdated={handleCustomKeybindsUpdated}/>
            <UpdatePreviewButton onUpdateClicked={handleUpdatePreviewClicked}/>
            <ExportRcLuaButton onExportClicked={handleExportRcLuaClicked}/>
            <LockMouseButton onLockClicked={handleLockMouseClicked}/>
        </div>
    ); 
}

function TerminalSelector({ terminal, onTerminalSelected }) {
    return (
        <select
            value={terminal}
            onChange={(e) => onTerminalSelected(e.target.value)}>
            <option value="kitty">kitty</option>
            <option value="alacritty">Alacritty</option>
            <option value="terminator">Terminator</option>
            <option value="gnome-terminal">GNOME Terminal</option>
            <option value="konsole">Konsole</option>
            <option value="xterm">xterm</option>
            <option value="st">st</option>
        </select>
    );
}

function BackgroundSelector({ onBackgroundSelected }) {
    return (
        <input type="file"
            name="file"
            onChange={(e) => onBackgroundSelected(e.target.files[0])}>
        </input>
    );
}

function UpdatePreviewButton({ onUpdateClicked }) {
    return (
        <input type="button" 
            value="teste restart"
            onClick={(e) => onUpdateClicked()}>
        </input>
    );
}

function ExportRcLuaButton({ onExportClicked }) {
    return (
        <input type="button" 
            value="export rc.lua"
            onClick={(e) => onExportClicked()}>
        </input>
    );
}

function LockMouseButton({ onLockClicked }) {
    return (
        <input type="button" 
            value="lock mouse"
            onClick={(e) => onLockClicked()}>
        </input>
    );
}