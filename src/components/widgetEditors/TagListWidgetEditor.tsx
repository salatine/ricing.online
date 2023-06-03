import React from 'react'
import { TagListWidget } from '../../config'
import { makePartialUpdater } from '../../utils'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'

type Props = {
    widget: TagListWidget
    onWidgetUpdated: (newWidget: TagListWidget) => void
}

export function TagListWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <Stack>
            <Form.Group as={Row}>
                <Form.Label column xs='auto'>Color:</Form.Label>
                <Col xs='auto' className='ms-auto'>
                    <Form.Control type="color"
                        value={widget.color}
                        onChange={(e) => updateWidget({ color: e.target.value })}>
                    </Form.Control>
                </Col>
            </Form.Group>
        </Stack>
    )
}