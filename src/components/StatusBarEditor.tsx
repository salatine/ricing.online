import React, { useState } from 'react'
import { StatusBar, StatusBarWidget } from '../config'
import StatusBarPreview from './StatusBarPreview';

type Props = {
    statusBar: StatusBar
    onStatusBarUpdated: (newStatusBar: StatusBar) => void
}

export default function StatusBarEditor({ statusBar, onStatusBarUpdated }: Props) {
    const [selectedWidget, setSelectedWidget] = useState<StatusBarWidget | null>(null);
    
    function onWidgetClicked(widget: StatusBarWidget) {
        setSelectedWidget(widget)
    }

    function onWidgetUpdated(widget: StatusBarWidget) {
        // 👍
    }

    const selectedWidgetEditor = selectedWidget !== null
        ? <WidgetEditor widget={selectedWidget} onWidgetUpdated={onWidgetUpdated}/>
        : <></>

    return (
        <div>
            <StatusBarPreview
                widgets={statusBar.widgets}
                selectedWidget={selectedWidget}
                onWidgetClicked={onWidgetClicked}/>

            {selectedWidgetEditor}
        </div>
    )
}

function WidgetEditor({ widget, onWidgetUpdated }) {
    return <>👍</>
}
