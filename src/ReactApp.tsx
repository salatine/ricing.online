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
import { restoreState, waitForRcLuaLoaded } from './emulator';
import { readBlobIntoUint8Array } from './utils';
import { makePartialUpdater } from './utils';
import Spinner from 'react-bootstrap/Spinner';
import Fade from 'react-bootstrap/Fade';
import assertNever from 'assert-never';

type Props = {
    loadEmulator: () => Promise<any>
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

type LoadingEmulator = {
    type: 'loading_emulator'
}

type UpdatingPreview = {
    type: 'updating_preview',
    emulator: any,
    options: Options,
    selectedTabId: TabId,
}

type Ready = {
    type: 'ready',
    emulator: any,
    options: Options,
    selectedTabId: TabId,
}

type AppState
    = LoadingEmulator
    | UpdatingPreview
    | Ready

export default function ReactApp({ loadEmulator }: Props) {
    const [appState, setAppState] = useState<AppState>({ type: 'loading_emulator' })

    const loadingSpinner = (
        <Fade in={true} appear={true}>
            <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', backgroundColor: '#212529', width: '100vw', height: '100vh', zIndex: 12 }}>
                <Spinner data-testid="loading" animation="border" variant="primary" />
            </div>
        </Fade>
    )

    useEffect(() => {
        async function callLoadingEmulator() {
            const emulator = await loadEmulator()

            await updatePreviewFromLoadingState(emulator)
        }

        callLoadingEmulator()
    }, [setAppState])

    async function updatePreview(emulator: any, options: Options) {
        // FIXME acho que isso n devia estar aqui
        if (options.background) {
            const backgroundFileContents = await readBlobIntoUint8Array(options.background);
            await emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
        }

        const configFiles = getConfigFiles(options)
        await applyConfigFiles(emulator, configFiles)

        await runCommand(emulator, "echo 'awesome.emit_signal(\"load-rc-lua\")' | DISPLAY=':0' awesome-client");
        await waitForRcLuaLoaded(emulator)
    }

    async function updatePreviewFromLoadingState(emulator: any) {
        if (appState.type !== 'loading_emulator') {
            return
        }

        const updatingAppState: UpdatingPreview = {
            type: 'updating_preview',
            emulator,
            options: DEFAULT_OPTIONS,
            selectedTabId: 'appearance',
        }
        setAppState(updatingAppState)

        await updatePreview(updatingAppState.emulator, updatingAppState.options)

        const readyAppState: Ready = {...updatingAppState, type: 'ready'}
        setAppState(readyAppState)
    }

    async function updatePreviewFromReadyState() {
        if (appState.type !== 'ready') {
            return
        }
        
        const updatingAppState: UpdatingPreview = {...appState, type: 'updating_preview'}
        setAppState(updatingAppState)

        await restoreState(appState.emulator, "/build/images/debian-state-base.bin.zst")
        await updatePreview(appState.emulator, appState.options)

        const readyAppState: Ready = {...updatingAppState, type: 'ready'}
        setAppState(readyAppState)
    }

    const updateAppState = makePartialUpdater(appState, setAppState)

    switch (appState.type) {
        case 'loading_emulator':
            return loadingSpinner
        case 'updating_preview':
            return loadingSpinner
        case 'ready':
            return (
            <Fade in={true} appear={true}>
                <ReadyReactApp 
                    emulator={appState.emulator} 
                    options={appState.options} 
                    setOptions={(options) => updateAppState({ options })} 
                    selectedTabId={appState.selectedTabId}
                    setSelectedTabId={(selectedTabId) => updateAppState({ selectedTabId })}
                    updatePreview={updatePreviewFromReadyState}/>
            </Fade>
            )
        default:
            return assertNever(appState)
    }
}

type ReadyProps = {
    emulator: any,
    options: Options,
    setOptions: (options: Options) => void,
    selectedTabId: TabId,
    setSelectedTabId: (tabId: TabId) => void,
    updatePreview: (options: Options) => Promise<void>,
}

function ReadyReactApp({ emulator, options, setOptions, selectedTabId, setSelectedTabId, updatePreview }: ReadyProps) {
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

    async function handleUpdatePreviewClicked() {
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
