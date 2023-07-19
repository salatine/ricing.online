import React from 'react';
import { WindowOptions, WindowBorder } from '../config';
import { makePartialUpdater } from '../utils';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';

type Props = {
    windowBorder: WindowBorder,
    onWindowBorderUpdated: (windowBorder: WindowBorder) => void
}

export default function WindowBorderEditor({ windowBorder, onWindowBorderUpdated }: Props) {
    const updateWindowBorder = makePartialUpdater(windowBorder, onWindowBorderUpdated)

    return (
        <Stack gap={2}>
            <h4>Border</h4>
            <InputGroup>
                <InputGroup.Text>Size</InputGroup.Text>
                <Form.Control type="number"
                    value={windowBorder.size}
                    onChange={(e) => updateWindowBorder({ size: parseInt(e.target.value) })}>
                </Form.Control>
            </InputGroup>

            <Row className='justify-content-between'>
                <Col sm={12} md={4} lg={3}>
                    <InputGroup>
                        <InputGroup.Text>Normal</InputGroup.Text>
                        <Form.Control type="color"
                            value={windowBorder.normalColor}
                            onChange={(e) => updateWindowBorder({ normalColor: e.target.value })}>
                        </Form.Control>
                    </InputGroup>
                </Col>

                <Col sm={12} md={4} lg={3}>
                    <InputGroup>
                        <InputGroup.Text>Focus</InputGroup.Text>
                        <Form.Control type="color"
                            value={windowBorder.focusColor}
                            onChange={(e) => updateWindowBorder({ focusColor: e.target.value } )}>
                        </Form.Control>
                    </InputGroup>
                </Col>

                <Col sm={12} md={4} lg={3}>
                    <InputGroup>
                        <InputGroup.Text>Marked</InputGroup.Text>
                        <Form.Control type="color"
                            value={windowBorder.markedColor}
                            onChange={(e) => updateWindowBorder({ markedColor: e.target.value })}>
                        </Form.Control>
                    </InputGroup>
                </Col>
            </Row>
        </Stack>
    );
}
