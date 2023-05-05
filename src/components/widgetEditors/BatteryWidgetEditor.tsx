import React from 'react'
import { BatteryWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: BatteryWidget
    onWidgetUpdated: (newWidget: BatteryWidget) => void
}

export function BatteryWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                👍
            </p>
        </div>
    )
}