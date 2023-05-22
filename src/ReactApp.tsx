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
import AppearanceTab from "./components/tabs/AppearanceTab"
import StatusBarTab from "./components/tabs/StatusBarTab"
import { DEFAULT_OPTIONS } from "./constants";
import { Options, getConfigFiles, applyConfigFiles, CustomCommandKeybind, DefaultCommandKeybind, WindowBorder, exportConfigFiles } from "./config";
import KeybindsTab from "./components/tabs/KeybindsTab";
import DefaultApplicationsTab from "./components/tabs/DefaultApplicationsTab";

type Props = {
    emulator: any
}

export default function ReactApp({ emulator }: Props) {
    const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);

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

    function handleOptionsUpdated(newOptions: Options) {
        setOptions(newOptions)
    }

    return (
        <div>
            <AppearanceTab
                emulator={emulator}
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>
            
            <StatusBarTab
                emulator={emulator}
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>

            <KeybindsTab
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>
            
            <DefaultApplicationsTab
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>

            <UpdatePreviewButton 
                onUpdateClicked={handleUpdatePreviewClicked}/>

            <ExportConfigFilesButton
                onExportClicked={handleExportConfigFilesClicked}/>

            <LockMouseButton 
                onLockClicked={handleLockMouseClicked}/> 
        </div>
    ); 
}


