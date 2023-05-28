import React, { useState, useEffect } from 'react';
import { FontFamily, getAvailableFontFamilies } from "../fonts";
import { FontOptions } from "../config"
import { makePartialUpdater } from '../utils';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { InputGroup } from 'react-bootstrap';

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

            <Stack direction='horizontal' gap={2}> 
                <InputGroup>
                    <InputGroup.Text>Family</InputGroup.Text>
                    <Form.Select
                        value={font.family}
                        onChange={(e) => updateFont({ family: e.target.value })}>
                        {fontFamilyOptions}
                    </Form.Select>
                </InputGroup>

                <InputGroup>
                    <InputGroup.Text>Size</InputGroup.Text>
                    <Form.Control
                        min="6"
                        max="72"
                        type="number"
                        value={font.size}
                        onChange={(e) => updateFont({ size: parseInt(e.target.value) })}>
                    </Form.Control>
                </InputGroup>
            </Stack>
        </Stack>
    );
}
