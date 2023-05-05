import { BrightnessWidget } from '../../config'
import { NoOptionsWidgetEditor } from './NoOptionsWidgetEditor'

type Props = {
    widget: BrightnessWidget
}

export const BrightnessWidgetEditor: ({widget}: Props) => JSX.Element = NoOptionsWidgetEditor

