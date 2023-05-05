import React from 'react'
import { VolumeWidget } from '../../config'
import { makePartialUpdater } from '../../utils'

type Props = {
    widget: VolumeWidget
    onWidgetUpdated: (newWidget: VolumeWidget) => void
}

export function VolumeWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <div>
            <p>
                👍 
            </p>
        </div>
    )
}