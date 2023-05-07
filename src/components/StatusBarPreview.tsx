import React, { useState } from 'react'
import { IdentifiableStatusBarWidget, StatusBarWidgetGroups } from '../config'

type Props = {
    widgetGroups: StatusBarWidgetGroups
    selectedWidget: IdentifiableStatusBarWidget | null 
    onWidgetSelected: (widget: IdentifiableStatusBarWidget) => void
    onWidgetUnselected: (widget: IdentifiableStatusBarWidget) => void
}


export default function StatusBarPreview({ widgetGroups, selectedWidget, onWidgetSelected, onWidgetUnselected }: Props): JSX.Element {
    const orderedGroupNames: (keyof StatusBarWidgetGroups)[] = ['left', 'middle', 'right'] 
    const widgets = orderedGroupNames.flatMap((groupName) => widgetGroups[groupName])
    
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
