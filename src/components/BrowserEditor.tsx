import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';

type Props = {
    browser: string,
    onBrowserSelected: (browser: string) => void
}

export default function BrowserEditor({ browser, onBrowserSelected }: Props) {
    return (
        <>
            <Row>
                <InputGroup className="align-items-center">
                    <Form.Label column="lg" lg={11} >Browser</Form.Label>
                    <Col>
                        <Form.Select
                            size="sm"
                            value={browser}
                            onChange={(e) => onBrowserSelected(e.target.value)}>
                            <option value="brave">Brave</option>
                            <option value="chromium">Chromium</option>
                            <option value="epiphany">Epiphany</option>
                            <option value="firefox">Firefox</option>
                            <option value="google-chrome">Google Chrome</option>
                            <option value="opera">Opera</option>
                        </Form.Select>
                    </Col>
                </InputGroup>
            </Row>
        </>
    );
}