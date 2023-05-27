import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
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
                <InputGroup>
                    <Form.Label column="lg" lg={11} >Terminal</Form.Label>
                    <Col>
                    <Form.Select
                        size="sm"
                        value={terminal}
                        onChange={(e) => onTerminalSelected(e.target.value)}>
                        <option value="kitty">kitty</option>
                        <option value="alacritty">Alacritty</option>
                        <option value="terminator">Terminator</option>
                        <option value="gnome-terminal">GNOME Terminal</option>
                        <option value="konsole">Konsole</option>
                        <option value="xterm">xterm</option>
                        <option value="st">st</option>
                    </Form.Select>
                    </Col>
                </InputGroup>
            </Row>
        </>
    );
}
