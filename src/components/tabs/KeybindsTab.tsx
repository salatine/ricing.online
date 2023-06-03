import React from 'react';
import { CustomCommandKeybind, DefaultCommandKeybind, Options } from '../../config';
import DefaultCommandKeybindsEditor from '../DefaultCommandKeybindsEditor';
import { makePartialUpdater } from '../../utils';
import CustomCommandKeybindsEditor from '../CustomCommandKeybindsEditor';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Fade from 'react-bootstrap/Fade';

type Props = {
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}


export default function KeybindsTab({ options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    return (
    <Fade in={true} appear={true}>
        <Container>
            <Stack gap={4}>
                <DefaultCommandKeybindsEditor
                    defaultCommandKeybinds={options.defaultCommandKeybinds}
                    onDefaultCommandKeybindsUpdated={(defaultCommandKeybinds) => updateOptions({ defaultCommandKeybinds })}
                    mainModKey={options.mainModKey}
                    onMainModKeyUpdated={(mainModKey) => updateOptions({ mainModKey })}/>
                <CustomCommandKeybindsEditor
                    customCommandKeybinds={options.customCommandKeybinds}
                    onCustomCommandKeybindsUpdated={(customCommandKeybinds) => updateOptions({ customCommandKeybinds })}
                    mainModKey={options.mainModKey}/>
            </Stack>
        </Container>
    </Fade>
    )
}


