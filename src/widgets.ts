import { v4 as uuidv4 } from 'uuid'
import { IdentifiableStatusBarWidget, StatusBarWidget, StatusBarWidgetGroups } from './config'

export function createIdentifiableWidget(options: StatusBarWidget): IdentifiableStatusBarWidget {
    return {
        id: uuidv4(),
        ...options,
    }
}

export type WidgetLocation = {
    group: keyof StatusBarWidgetGroups
    index: number
}

export function findWidget(groups: StatusBarWidgetGroups, id: string): WidgetLocation | null {
    for (const group of Object.keys(groups) as (keyof StatusBarWidgetGroups)[]) {
        const index = groups[group].findIndex((widget) => widget.id === id)
        if (index !== -1) {
            return { group, index }
        }
    }

    return null
}
