import { VolumeWidget } from '../../config'
import { NoOptionsWidgetEditor } from './NoOptionsWidgetEditor'

type Props = {
    widget: VolumeWidget
}

export const VolumeWidgetEditor: ({widget}: Props) => JSX.Element = NoOptionsWidgetEditor


