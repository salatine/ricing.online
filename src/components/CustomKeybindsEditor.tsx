import React, { useState } from 'react';
import { CustomKeybind } from '../config';
import { MOD_KEYS } from '../constants';

type Props = {
    customKeybinds: CustomKeybind[]
    onCustomKeybindsUpdated: (customKeybinds: CustomKeybind[]) => void
}

export default function CustomKeybindsEditor({ customKeybinds, onCustomKeybindsUpdated }: Props) {
    const customKeybindList = customKeybinds.map((keybind, index) => {
        function handleKeybindEdited(newKeybind: CustomKeybind) {
            const newCustomKeybinds = [...customKeybinds];
            newCustomKeybinds[index] = newKeybind;
            
            onCustomKeybindsUpdated(newCustomKeybinds);
        }

        function handleKeybindDeleted() {
            // Remover a keybind com o nosso indice
            const newCustomKeybinds = customKeybinds.filter((_, i) => i != index);

            onCustomKeybindsUpdated(newCustomKeybinds);
        }
        
        return (<CustomKeybindEditor key={index} keybind={keybind} onKeybindUpdated={handleKeybindEdited} onKeybindDeleted={handleKeybindDeleted}/>)
    })

    function handleNewKeybindClicked() {
        const newKeybind = {
            modKeys: [],
            normalKey: '',
            command: '',
        }
        const newCustomKeybinds = [...customKeybinds, newKeybind];

        onCustomKeybindsUpdated(newCustomKeybinds);
    }

    return (
        <div>
            <h1>teste keybinds</h1>
            <button onClick={handleNewKeybindClicked}>New keybind</button>
            {customKeybindList}
        </div>
    )
}

type CustomKeybindProps = {
    keybind: CustomKeybind
    onKeybindUpdated: (keybind: CustomKeybind) => void
    onKeybindDeleted: () => void
}

function CustomKeybindEditor({ keybind, onKeybindUpdated, onKeybindDeleted }: CustomKeybindProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingKeys, setEditingKeys] = useState<string[]>([]);

    function handleKeysFocus() {
        setIsEditing(true);
        setEditingKeys([]);
    }

    function handleKeysKeyDown(e: React.KeyboardEvent) {
        const newKey = mapBrowserKeyToAwesomeKey(e.key);
        const newEditingKeys = [...editingKeys];

        if (!newEditingKeys.includes(newKey)) {
            newEditingKeys.push(newKey);
        }

        setEditingKeys(newEditingKeys);
    }

    function handleKeysBlur() {
        const modKeys = editingKeys.filter(isModKey);
        const normalKeys = editingKeys.filter((key) => !isModKey(key))
            .map((key) => key.toLowerCase());

        if (normalKeys.length != 1) {
            // FIXME crime
            alert('Exactly one non-modifier key is needed');
        } else {
            const normalKey = normalKeys[0];
            const newKeybind = {
                ...keybind,
                modKeys,
                normalKey,
            }

            onKeybindUpdated(newKeybind);
        }

        setIsEditing(false);
        setEditingKeys([]);
    } 

    function handleCommandChange(e) {
        const newKeybind = {
            ...keybind,
            command: e.target.value,
        }

        onKeybindUpdated(newKeybind);
    }

    const keys = isEditing
        ? editingKeys
        : [...keybind.modKeys, keybind.normalKey];

    return (
        <div>
            <input type="text" value={keys.join('+')} onFocus={handleKeysFocus} onKeyDown={handleKeysKeyDown} onBlur={handleKeysBlur} readOnly></input>
            <input type="text" value={keybind.command} onChange={handleCommandChange}></input>
            <button onClick={onKeybindDeleted}>X</button>
        </div>
    )
}

function mapBrowserKeyToAwesomeKey(browserKey: string): string {
    if (browserKey === 'OS') {
        return 'Mod4';
    }

    return browserKey;
}

function isModKey(key: string): boolean {
    return MOD_KEYS.includes(key);
}