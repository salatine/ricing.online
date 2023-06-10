import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { runCommand } from "./rpc";
import Header from './components/Header'
import AppearanceTab from "./components/tabs/AppearanceTab"
import StatusBarTab from "./components/tabs/StatusBarTab"
import { AWESOME_CONFIG, DEFAULT_OPTIONS } from "./constants";
import { Options, getConfigFiles, applyConfigFiles, exportConfigFiles } from "./config";
import KeybindsTab from "./components/tabs/KeybindsTab";
import DefaultApplicationsTab from "./components/tabs/DefaultApplicationsTab";
import Stack from 'react-bootstrap/Stack';
import { Container } from 'react-bootstrap';
import { restoreState } from './emulator';
import { readBlobIntoUint8Array } from './utils';

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
        return (<Nav.Item key={tabId}>
            <Nav.Link eventKey={tabId}>{tab.name}</Nav.Link>
        </Nav.Item>)
    })

    const navigationTabs = (<Nav fill variant='pills' activeKey={selectedTabId} onSelect={(newTabId) => setSelectedTabId(newTabId as TabId)}>
        {tabItems}
    </Nav>)

    async function updatePreview(options: Options) {
        // FIXME acho que isso n devia estar aqui
        if (options.background) {
            const backgroundFileContents = await readBlobIntoUint8Array(options.background);
    -       await emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
        }

        const configFiles = getConfigFiles(options)
        await applyConfigFiles(emulator, configFiles)

        await runCommand(emulator, "echo 'awesome.emit_signal(\"load-rc-lua\")' | DISPLAY=':0' awesome-client"); 
    }

    async function handleUpdatePreviewClicked() {
        await restoreState(emulator, "/build/images/debian-state-base.bin.zst")

        await updatePreview(options)
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

    // FIXME sla crime
    useEffect(() => {
        async function applyDefaultConfigOnStartup() {
            updatePreview(DEFAULT_OPTIONS)
        }

        applyDefaultConfigOnStartup()
    }, [emulator])

    return (
        <>
            <Header
                handleUpdatePreviewClicked={handleUpdatePreviewClicked} 
                handleExportConfigFilesClicked={handleExportConfigFilesClicked}
                handleLockMouseClicked={handleLockMouseClicked}/>
            <Container className="pb-4">
                <Stack gap={4}>
                    {navigationTabs}
                    {tabs[selectedTabId].component}
                </Stack>
            </Container>
        </>
    ); 
}
