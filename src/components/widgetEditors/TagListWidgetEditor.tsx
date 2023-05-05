import React from 'react'
import { TagListWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: TagListWidget
    onWidgetUpdated: (newWidget: TagListWidget) => void
}

export function TagListWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                <input type="color"
                    value={widget.color}
                    onChange={(e) => updateWidget({ color: e.target.value })}>
                </input>
            </p>
        </div>
    )
}