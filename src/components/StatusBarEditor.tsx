import React, { useState } from 'react'
import { StatusBar, StatusBarPosition, StatusBarWidget, IdentifiableStatusBarWidget } from '../config'
import { makePartialUpdater } from '../utils';
import StatusBarPreview from './StatusBarPreview';
import WidgetEditor from './WidgetEditor';

type Props = {
    statusBar: StatusBar
    onStatusBarUpdated: (newStatusBar: StatusBar) => void
}

export default function StatusBarEditor({ statusBar, onStatusBarUpdated }: Props) {
    const updateStatusBar = makePartialUpdater(statusBar, onStatusBarUpdated)
    const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

    const selectedWidgetIndex = selectedWidgetId !== null
        ? statusBar.widgets.findIndex((widget) => widget.id === selectedWidgetId)
        : null;

    const selectedWidget = selectedWidgetIndex !== null
        ? statusBar.widgets[selectedWidgetIndex]
        : null;
    
    function onWidgetSelected(widget: IdentifiableStatusBarWidget) {
        setSelectedWidgetId(widget.id)
    }

    function onWidgetUpdated(widget: StatusBarWidget) {
        if (selectedWidgetId === null || selectedWidgetIndex === null) {
            return
        }

        const newWidgets = [...statusBar.widgets]
        newWidgets[selectedWidgetIndex] = {
            id: selectedWidgetId,
            ...widget
        }

        updateStatusBar({ widgets: newWidgets })
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
                widgets={statusBar.widgets}
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
