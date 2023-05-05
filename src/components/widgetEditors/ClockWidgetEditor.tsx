import { ClockWidget } from '../../config'
import { NoOptionsWidgetEditor } from './NoOptionsWidgetEditor'

type Props = {
    widget: ClockWidget
}

export const ClockWidgetEditor: ({widget}: Props) => JSX.Element = NoOptionsWidgetEditor

