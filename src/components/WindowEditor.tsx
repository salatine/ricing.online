import React from 'react';
import { makePartialUpdater } from '../utils';
import WindowBorderEditor from './WindowBorderEditor';
import { WindowOptions } from '../config';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Props = {
    window: WindowOptions,
    onWindowUpdated: (window: WindowOptions) => void
}

export default function WindowEditor({window, onWindowUpdated}: Props) {
    const updateWindow = makePartialUpdater(window, onWindowUpdated)

    return (
        <>
        <h2>Window</h2>
            <Col>
                <Row>
                    <WindowBorderEditor
                        windowBorder={window.border}
                        onWindowBorderUpdated={(windowBorder) => updateWindow({ border: windowBorder })}/>
                </Row>
                <Row>
                    
                </Row>
            </Col>
        </>
    )
}