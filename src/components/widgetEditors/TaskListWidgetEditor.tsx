import React from 'react'
import { TaskListWidget } from '../../config'
import { makePartialUpdater } from '../../utils'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'

type Props = {
    widget: TaskListWidget
    onWidgetUpdated: (newWidget: TaskListWidget) => void
}

export function TaskListWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <Stack>
            <Form.Group as={Row}>
                <Form.Label column xs={11}>Font size:</Form.Label>
                <Col>
                    <Form.Control type="number"
                        value={widget.fontSize}
                        onChange={(e) => updateWidget({ fontSize: parseInt(e.target.value) })}>
                    </Form.Control>
                </Col>
            </Form.Group>
        </Stack>
    )
}