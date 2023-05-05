import { BatteryWidget } from '../../config'
import { NoOptionsWidgetEditor } from './NoOptionsWidgetEditor'

type Props = {
    widget: BatteryWidget
}

export const BatteryWidgetEditor: ({widget}: Props) => JSX.Element = NoOptionsWidgetEditor

