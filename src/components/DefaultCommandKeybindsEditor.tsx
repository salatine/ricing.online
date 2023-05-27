import React, { useState } from 'react'
import { DefaultCommandKeybind, MainModKey, ModKey } from '../config'
import { DEFAULT_COMMANDS } from '../constants'
import KeybindInput from './KeybindInput'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';

type DefaultCommandKeybindsEditorProps = {
    defaultCommandKeybinds: DefaultCommandKeybind[]
    onDefaultCommandKeybindsUpdated: (newDefaultCommandKeybinds: DefaultCommandKeybind[]) => void
    mainModKey: MainModKey
}

export default function DefaultCommandKeybindsEditor({ defaultCommandKeybinds, onDefaultCommandKeybindsUpdated, mainModKey }: DefaultCommandKeybindsEditorProps) {
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
            <div>
                {addCommandButton}
            </div>
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

function DefaultCommandKeybindEditor({ keybind, onKeybindUpdated, onKeybindDeleted, mainModKey }: DefaultCommandKeybindEditorProps) {
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

    return (
        <Form.Group as={Row} className='g-1'>
            <Form.Label column xs={4}>{keybind.command.name}</Form.Label>

            <Col>
                <InputGroup>
                    <KeybindInput 
                        keybind={inputKeybind} 
                        onKeybindUpdated={handleKeybindInputUpdated} 
                        mainModKey={mainModKey} />
                    <Button
                        onClick={onKeybindDeleted}>
                        X
                    </Button>
                </InputGroup>
            </Col>
        </Form.Group>
    )
}
