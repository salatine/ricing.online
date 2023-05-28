import React, { useState } from 'react';
import { CustomCommandKeybind, ModKey, MainModKey } from '../config';
import KeybindInput from './KeybindInput';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faKeyboard } from '@fortawesome/free-solid-svg-icons';

type Props = {
    customCommandKeybinds: CustomCommandKeybind[]
    onCustomCommandKeybindsUpdated: (customCommandKeybinds: CustomCommandKeybind[]) => void
    mainModKey: MainModKey
}

export default function CustomCommandKeybindsEditor({ customCommandKeybinds, onCustomCommandKeybindsUpdated, mainModKey}: Props) {
    const customCommandKeybindList = customCommandKeybinds.map((keybind, index) => {
        function handleKeybindEdited(newKeybind: CustomCommandKeybind) {
            const newCustomKeybinds = [...customCommandKeybinds];
            newCustomKeybinds[index] = newKeybind;
            
            onCustomCommandKeybindsUpdated(newCustomKeybinds);
        }

        function handleKeybindDeleted() {
            // Remover a keybind com o nosso indice
            const newCustomKeybinds = customCommandKeybinds.filter((_, i) => i != index);

            onCustomCommandKeybindsUpdated(newCustomKeybinds);
        }
        
        return (<CustomCommandKeybindEditor key={index} keybind={keybind} onKeybindUpdated={handleKeybindEdited} onKeybindDeleted={handleKeybindDeleted} mainModKey={mainModKey}/>)
    })

    function handleNewKeybindClicked() {
        const newKeybind = {
            modKeys: [],
            normalKey: '',
            command: '',
        }
        const newCustomCommandKeybinds = [...customCommandKeybinds, newKeybind];

        onCustomCommandKeybindsUpdated(newCustomCommandKeybinds);
    }

    return (
        <div>
            <Row>
                <Col xs='auto'>
                    <h2>Custom commands</h2>
                </Col>
                <Col xs='auto' className='ms-auto'>
                    <Button onClick={handleNewKeybindClicked}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>
                </Col>
            </Row>

            {customCommandKeybindList}
        </div>
    )
}

type CustomCommandKeybindProps = {
    keybind: CustomCommandKeybind
    onKeybindUpdated: (keybind: CustomCommandKeybind) => void
    onKeybindDeleted: () => void
    mainModKey: MainModKey
}

function CustomCommandKeybindEditor({ keybind, onKeybindUpdated, onKeybindDeleted, mainModKey }: CustomCommandKeybindProps) {
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
    const KeybindInputComponents = KeybindInput(
        {
            keybind: inputKeybind, 
            onKeybindUpdated: handleKeybindInputUpdated, 
            mainModKey: mainModKey
        }
    );

    return (
        <Row>
            <Col xs={8}>
                <Form.Control 
                    type="text" 
                    value={keybind.command} 
                    onChange={handleCommandChange}>
                </Form.Control>
            </Col>

            <Col xs='auto' className='flex-grow-1'>
                <InputGroup>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={faKeyboard} />
                    </InputGroup.Text>
                    {KeybindInputComponents.input}
                    <Button
                        onClick={onKeybindDeleted}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    {KeybindInputComponents.feedback}
                </InputGroup>
            </Col>
        </Row>
    )
}
