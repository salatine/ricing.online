import React, { useState } from 'react'
import { StatusBar, StatusBarPosition, StatusBarWidget, IdentifiableStatusBarWidget, StatusBarWidgetGroups } from '../config'
import { makePartialUpdater } from '../utils';
import { findWidget } from '../widgets';
import StatusBarPreview from './StatusBarPreview';
import WidgetEditor from './WidgetEditor';

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

    function onWidgetUnselected() {
        setSelectedWidgetId(null)
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
                onWidgetUnselected={onWidgetUnselected}/>

            {selectedWidgetEditor}
        </div>
    )
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
