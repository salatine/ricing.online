import React from 'react'
import { StatusBarWidget } from '../../config'

type Props = {
    widget: StatusBarWidget
}

export function NoOptionsWidgetEditor({widget}: Props) {
    return (
        <div>
            <p>
               No options available for the {widget.type} widget! 
            </p>
        </div>
    )
}