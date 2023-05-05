import React, { useState } from 'react'
import { LauncherWidget, StatusBarWidget } from '../config'
import { assertNever } from 'assert-never'
import { LauncherWidgetEditor } from './widgetEditors/LauncherWidgetEditor'
import { TaskListWidgetEditor } from './widgetEditors/TaskListWidgetEditor'
import { TagListWidgetEditor } from './widgetEditors/TagListWidgetEditor'
import { ClockWidgetEditor } from './widgetEditors/ClockWidgetEditor'
import { VolumeWidgetEditor } from './widgetEditors/VolumeWidgetEditor'
import { BrightnessWidgetEditor } from './widgetEditors/BrightnessWidgetEditor'
import { SystrayWidgetEditor } from './widgetEditors/SystrayWidgetEditor'
import { BatteryWidgetEditor } from './widgetEditors/BatteryWidgetEditor'

type Props = {
    widget: StatusBarWidget,
    onWidgetUpdated: (widget: StatusBarWidget) => void
}

export default function WidgetEditor({ widget, onWidgetUpdated }: Props) {
    switch (widget.type) {
        case 'launcher':
            return <LauncherWidgetEditor widget={widget} onWidgetUpdated={onWidgetUpdated} />
        case 'taglist':
            return <TagListWidgetEditor widget={widget} onWidgetUpdated={onWidgetUpdated} />
        case 'tasklist':
            return <TaskListWidgetEditor widget={widget} onWidgetUpdated={onWidgetUpdated} />
        
        // No options' editors
        case 'battery':
            return <BatteryWidgetEditor widget={widget}/>
        case 'brightness':
            return <BrightnessWidgetEditor widget={widget} />
        case 'clock':
            return <ClockWidgetEditor widget={widget} />
        case 'systray':
            return <SystrayWidgetEditor widget={widget} />
        case 'volume':
            return <VolumeWidgetEditor widget={widget} />

        default:
            assertNever(widget)
    }
}
