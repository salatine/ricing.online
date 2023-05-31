import React from 'react'
import { LauncherWidget } from '../../config'
import { makePartialUpdater } from '../../utils'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'

type Props = {
    widget: LauncherWidget
    onWidgetUpdated: (newWidget: LauncherWidget) => void
}

export function LauncherWidgetEditor({ widget, onWidgetUpdated }: Props) {
    const updateWidget = makePartialUpdater(widget, onWidgetUpdated)

    return (
        <Stack>
            <Form.Group as={Row}>
                <Form.Label column xs={8}>Command:</Form.Label>
                <Col xs={4}>
                    <Form.Control type="text"
                        value={widget.command}
                        onChange={(e) => updateWidget({ command: e.target.value })}>
                    </Form.Control>
                </Col>
            </Form.Group>
        </Stack>
    )
}