import React from 'react'
import { CustomCommandKeybind, DefaultCommandKeybind, Options } from '../../config'
import DefaultCommandKeybindsEditor from '../DefaultCommandKeybindsEditor'
import { makePartialUpdater } from '../../utils'
import CustomCommandKeybindsEditor from '../CustomCommandKeybindsEditor'

type Props = {
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}


export default function KeybindsTab({ options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    return (
    <>
        <DefaultCommandKeybindsEditor
            defaultCommandKeybinds={options.defaultCommandKeybinds}
            onDefaultCommandKeybindsUpdated={(defaultCommandKeybinds) => updateOptions({ defaultCommandKeybinds })}
            mainModKey={options.mainModKey}/>
        <CustomCommandKeybindsEditor
            customCommandKeybinds={options.customCommandKeybinds}
            onCustomCommandKeybindsUpdated={(customCommandKeybinds) => updateOptions({ customCommandKeybinds })}
            mainModKey={options.mainModKey}
            onMainModKeyUpdated={(mainModKey) => updateOptions({ mainModKey })}/>
    </>
    )
}


