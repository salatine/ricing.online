import React, { useState } from 'react'
import { StatusBarWidget } from '../config'

type Props = {
    widgets: StatusBarWidget[]
    selectedWidget: StatusBarWidget | null 
    onWidgetClicked: (widget: StatusBarWidget) => void
}

export default function StatusBarPreview({widgets, selectedWidget, onWidgetClicked }: Props): JSX.Element {
    const widgetButtons = widgets.map((widget) => {
        const buttonStyle = widget === selectedWidget
            ? { backgroundColor: 'green' }
            : {}

        return <button onClick={(e) => onWidgetClicked(widget)} style={buttonStyle}>{widget.type}</button>
    })

    return (
        <>
            {widgetButtons}
        </>
    )
}