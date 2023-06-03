import React from 'react'
import { StatusBarWidget } from '../../config'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

type Props = {
    widget: StatusBarWidget
}

export function NoOptionsWidgetEditor({widget}: Props) {
    return (
        <Stack gap={2}>
            <Row className='justify-content-center'>
                <FontAwesomeIcon size='xl' icon={faExclamationTriangle}/>
            </Row>

            <Row className='justify-content-center'>
                <Col xs='auto'>
                    <h4 className='fw-light'>
                        no options available for the <span className='font-monospace'>{widget.type}</span> widget
                    </h4>
                </Col>
            </Row>
        </Stack>
    )
}