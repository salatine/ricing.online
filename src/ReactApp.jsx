import { AWESOME_CONFIG } from "./constants";
import { useState, useEffect } from 'react';
import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:../rc.lua.hbs";
import { runCommand } from "./rpc";
import { saveAs } from "file-saver";
import { readFileIntoUint8Array, readStringIntoUint8Array } from './utils'
import { getAvailableFontFamilies } from "./fonts";
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
        runCommand(emulator, "DISPLAY=:0 awesome-client 'awesome.restart()'"); 
    }

    function handleExportRcLuaClicked() {
        const content = getConfig(options)
        const rcLua = new Blob([content], { type: "text/plain;charset=utf-8" })
        
        saveAs(rcLua, "rc.lua")
    }

    function handleLockMouseClicked() {
        emulator.lock_mouse();
    }

    function handleWindowBorderUpdated(newWindowBorder) {
        updateOption('windowBorder', newWindowBorder)
    }

    function handleFontUpdated(newFont) {
        updateOption('font', newFont)
    }

    return (
        <div>
            <TerminalSelector terminal={options.terminal} onTerminalSelected={handleTerminalSelected}/>
            <BackgroundSelector onBackgroundSelected={handleBackgroundSelected}/>
            <FontSelector emulator={emulator} font={options.font} onFontUpdated={handleFontUpdated}/>
            <CustomKeybindsChooser customKeybinds={options.customKeybinds} onCustomKeybindsUpdated={handleCustomKeybindsUpdated}/>
            <WindowBorderSizeChooser windowBorder={options.windowBorder} onWindowBorderUpdated={handleWindowBorderUpdated}/>
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

function FontSelector({ emulator, font, onFontUpdated }) {
    const [availableFontFamilies, setAvailableFontFamilies] = useState([])
    useEffect(() => {
        async function loadAvailableFontFamilies() {
            setAvailableFontFamilies(await getAvailableFontFamilies(emulator))
        }

        loadAvailableFontFamilies()
    }, [])

    function updateFont(fieldName, value) {
        const newFont = { ...font }
        newFont[fieldName] = value

        onFontUpdated(newFont)
    }

    const fontFamilyOptions = availableFontFamilies.map(fontFamily => <option value={fontFamily}>{fontFamily}</option>);
    return (
        <>
        <select
            value={font.family}
            onChange={(e) => updateFont('family', e.target.value)}>
            {fontFamilyOptions}
        </select>
        <input min="6" max="72" type="number" value={font.size} onChange={(e) => updateFont('size', e.target.value)}></input>
        </>
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

function WindowBorderSizeChooser({ windowBorder, onWindowBorderUpdated }) {
    function updateWindowBorder(fieldName, newValue) {
        let newWindowBorder = {
            ...windowBorder,
        }
        newWindowBorder[fieldName] = newValue;

        onWindowBorderUpdated(newWindowBorder)
    }

    return (
        <div>
            <p>
                Border size: 
                <input type="number"
                    value={windowBorder.size}
                    onChange={(e) => updateWindowBorder('size', parseInt(e.target.value))}>
                </input>
            </p>

            <p>
                Border normal color:
                <input type="color"
                    value={windowBorder.normalColor}
                    onChange={(e) => updateWindowBorder('normalColor', e.target.value)}>
                </input>
            </p>

            <p>
                Border focus color:
                <input type="color"
                    value={windowBorder.focusColor}
                    onChange={(e) => updateWindowBorder('focusColor', e.target.value)}>
                </input>
            </p>

            <p>
                Border marked color:
                <input type="color"
                    value={windowBorder.markedColor}
                    onChange={(e) => updateWindowBorder('markedColor', e.target.value)}>
                </input>
            </p>
        </div>
    );
}