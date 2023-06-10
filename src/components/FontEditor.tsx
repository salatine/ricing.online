import React, { useState, useEffect } from 'react';
import { FontFamily, getAvailableFontFamilies } from "../fonts";
import { FontOptions } from "../config"
import { makePartialUpdater } from '../utils';
import Form from 'react-bootstrap/Form';
import { Stack } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faTextHeight, faDroplet } from '@fortawesome/free-solid-svg-icons';

type Props = {
    emulator: any
    font: FontOptions
    onFontUpdated: (font: FontOptions) => void
}

export default function FontEditor({ emulator, font, onFontUpdated }: Props) {
    const [availableFontFamilies, setAvailableFontFamilies] = useState<FontFamily[]>([]);
    useEffect(() => {
        async function loadAvailableFontFamilies(): Promise<void> {
            setAvailableFontFamilies(await getAvailableFontFamilies(emulator));
        }

        loadAvailableFontFamilies();
    }, []);

    const updateFont = makePartialUpdater(font, onFontUpdated)

    const fontFamilyOptions = availableFontFamilies.map(fontFamily => <option value={fontFamily}>{fontFamily}</option>);
    return (
        <Stack gap={2}>
            <h2>Font</h2>

                <Row className="justify-content-between">
                    <Col xs={5}>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faFont}/>
                            </InputGroup.Text>

                            <Form.Select
                                value={font.family}
                                onChange={(e) => updateFont({ family: e.target.value })}>
                                {fontFamilyOptions}
                            </Form.Select>
                        </InputGroup>
                    </Col>

                    <Col xs={4}>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faDroplet}/>
                            </InputGroup.Text>
                            <Form.Control
                                type="color"
                                value={font.color}
                                onChange={(e) => updateFont({ color: e.target.value })}>
                            </Form.Control>
                        </InputGroup>
                    </Col>

                    <Col xs={3}>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faTextHeight}/>
                            </InputGroup.Text>
                            <Form.Control
                                type="number"
                                value={font.size}
                                onChange={(e) => updateFont({ size: parseInt(e.target.value) })}>
                            </Form.Control>
                        </InputGroup>
                    </Col>
                </Row> 
        </Stack>
    );
}
