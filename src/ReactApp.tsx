import { AWESOME_CONFIG } from "./constants";
import React, { ReactComponentElement, useState } from 'react';
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

type Tab
    = 'appearance'
    | 'status-bar'
    | 'default-applications'
    | 'keybinds'

export default function ReactApp({ emulator }: Props) {
    const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
    const [selectedTab, setSelectedTab] = useState<Tab>('appearance');

    const tabComponents: Record<Tab, JSX.Element> = {
        'appearance': 
            <AppearanceTab
                emulator={emulator}
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>,
        'status-bar': 
            <StatusBarTab
                emulator={emulator}
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>,
        'default-applications': 
            <DefaultApplicationsTab
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>,
        'keybinds': 
            <KeybindsTab
                options={options}
                onOptionsUpdated={handleOptionsUpdated}/>,
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

    function handleOptionsUpdated(newOptions: Options) {
        setOptions(newOptions)
    }

    return (
        <div>
            <nav>
                <ul>
                    <li><a onClick={(e) => setSelectedTab('appearance')}>Appearance</a></li>
                    <li><a onClick={(e) => setSelectedTab('status-bar')}>Status Bar</a></li>
                    <li><a onClick={(e) => setSelectedTab('default-applications')}>Default Applications</a></li>
                    <li><a onClick={(e) => setSelectedTab('keybinds')}>Keybinds</a></li>
                </ul>
            </nav>
            
            {tabComponents[selectedTab]}
            <UpdatePreviewButton 
                onUpdateClicked={handleUpdatePreviewClicked}/>

            <ExportConfigFilesButton
                onExportClicked={handleExportConfigFilesClicked}/>

            <LockMouseButton 
                onLockClicked={handleLockMouseClicked}/> 
        </div>
    ); 
}


