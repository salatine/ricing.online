import React, { useState } from 'react'
import { IdentifiableStatusBarWidget } from '../config'

type Props = {
    widgets: IdentifiableStatusBarWidget[]
    selectedWidget: IdentifiableStatusBarWidget | null 
    onWidgetSelected: (widget: IdentifiableStatusBarWidget) => void
    onWidgetUnselected: (widget: IdentifiableStatusBarWidget) => void
}

export default function StatusBarPreview({ widgets, selectedWidget, onWidgetSelected, onWidgetUnselected }: Props): JSX.Element {
    const widgetButtons = widgets.map((widget) => {
        const isSelectedWidget = selectedWidget !== null && widget.id === selectedWidget.id

        const buttonStyle = isSelectedWidget
            ? { backgroundColor: 'green' }
            : {}
        
        const clickCallback = isSelectedWidget
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