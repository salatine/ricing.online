import { AWESOME_CONFIG } from "../../constants";
import React from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Options } from '../../config'
import { makePartialUpdater, readBlobIntoUint8Array, readStringIntoUint8Array } from '../../utils';
import BackgroundEditor from "../BackgroundEditor";
import FontEditor from "../FontEditor";
import WindowBorderEditor from "../WindowBorderEditor";

import './AppearanceTab.scss';

type Props = {
    emulator: any
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}

export default function AppearanceTab({ emulator, options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    // FIXME maybe this should be in the component itself?
    async function handleBackgroundSelected(backgroundFile: File) {
        const backgroundFileContents = await readBlobIntoUint8Array(backgroundFile);

        await emulator.create_file(AWESOME_CONFIG + "/background", backgroundFileContents);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <BackgroundEditor 
                        onBackgroundSelected={handleBackgroundSelected}/>
                </Col>

                <Col>
                    <FontEditor 
                        emulator={emulator} 
                        font={options.font} 
                        onFontUpdated={(font) => updateOptions({ font })}/>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <WindowBorderEditor
                        windowBorder={options.windowBorder} 
                        onWindowBorderUpdated={(windowBorder) => updateOptions({ windowBorder })}/>
                </Col>
            </Row>
        </Container>
    )
}