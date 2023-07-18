import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';

type Props = {
    fileManager: string,
    onFileManagerSelected: (fileManager: string) => void
}

export default function FileManagerEditor({ fileManager, onFileManagerSelected }: Props) {
    return (
        <>
            <Row>
                <InputGroup className="align-items-center">
                    <Form.Label column="lg" lg={11} >File manager</Form.Label>
                    <Col>
                        <Form.Select
                            size="sm"
                            value={fileManager}
                            onChange={(e) => onFileManagerSelected(e.target.value)}>
                            <option value="dolphin">Dolphin</option>
                            <option value="nemo">Nemo</option>
                            <option value="nnn">nnn</option>
                            <option value="pcmanfm">pcmanfm</option>
                            <option value="thunar">Thunar</option>
                            <option value="xfe">xfe</option>
                        </Form.Select>
                    </Col>
                </InputGroup>
            </Row>
        </>
    );
}