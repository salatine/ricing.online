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
import Stack from 'react-bootstrap/Stack';
import Fade from 'react-bootstrap/Fade';
import './AppearanceTab.scss';

type Props = {
    emulator: any
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}

export default function AppearanceTab({ emulator, options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    return (
        <Fade in={true} appear={true}>
            <Container>
                <Stack gap={3}>
                    <Row>
                        <Col>
                            <BackgroundEditor 
                                onBackgroundSelected={(background) => updateOptions({ background })}/>
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
                </Stack>
            </Container>
        </Fade>
    )
}