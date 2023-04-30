import { AWESOME_CONFIG } from "./constants";
import React, { useState } from 'react';
import { runCommand } from "./rpc";
import { saveAs } from "file-saver";
import { readFileIntoUint8Array, readStringIntoUint8Array } from './utils'
import TerminalEditor from "./components/TerminalEditor";
import BackgroundEditor from "./components/BackgroundEditor";
import CustomKeybindsEditor from "./components/CustomKeybindsEditor";
import UpdatePreviewButton from "./components/UpdatePreviewButton";
import ExportRcLuaButton from "./components/ExportRcLuaButton";
import LockMouseButton from "./components/LockMouseButton";
import WindowBorderEditor from "./components/WindowBorderEditor";
import FontEditor from "./components/FontEditor";
import { DEFAULT_OPTIONS } from "./constants";
import { Options, getConfig, applyConfig, CustomKeybindOptions, WindowBorderOptions } from "./config";

type Props = {
    emulator: any
}

export default function ReactApp({ emulator }: Props) {
    const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);

    function updateOption(newFields: Partial<Options>) {
        const newOptions = {
            ...options,
            ...newFields,
        };

        setOptions(newOptions);
    }

    function handleTerminalSelected(newTerminal: string) {
        updateOption({ terminal: newTerminal });
    }

    async function handleBackgroundSelected(backgroundFile: File) {
        const backgroundFileContents = await readFileIntoUint8Array(backgroundFile);

        await emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
    }

    function handleCustomKeybindsUpdated(newCustomKeybinds: CustomKeybindOptions[]) {
        updateOption({ customKeybinds: newCustomKeybinds });
    }

    async function handleUpdatePreviewClicked() {
        await applyConfig(emulator, options)
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

    function handleWindowBorderUpdated(newWindowBorder: WindowBorderOptions) {
        updateOption({ windowBorder: newWindowBorder })
    }

    function handleFontUpdated(newFont) {
        updateOption({ font: newFont })
    }

    return (
        <div>
            <TerminalEditor 
                terminal={options.terminal} 
                onTerminalSelected={handleTerminalSelected}/>

            <BackgroundEditor 
                onBackgroundSelected={handleBackgroundSelected}/>

            <FontEditor 
                emulator={emulator} 
                font={options.font} 
                onFontUpdated={handleFontUpdated}/>
            
            <CustomKeybindsEditor
                customKeybinds={options.customKeybinds} 
                onCustomKeybindsUpdated={handleCustomKeybindsUpdated}/>

            <WindowBorderEditor
                windowBorder={options.windowBorder} 
                onWindowBorderUpdated={handleWindowBorderUpdated}/>

            <UpdatePreviewButton 
                onUpdateClicked={handleUpdatePreviewClicked}/>

            <ExportRcLuaButton 
                onExportClicked={handleExportRcLuaClicked}/>

            <LockMouseButton 
                onLockClicked={handleLockMouseClicked}/>
        </div>
    ); 
}


