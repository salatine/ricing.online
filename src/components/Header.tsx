import React, { useState, useEffect } from 'react'
import UpdatePreviewButton from './UpdatePreviewButton'
import ExportConfigFilesButton from './ExportConfigFilesButton'
import LockMouseButton from './LockMouseButton'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.scss';

type Props = {
    handleUpdatePreviewClicked: () => void
    handleExportConfigFilesClicked: () => void
    handleLockMouseClicked: () => void
}

export default function Header({handleUpdatePreviewClicked, handleExportConfigFilesClicked, handleLockMouseClicked}: Props) {
    return (
        <Row className={`mt-4 align-items-center ${styles.header}`}>
            <Col xs='auto'>
                <h1 className={styles.logoTitle}>ricing.online</h1>
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

            <Col xs='auto'>
                <ThemeSwitcher/> 
            </Col>
        </Row>
    )
}

type Theme = 'light' | 'dark'

function ThemeSwitcher() {
    const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-bs-theme') as Theme)

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }, [theme])

    return (
        <Stack direction='horizontal'>
            <FontAwesomeIcon icon={faMoon}/>
            <Form.Check
                className='ms-2'
                checked={theme === 'light'}
                type="switch"
                onChange={() => theme === 'light' ? setTheme('dark') : setTheme('light')}>
            </Form.Check>
            <FontAwesomeIcon icon={faSun}/>
        </Stack>
    )
}
