import { SystrayWidget } from '../../config'
import { NoOptionsWidgetEditor } from './NoOptionsWidgetEditor'

type Props = {
    widget: SystrayWidget
}

export const SystrayWidgetEditor: ({widget}: Props) => JSX.Element = NoOptionsWidgetEditor

