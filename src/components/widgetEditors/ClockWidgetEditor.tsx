import React from 'react'
import { ClockWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: ClockWidget
    onWidgetUpdated: (newWidget: ClockWidget) => void
}

export function ClockWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                👍 
            </p>
        </div>
    )
}