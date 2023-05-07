import React, { useState } from 'react'
import { StatusBar, StatusBarPosition, StatusBarWidget } from '../config'
import { makePartialUpdater } from '../utils';
import StatusBarPreview from './StatusBarPreview';
import WidgetEditor from './WidgetEditor';

type Props = {
    statusBar: StatusBar
    onStatusBarUpdated: (newStatusBar: StatusBar) => void
}

export default function StatusBarEditor({ statusBar, onStatusBarUpdated }: Props) {
    const updateStatusBar = makePartialUpdater(statusBar, onStatusBarUpdated)
    const [selectedWidget, setSelectedWidget] = useState<StatusBarWidget | null>(null);
    
    function onWidgetSelected(widget: StatusBarWidget) {
        setSelectedWidget(widget)
    }

    function onWidgetUpdated(widget: StatusBarWidget) {
        const updatedWidgetIndex = statusBar.widgets.findIndex((other) => other.type === widget.type)
        const newWidgets = [...statusBar.widgets]
        newWidgets[updatedWidgetIndex] = widget

        updateStatusBar({ widgets: newWidgets })
        setSelectedWidget(widget)
    }

    function onWidgetUnselected(widget: StatusBarWidget) {
        setSelectedWidget(null)
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
