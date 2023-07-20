import React from 'react';
import { makePartialUpdater } from '../utils';
import WindowBorderEditor from './WindowBorderEditor';
import { WindowOptions } from '../config';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Stack } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudMoon, faGauge, faEyeLowVision } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

type Props = {
    window: WindowOptions,
    onWindowUpdated: (window: WindowOptions) => void
}

export default function WindowEditor({window, onWindowUpdated}: Props) {
    const updateWindow = makePartialUpdater(window, onWindowUpdated)

    return (
        <>
        <h2 className="text-center m-3">Window</h2>
            <Row>
                <Col>
                    <WindowBorderEditor
                        windowBorder={window.border}
                        onWindowBorderUpdated={(windowBorder) => updateWindow({ border: windowBorder })}/>
                </Col>
                <Col>
                    <CompositorEditor
                        window={window}
                        onWindowUpdated={onWindowUpdated}
                        onWindowShadowUpdated={(windowShadow) => updateWindow({ shadow: windowShadow })}
                        onWindowOpacityUpdated={(windowOpacity) => updateWindow({ opacity: windowOpacity })}/>
                </Col>
            </Row>
        </>
    )
}

type CompositorProps = {
    window: WindowOptions,
    onWindowUpdated: (window: WindowOptions) => void,
    onWindowShadowUpdated: (windowShadow: WindowOptions['shadow']) => void,
    onWindowOpacityUpdated: (windowOpacity: WindowOptions['opacity']) => void
}

function CompositorEditor({ window, onWindowUpdated, onWindowShadowUpdated, onWindowOpacityUpdated }: CompositorProps ) {

    const updateWindow = makePartialUpdater(window, onWindowUpdated)
    const updateWindowShadow = makePartialUpdater(window.shadow, onWindowShadowUpdated)
    const updateWindowOpacity = makePartialUpdater(window.opacity, onWindowOpacityUpdated)

    return (
        <Stack gap={2}>
            <h4>Compositor settings</h4>
            <InputGroup>
                <InputGroup.Text>Shadow opacity</InputGroup.Text>
                <Form.Control 
                    type="number"
                    value={window.shadow.opacity}
                    onChange={(e) => updateWindowShadow({ opacity: parseInt(e.target.value) })} />
                <InputGroup.Text>
                    <FontAwesomeIcon icon={faCloudMoon} />
                </InputGroup.Text>
            </InputGroup>

            <InputGroup>
                <InputGroup.Text>Shadow radius</InputGroup.Text>
                <Form.Control 
                    type="number"
                    value={window.shadow.radius}
                    onChange={(e) => updateWindowShadow({ radius: parseInt(e.target.value) })} />
                <InputGroup.Text>
                    <FontAwesomeIcon icon={faCloudMoon} />
                </InputGroup.Text>
            </InputGroup>

            <InputGroup>
                <InputGroup.Text>Animation speed</InputGroup.Text>
                <Form.Control
                    type="number"
                    value={window.animationSpeed}
                    onChange={(e) => updateWindow({ animationSpeed: parseInt(e.target.value) })} />
                <InputGroup.Text>
                    <FontAwesomeIcon icon={faGauge} />
                </InputGroup.Text>
            </InputGroup>

            <InputGroup>
                <InputGroup.Text>Corner radius</InputGroup.Text>
                <Form.Control
                    type="number"
                    value={window.cornerRadius}
                    onChange={(e) => updateWindow({ cornerRadius: parseInt(e.target.value) })} />
                <InputGroup.Text>
                    <FontAwesomeIcon icon={faCircle} />
                </InputGroup.Text>
            </InputGroup>

            <InputGroup>
                <InputGroup.Text>Active opacity</InputGroup.Text>
                <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={window.opacity.active}
                    onChange={(e) => updateWindowOpacity({ active: parseInt(e.target.value) })} />
                <InputGroup.Text>
                    <FontAwesomeIcon icon={faEyeLowVision} />
                </InputGroup.Text>
            </InputGroup>

            <InputGroup>
                <InputGroup.Text>Inactive opacity</InputGroup.Text>
                <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={window.opacity.inactive}
                    onChange={(e) => updateWindowOpacity({ inactive: parseInt(e.target.value) })} />
                <InputGroup.Text>
                    <FontAwesomeIcon icon={faEyeLowVision} />
                </InputGroup.Text>
            </InputGroup>
        </Stack>
    )
}
