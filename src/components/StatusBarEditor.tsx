import React, { useState } from 'react'
import { StatusBar, StatusBarPosition, StatusBarWidget, IdentifiableStatusBarWidget, StatusBarWidgetGroups } from '../config'
import { makePartialUpdater } from '../utils';
import { createIdentifiableWidget, findWidget } from '../widgets';
import StatusBarPreview from './StatusBarPreview';
import WidgetEditor from './WidgetEditor';
import { DEFAULT_WIDGETS } from '../constants' 

type Props = {
    statusBar: StatusBar
    onStatusBarUpdated: (newStatusBar: StatusBar) => void
}

export default function StatusBarEditor({ statusBar, onStatusBarUpdated }: Props) {
    const updateStatusBar = makePartialUpdater(statusBar, onStatusBarUpdated)
    const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

    const selectedWidgetPosition = selectedWidgetId !== null
        ? findWidget(statusBar.widgetGroups, selectedWidgetId)
        : null;

    const selectedWidget = selectedWidgetPosition !== null
        ? statusBar.widgetGroups[selectedWidgetPosition.group][selectedWidgetPosition.index]
        : null;
    
    function onWidgetSelected(widget: IdentifiableStatusBarWidget) {
        setSelectedWidgetId(widget.id)
    }

    function onWidgetUpdated(widget: StatusBarWidget) {
        if (selectedWidgetId === null || selectedWidgetPosition === null) {
            return
        }

        const newWidgetGroups = structuredClone(statusBar.widgetGroups) as StatusBarWidgetGroups
        newWidgetGroups[selectedWidgetPosition.group][selectedWidgetPosition.index] = {
            id: selectedWidgetId,
            ...widget
        }

        updateStatusBar({ widgetGroups: newWidgetGroups })
    }

    function onWidgetDeleted(widget: IdentifiableStatusBarWidget) {
        const widgetPosition = findWidget(statusBar.widgetGroups, widget.id)
        if (widgetPosition === null) {
            return
        }

        const newWidgetGroups = structuredClone(statusBar.widgetGroups)
        newWidgetGroups[widgetPosition.group].splice(widgetPosition.index, 1)
        
        updateStatusBar({ widgetGroups: newWidgetGroups })
    }

    function onWidgetAdded(widgetType: keyof StatusBarWidget) {
        const newWidgetGroups = structuredClone(statusBar.widgetGroups)

        for (const groupName of Object.keys(DEFAULT_WIDGETS)) {
            const group = DEFAULT_WIDGETS[groupName]
            const widget = group.find((w) => w.type === widgetType as string)
            if (widget !== undefined) {
                const identifiableWidget = createIdentifiableWidget(widget) 
                newWidgetGroups[groupName].push(identifiableWidget)
                break
            }
        }

       updateStatusBar({ widgetGroups: newWidgetGroups }) 
    }

    function onWidgetUnselected() {
        setSelectedWidgetId(null)
    }

    function onWidgetGroupsUpdated(newWidgetGroups: StatusBarWidgetGroups) {
        updateStatusBar({ widgetGroups: newWidgetGroups })
    }

    const selectedWidgetEditor = selectedWidget !== null
        ? <WidgetEditor widget={selectedWidget} onWidgetUpdated={onWidgetUpdated}/>
        : <Editor statusBar={statusBar} updateStatusBar={updateStatusBar}/>

    return (
        <div>
            <StatusBarPreview
                widgetGroups={statusBar.widgetGroups}
                selectedWidget={selectedWidget}
                onWidgetSelected={onWidgetSelected}
                onWidgetUnselected={onWidgetUnselected}
                onWidgetGroupsUpdated={onWidgetGroupsUpdated}
                onWidgetDeleted={onWidgetDeleted}/>
            <WidgetAdder onWidgetAdded={onWidgetAdded} />

            {selectedWidgetEditor}
        </div>
    )
}

type WidgetAdderProps = {
    onWidgetAdded: (widgetType: keyof StatusBarWidget) => void
}

function WidgetAdder({onWidgetAdded}: WidgetAdderProps) {

    const [isWidgetAdderSelected, setIsWidgetAdderSelected] = useState(false)

    const widgetTypes = Object.keys(DEFAULT_WIDGETS).map((groupName) => {
        const group = DEFAULT_WIDGETS[groupName]
        return group.map((widget: StatusBarWidget) => widget.type)
    }).flat()

    const plusButton = (
        <button 
            onClick={(e) => setIsWidgetAdderSelected(true)}>
                +
        </button>
    )

    const widgetChooser = (
        <select 
            onChange={(e) => { 
                onWidgetAdded(e.target.value as keyof StatusBarWidget) 
                setIsWidgetAdderSelected(false)
                } 
            }

            onBlur={(e) => setIsWidgetAdderSelected(false)}>
            {widgetTypes.map((widgetType) => 
                <option 
                    value={widgetType}>
                        {widgetType}
                </option>
            )}
        </select>
    )

    return isWidgetAdderSelected ? widgetChooser : plusButton
}

type EditorProps = {
    statusBar: StatusBar
    updateStatusBar: (newFields: Partial<StatusBar>) => void
}


function Editor({ statusBar, updateStatusBar }: EditorProps) {
    return (
        <div>
            <select 
                value={statusBar.position}
                onChange={(e) => updateStatusBar({position: e.target.value as StatusBarPosition})}>
                <option value="top">top</option>
                <option value="bottom">bottom</option>
                <option value="left">left</option>
                <option value="right">right</option>
            </select>

            <input 
                min="3"
                max="36"
                type="number"
                value={statusBar.height}
                onChange={(e) => updateStatusBar({height: parseInt(e.target.value)})}>
            </input>

            <input
                min="3"
                max="36"
                type="number"
                value={statusBar.borderWidth}
                onChange={(e) => updateStatusBar({borderWidth: parseInt(e.target.value)})}>
            </input>

            <input 
                type="color"
                onChange={(e) => updateStatusBar({color: e.target.value})}>
            </input>
        </div>
    );
}
