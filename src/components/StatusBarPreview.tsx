import React, { useState } from 'react'
import { StatusBarWidget } from '../config'

type Props = {
    widgets: StatusBarWidget[]
    selectedWidget: StatusBarWidget | null 
    onWidgetSelected: (widget: StatusBarWidget) => void
    onWidgetUnselected: (widget: StatusBarWidget) => void
}

export default function StatusBarPreview({widgets, selectedWidget, onWidgetSelected, onWidgetUnselected }: Props): JSX.Element {
    const widgetButtons = widgets.map((widget) => {
        const buttonStyle = widget === selectedWidget
            ? { backgroundColor: 'green' }
            : {}
        
        const clickCallback = widget === selectedWidget
            ? onWidgetUnselected
            : onWidgetSelected

        return <button onClick={(e) => clickCallback(widget)} style={buttonStyle}>{widget.type}</button>
    })

    return (
        <>
            {widgetButtons}
        </>
    )
}