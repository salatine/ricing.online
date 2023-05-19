import React, { useState } from 'react';
import { CustomCommandKeybind, ModKey, MainModKey } from '../config';
import { getModKeys, MAIN_MOD_OPTIONS } from '../constants';
import KeybindInput from './KeybindInput';

type Props = {
    customCommandKeybinds: CustomCommandKeybind[]
    onCustomCommandKeybindsUpdated: (customCommandKeybinds: CustomCommandKeybind[]) => void
    mainModKey: MainModKey
    onMainModKeyUpdated: (mainModKey: MainModKey) => void
}

export default function CustomCommandKeybindsEditor({ customCommandKeybinds, onCustomCommandKeybindsUpdated, mainModKey, onMainModKeyUpdated }: Props) {
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
        <>
            <div>
                <MainModKeyChooser mainModKey={mainModKey} onMainModKeyUpdated={onMainModKeyUpdated} />
            </div>
            <div>
                <h1>teste keybinds</h1>
                <button onClick={handleNewKeybindClicked}>New keybind</button>
                {customCommandKeybindList}
            </div>
        </>
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

    return (
        <div>
            <KeybindInput 
                keybind={inputKeybind} 
                onKeybindUpdated={handleKeybindInputUpdated} 
                mainModKey={mainModKey} />
            <input 
                type="text" 
                value={keybind.command} 
                onChange={handleCommandChange}>
            </input>
            <button 
                onClick={onKeybindDeleted}>
                X
            </button>
        </div>
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
        <select value={mainModKey} onChange={(e) => onMainModKeyUpdated(e.target.value as MainModKey)}>
            {mainModOptions}
        </select>
    )
}

