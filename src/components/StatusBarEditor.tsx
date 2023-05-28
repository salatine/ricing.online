import React, { useState } from 'react'
import { StatusBar, StatusBarPosition, StatusBarWidget, IdentifiableStatusBarWidget, StatusBarWidgetGroups } from '../config'
import { makePartialUpdater } from '../utils';
import { createIdentifiableWidget, findWidget } from '../widgets';
import StatusBarPreview from './StatusBarPreview';
import WidgetEditor from './WidgetEditor';
import { DEFAULT_WIDGETS } from '../constants' 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import InputGroup from 'react-bootstrap/InputGroup';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faPlus } from '@fortawesome/free-solid-svg-icons';

type Props = {
    statusBar: StatusBar
    onStatusBarUpdated: (newStatusBar: StatusBar) => void
}

export default function StatusBarEditor({ statusBar, onStatusBarUpdated }: Props) {
    const updateStatusBar = makePartialUpdater(statusBar, onStatusBarUpdated)
    const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

    const selectedWidgetPosition = selectedWidgetId !== null
        ? findWidget(statusBar.widgetGroups, selectedWidgetId)
        : null;

    const selectedWidget = selectedWidgetPosition !== null
        ? statusBar.widgetGroups[selectedWidgetPosition.group][selectedWidgetPosition.index]
        : null;
    
    function onWidgetSelected(widget: IdentifiableStatusBarWidget) {
        setSelectedWidgetId(widget.id)
    }

    function onWidgetUpdated(widget: StatusBarWidget) {
        if (selectedWidgetId === null || selectedWidgetPosition === null) {
            return
        }

        const newWidgetGroups = structuredClone(statusBar.widgetGroups) as StatusBarWidgetGroups
        newWidgetGroups[selectedWidgetPosition.group][selectedWidgetPosition.index] = {
            id: selectedWidgetId,
            ...widget
        }

        updateStatusBar({ widgetGroups: newWidgetGroups })
    }

    function onWidgetDeleted(widget: IdentifiableStatusBarWidget) {
        const widgetPosition = findWidget(statusBar.widgetGroups, widget.id)
        if (widgetPosition === null) {
            return
        }

        const newWidgetGroups = structuredClone(statusBar.widgetGroups)
        newWidgetGroups[widgetPosition.group].splice(widgetPosition.index, 1)
        
        updateStatusBar({ widgetGroups: newWidgetGroups })
    }

    function onWidgetAdded(widgetType: keyof StatusBarWidget) {
        const newWidgetGroups = structuredClone(statusBar.widgetGroups)

        for (const groupName of Object.keys(DEFAULT_WIDGETS)) {
            const group = DEFAULT_WIDGETS[groupName]
            const widget = group.find((w) => w.type === widgetType as string)
            if (widget !== undefined) {
                const identifiableWidget = createIdentifiableWidget(widget) 
                newWidgetGroups[groupName].push(identifiableWidget)
                break
            }
        }

       updateStatusBar({ widgetGroups: newWidgetGroups }) 
    }

    function onWidgetUnselected() {
        setSelectedWidgetId(null)
    }

    function onWidgetGroupsUpdated(newWidgetGroups: StatusBarWidgetGroups) {
        updateStatusBar({ widgetGroups: newWidgetGroups })
    }

    const selectedWidgetEditor = selectedWidget !== null
        ? <WidgetEditor widget={selectedWidget} onWidgetUpdated={onWidgetUpdated}/>
        : <></>

    return (
        <>
            <Editor statusBar={statusBar} updateStatusBar={updateStatusBar}/>

            <StatusBarPreview
                widgetGroups={statusBar.widgetGroups}
                selectedWidget={selectedWidget}
                onWidgetSelected={onWidgetSelected}
                onWidgetUnselected={onWidgetUnselected}
                onWidgetGroupsUpdated={onWidgetGroupsUpdated}
                onWidgetDeleted={onWidgetDeleted}/>
            <WidgetAdder onWidgetAdded={onWidgetAdded} />

            {selectedWidgetEditor}
        </>
    )
}

type WidgetAdderProps = {
    onWidgetAdded: (widgetType: keyof StatusBarWidget) => void
}

function WidgetAdder({onWidgetAdded}: WidgetAdderProps) {
    const widgetTypes = Object.keys(DEFAULT_WIDGETS).map((groupName) => {
        const group = DEFAULT_WIDGETS[groupName]
        return group.map((widget: StatusBarWidget) => widget.type)
    }).flat()

    const plusIcon = <FontAwesomeIcon icon={faPlus} />

    const addWidgetButton = (
        <DropdownButton 
            title={plusIcon}
            onSelect={(key, e) => onWidgetAdded(key as keyof StatusBarWidget)}>
                {widgetTypes.map((widgetType) => 
                <Dropdown.Item
                    eventKey={widgetType}>
                    {widgetType}
                </Dropdown.Item>
            )}
        </DropdownButton>
    )

    return addWidgetButton; 
}

type EditorProps = {
    statusBar: StatusBar
    updateStatusBar: (newFields: Partial<StatusBar>) => void
}


function Editor({ statusBar, updateStatusBar }: EditorProps) {
    return (
        <Stack className='justify-content-between'>
                <Row className='align-items-center'>
                    <InputGroup>
                        <Form.Label column="lg" sm={11}>Position</Form.Label>
                        <Col>
                            <Form.Select
                                size="sm"
                                value={statusBar.position}
                                onChange={(e) => updateStatusBar({position: e.target.value as StatusBarPosition})}>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </Form.Select>
                        </Col>
                    </InputGroup>
                </Row>

                <Row className='align-items-center'>
                    <InputGroup>
                        <Form.Label column="lg" sm={11}>Height</Form.Label>
                        <Col>
                            <Form.Control
                                size="sm"
                                min="3"
                                max="36"
                                type="number"
                                value={statusBar.height}
                                onChange={(e) => updateStatusBar({height: parseInt(e.target.value)})}>
                            </Form.Control>
                        </Col>
                    </InputGroup>
                </Row>

                <Row className='align-items-center'>
                    <InputGroup>
                        <Form.Label column="lg" sm={11}>Width</Form.Label>
                        <Col>
                            <Form.Control
                                size="sm"
                                min="3"
                                max="36"
                                type="number"
                                value={statusBar.borderWidth}
                                onChange={(e) => updateStatusBar({borderWidth: parseInt(e.target.value)})}>
                            </Form.Control>
                        </Col>
                    </InputGroup>
                </Row>

                <Row className='align-items-center'>
                    <InputGroup>
                        <Form.Label column="lg" sm={11}>Color</Form.Label>
                        <Col>
                            <Form.Control
                                size="sm"
                                type="color"
                                onChange={(e) => updateStatusBar({color: e.target.value})}>
                            </Form.Control>
                        </Col>
                    </InputGroup>
                </Row>
        </Stack>
    );
}
