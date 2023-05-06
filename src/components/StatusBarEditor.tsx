import React, { useState } from 'react'
import { StatusBar, StatusBarWidget } from '../config'
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
        : <></>

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
