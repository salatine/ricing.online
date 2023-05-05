import React from 'react'
import { SystrayWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: SystrayWidget
    onWidgetUpdated: (newWidget: SystrayWidget) => void
}

export function SystrayWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                👍
            </p>
        </div>
    )
}