import React from 'react'
import { BrightnessWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: BrightnessWidget
    onWidgetUpdated: (newWidget: BrightnessWidget) => void
}

export function BrightnessWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                👍
            </p>
        </div>
    )
}

