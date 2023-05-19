import { AWESOME_CONFIG } from "./constants";
import React, { useState } from 'react';
import { runCommand } from "./rpc";
import { readBlobIntoUint8Array, readStringIntoUint8Array } from './utils'
import TerminalEditor from "./components/TerminalEditor";
import BackgroundEditor from "./components/BackgroundEditor";
import CustomCommandKeybindsEditor from "./components/CustomCommandKeybindsEditor";
import UpdatePreviewButton from "./components/UpdatePreviewButton";
import ExportConfigFilesButton from "./components/ExportConfigFilesButton";
import LockMouseButton from "./components/LockMouseButton";
import WindowBorderEditor from "./components/WindowBorderEditor";
import FontEditor from "./components/FontEditor";
import StatusBarEditor from "./components/StatusBarEditor";
import DefaultCommandKeybindsEditor from "./components/DefaultCommandKeybindsEditor";
import { DEFAULT_OPTIONS } from "./constants";
import { Options, getConfigFiles, applyConfigFiles, CustomCommandKeybind, DefaultCommandKeybind, WindowBorder, exportConfigFiles } from "./config";

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
        const backgroundFileContents = await readBlobIntoUint8Array(backgroundFile);

        await emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
    }

    function handleCustomCommandKeybindsUpdated(newCustomCommandKeybinds: CustomCommandKeybind[]) {
        updateOption({ customCommandKeybinds: newCustomCommandKeybinds });
    }

    function handleDefaultCommandKeybindsUpdated(newDefaultCommandKeybinds: DefaultCommandKeybind[]) {
        updateOption({ defaultCommandKeybinds: newDefaultCommandKeybinds });
    }

    async function handleUpdatePreviewClicked() {
        const configFiles = getConfigFiles(options)
        await applyConfigFiles(emulator, configFiles)

        runCommand(emulator, "DISPLAY=:0 awesome-client 'awesome.restart()'"); 
    }

    async function handleExportConfigFilesClicked() {
        await exportConfigFiles(getConfigFiles(options));
    }

    function handleLockMouseClicked() {
        emulator.lock_mouse();
    }

    function handleWindowBorderUpdated(newWindowBorder: WindowBorder) {
        updateOption({ windowBorder: newWindowBorder })
    }

    function handleFontUpdated(newFont) {
        updateOption({ font: newFont })
    }
    
    function handleStatusBarUpdated(newStatusBar) {
        updateOption({ statusBar: newStatusBar })
    }

    function handleMainModKeyUpdated(newMainModKey) {
        updateOption({ mainModKey: newMainModKey })
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
            
            <DefaultCommandKeybindsEditor
                defaultCommandKeybinds={options.defaultCommandKeybinds}
                onDefaultCommandKeybindsUpdated={handleDefaultCommandKeybindsUpdated}
                mainModKey={options.mainModKey}/>
            
            <CustomCommandKeybindsEditor
                customCommandKeybinds={options.customCommandKeybinds} 
                onCustomCommandKeybindsUpdated={handleCustomCommandKeybindsUpdated}
                mainModKey={options.mainModKey}
                onMainModKeyUpdated={handleMainModKeyUpdated}/>

            <WindowBorderEditor
                windowBorder={options.windowBorder} 
                onWindowBorderUpdated={handleWindowBorderUpdated}/>

            <UpdatePreviewButton 
                onUpdateClicked={handleUpdatePreviewClicked}/>

            <ExportConfigFilesButton
                onExportClicked={handleExportConfigFilesClicked}/>

            <LockMouseButton 
                onLockClicked={handleLockMouseClicked}/>

            <StatusBarEditor
                statusBar={options.statusBar} onStatusBarUpdated={handleStatusBarUpdated}/> 
        </div>
    ); 
}


