import { AWESOME_CONFIG } from "../../constants";
import React from 'react'
import { Options } from '../../config'
import { makePartialUpdater, readBlobIntoUint8Array, readStringIntoUint8Array } from '../../utils';
import StatusBarEditor from "../StatusBarEditor";

type Props = {
    emulator: any
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}

export default function StatusBarTab({ emulator, options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    return (
        <StatusBarEditor
            statusBar={options.statusBar}
            onStatusBarUpdated={(statusBar) => updateOptions({ statusBar })}/> 
    )
}
