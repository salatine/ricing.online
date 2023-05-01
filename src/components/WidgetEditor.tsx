import React, { useState } from 'react'
import { LauncherWidget, StatusBarWidget } from '../config'
import { assertNever } from 'assert-never'
import { LauncherWidgetEditor } from './widgetEditors/LauncherWidgetEditor'

type Props = {
    widget: LauncherWidget,
    onWidgetUpdated: (widget: StatusBarWidget) => void
}

export default function WidgetEditor({ widget, onWidgetUpdated }: Props) {
    switch (widget.type) {
        case 'launcher':
            return <LauncherWidgetEditor widget={widget} onWidgetUpdated={onWidgetUpdated} />
        default:
            // 👎 ts is dumb
    }
}
