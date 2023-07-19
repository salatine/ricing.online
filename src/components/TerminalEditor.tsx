import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';

type Props = {
    terminal: string
    onTerminalSelected: (terminal: string) => void
}

export default function TerminalEditor({ terminal, onTerminalSelected }: Props) {
    return (
        <>
            <Row>
                <InputGroup className="align-items-center">
                    <Form.Label column="lg" lg={11} >Terminal</Form.Label>
                    <Col>
                        <Form.Select
                            size="sm"
                            value={terminal}
                            onChange={(e) => onTerminalSelected(e.target.value)}>
                            <option value="alacritty">Alacritty</option>
                            <option value="gnome-terminal">GNOME Terminal</option>
                            <option value="kitty">kitty</option>
                            <option value="konsole">Konsole</option>
                            <option value="st">st</option>
                            <option value="terminator">Terminator</option>
                            <option value="xterm">xterm</option>
                        </Form.Select>
                    </Col>
                </InputGroup>
            </Row>
        </>
    );
}
