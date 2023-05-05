import React from 'react'
import { TaskListWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: TaskListWidget
    onWidgetUpdated: (newWidget: TaskListWidget) => void
}

export function TaskListWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                <input type="number"
                    value={widget.fontSize}
                    onChange={(e) => updateWidget({ fontSize: parseInt(e.target.value) })}>
                </input>
            </p>
        </div>
    )
}