import React, { useState } from 'react'
import { DefaultCommandKeybind, MainModKey, ModKey } from '../config'
import { getModKeys, MAIN_MOD_OPTIONS } from '../constants';
import { DEFAULT_COMMANDS } from '../constants'
import KeybindInput from './KeybindInput'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faKeyboard } from '@fortawesome/free-solid-svg-icons';

type DefaultCommandKeybindsEditorProps = {
    defaultCommandKeybinds: DefaultCommandKeybind[]
    onDefaultCommandKeybindsUpdated: (newDefaultCommandKeybinds: DefaultCommandKeybind[]) => void
    mainModKey: MainModKey
    onMainModKeyUpdated: (newMainModKey: MainModKey) => void
}

export default function DefaultCommandKeybindsEditor({ defaultCommandKeybinds, onDefaultCommandKeybindsUpdated, mainModKey, onMainModKeyUpdated }: DefaultCommandKeybindsEditorProps) {
    const commandOptions = Object.values(DEFAULT_COMMANDS).map(command => {
        return (
            <Dropdown.Item
                title={command.description} 
                eventKey={command.id}>{command.name}
            </Dropdown.Item>
        )    
    })

    const addCommandButton = (
        <DropdownButton
            title="+"
            onSelect={(key, e) => handleCommandChange(key as keyof typeof DEFAULT_COMMANDS)}>
            {commandOptions}
        </DropdownButton>
    )

    function handleCommandChange(id: keyof typeof DEFAULT_COMMANDS) {
        const newDefaultCommandKeybinds = [...defaultCommandKeybinds]
        const newCommand = DEFAULT_COMMANDS[id]
        const newKeybind = {
            command: newCommand,
            modKeys: [],
            normalKey: "",
        }
        newDefaultCommandKeybinds.push(newKeybind)

        onDefaultCommandKeybindsUpdated(newDefaultCommandKeybinds)
    }

    const keybindsList = defaultCommandKeybinds.map((keybind, index) => {
        function handleKeybindUpdated(newKeybind: DefaultCommandKeybind) {
            const newDefaultCommandKeybinds = [...defaultCommandKeybinds]
            newDefaultCommandKeybinds[index] = newKeybind

            onDefaultCommandKeybindsUpdated(newDefaultCommandKeybinds)
        }

        function handleKeybindDeleted() {
            // Remover a keybind com o nosso indice
            const newDefaultCommandKeybinds = defaultCommandKeybinds.filter((_, i) => i != index);

            onDefaultCommandKeybindsUpdated(newDefaultCommandKeybinds);
        }

        return (
            <DefaultCommandKeybindEditor 
                keybind={keybind}
                onKeybindUpdated={handleKeybindUpdated}
                onKeybindDeleted={handleKeybindDeleted}
                mainModKey={mainModKey} />
        )
    })

    return (
        <>
            <Row className="align-items-center">
                <Col xs='auto'>
                    <h2>Default commands</h2>
                </Col>

                <Col xs='auto' className='ms-auto'>
                    <MainModKeyChooser mainModKey={mainModKey} onMainModKeyUpdated={onMainModKeyUpdated}></MainModKeyChooser>
                </Col>

                <Col xs='auto'>
                    {addCommandButton}
                </Col>
            </Row>
            <Form>
                {keybindsList}
            </Form>
        </>
    )
}

type DefaultCommandKeybindEditorProps = {
    keybind: DefaultCommandKeybind
    onKeybindUpdated: (newKeybind: DefaultCommandKeybind) => void
    onKeybindDeleted: () => void
    mainModKey: MainModKey
}

function DefaultCommandKeybindEditor({ keybind, onKeybindUpdated, onKeybindDeleted, mainModKey}: DefaultCommandKeybindEditorProps) {
    function handleCommandChange(e) {
        const newKeybind = {
            ...keybind,
            command: e.target.value,
        }

        onKeybindUpdated(newKeybind);
    }

    const inputKeybind = {
        modKeys: keybind.modKeys as ModKey[],
        normalKey: keybind.normalKey,
    }

    function handleKeybindInputUpdated(inputKeybind) {
        const newKeybind = {
            ...keybind,
            modKeys: inputKeybind.modKeys,
            normalKey: inputKeybind.normalKey,
        }

        onKeybindUpdated(newKeybind);
    }

    const { input, feedback } = KeybindInput({
        keybind: inputKeybind,
        onKeybindUpdated: handleKeybindInputUpdated,
        mainModKey,
    })

    return (
        <Form.Group as={Row} className='mt-2'>
            <Form.Label column xs={4}>{keybind.command.name}</Form.Label>

            <Col xs='auto' className='flex-grow-1'>
                <InputGroup hasValidation>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={faKeyboard} />
                    </InputGroup.Text>
                    {input}
                    <Button
                        onClick={onKeybindDeleted}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    {feedback}
                </InputGroup>
            </Col>
        </Form.Group>
    )
}

type MainModKeyChooserProps = {
    mainModKey: MainModKey
    onMainModKeyUpdated: (mainModKey: MainModKey) => void
}

function MainModKeyChooser({ mainModKey, onMainModKeyUpdated }: MainModKeyChooserProps) {
    const mainModOptions = MAIN_MOD_OPTIONS.map((modKey) => {
        return (
            <option value={modKey}>{modKey}</option>
        )
    })

    return (
        <FloatingLabel label="Mod key">
            <Form.Select value={mainModKey} onChange={(e) => onMainModKeyUpdated(e.target.value as MainModKey)}>
                {mainModOptions}
            </Form.Select>
        </FloatingLabel>
    )
}

