import { v4 as uuidv4 } from 'uuid'
import { IdentifiableStatusBarWidget, StatusBarWidget } from './config'

export function createIdentifiableWidget(options: StatusBarWidget): IdentifiableStatusBarWidget {
    return {
        id: uuidv4(),
        ...options,
    }
}
