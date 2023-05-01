import React from 'react'
import { LauncherWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: LauncherWidget
    onWidgetUpdated: (newWidget: LauncherWidget) => void
}

export function LauncherWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                <input type="text"
                    value={widget.command}
                    onChange={(e) => updateWidget({ command: e.target.value })}>
                </input>
            </p>
        </div>
    )
}