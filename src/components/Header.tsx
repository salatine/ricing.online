import React from 'react'
import UpdatePreviewButton from './UpdatePreviewButton'
import ExportConfigFilesButton from './ExportConfigFilesButton'
import LockMouseButton from './LockMouseButton'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import * as classes from './Header.module.scss';

type Props = {
    handleUpdatePreviewClicked: () => void
    handleExportConfigFilesClicked: () => void
    handleLockMouseClicked: () => void
}

export default function Header({handleUpdatePreviewClicked, handleExportConfigFilesClicked, handleLockMouseClicked}: Props) {
    return (
        <Row className="mt-4 align-items-center">
            <Col xs='auto'>
                <h1 className={classes.logoTitle}>ricing.online</h1>
            </Col>
                
            <Col xs='auto' className='ms-auto'>
                <UpdatePreviewButton 
                    onUpdateClicked={handleUpdatePreviewClicked}/>
            </Col>

            <Col xs='auto'>
                <ExportConfigFilesButton
                    onExportClicked={handleExportConfigFilesClicked}/>
            </Col>

            <Col xs='auto'>
                <LockMouseButton 
                    onLockClicked={handleLockMouseClicked}/> 
            </Col>
        </Row>
    )
}
