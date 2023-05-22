import React, { useState } from 'react';
import { runCommand } from "./rpc";
import UpdatePreviewButton from "./components/UpdatePreviewButton";
import ExportConfigFilesButton from "./components/ExportConfigFilesButton";
import LockMouseButton from "./components/LockMouseButton";
import AppearanceTab from "./components/tabs/AppearanceTab"
import StatusBarTab from "./components/tabs/StatusBarTab"
import { DEFAULT_OPTIONS } from "./constants";
import { Options, getConfigFiles, applyConfigFiles, exportConfigFiles } from "./config";
import KeybindsTab from "./components/tabs/KeybindsTab";
import DefaultApplicationsTab from "./components/tabs/DefaultApplicationsTab";

type Props = {
    emulator: any
}

type Tab = {
    name: string
    component: JSX.Element
}

type TabId 
    = 'appearance' 
    | 'status-bar' 
    | 'default-applications' 
    | 'keybinds'

export default function ReactApp({ emulator }: Props) {
    const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
    const [selectedTabId, setSelectedTabId] = useState<TabId>('appearance');

    const tabs: Record<TabId, Tab> = {
        'appearance': {
            name: 'Appearance',
            component: 
                <AppearanceTab
                    emulator={emulator}
                    options={options}
                    onOptionsUpdated={handleOptionsUpdated}/>,
        },
        'status-bar': {
            name: 'Status bar',
            component:
                <StatusBarTab
                    emulator={emulator}
                    options={options}
                    onOptionsUpdated={handleOptionsUpdated}/>
        },
        'default-applications': { 
            name: 'Default applications',
            component: 
                <DefaultApplicationsTab
                    options={options}
                    onOptionsUpdated={handleOptionsUpdated}/>,
        },
        'keybinds': {
            name: 'Keybinds',
            component: 
                <KeybindsTab
                    options={options}
                    onOptionsUpdated={handleOptionsUpdated}/>,
        },
    }

    const tabItems = Object.entries(tabs).map(([tabId, tab]) => {
        return (<li><a onClick={(e) => setSelectedTabId(tabId as TabId)}>{tab.name}</a></li>)
    })

    const navigationTabs = (<nav><ul>{tabItems}</ul></nav>)

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
            {navigationTabs}
            {tabs[selectedTabId].component}
            <UpdatePreviewButton 
                onUpdateClicked={handleUpdatePreviewClicked}/>

            <ExportConfigFilesButton
                onExportClicked={handleExportConfigFilesClicked}/>

            <LockMouseButton 
                onLockClicked={handleLockMouseClicked}/> 
        </div>
    ); 
}
