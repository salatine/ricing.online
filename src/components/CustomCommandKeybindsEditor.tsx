import React, { useState } from 'react';
import { CustomCommandKeybind, ModKey, MainModKey } from '../config';
import { getModKeys, MAIN_MOD_OPTIONS } from '../constants';

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
    const [isEditing, setIsEditing] = useState(false);
    const [editingKeys, setEditingKeys] = useState<ModKey[]>([]);

    function handleKeysFocus() {
        setIsEditing(true);
        setEditingKeys([]);
    }

    function handleKeysKeyDown(e: React.KeyboardEvent) {
        const newKey = mapBrowserKeyToAwesomeKey(e.key, mainModKey);
        const newEditingKeys = [...editingKeys];

        if (!newEditingKeys.includes(newKey)) {
            newEditingKeys.push(newKey);
        }

        setEditingKeys(newEditingKeys);
    }

    function handleKeysBlur() {
        const modKeys = editingKeys.filter((key) => isModKey(key, mainModKey));
        const normalKeys = editingKeys.filter((key) => !isModKey(key, mainModKey))
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

type MainModKeyChooserProps = {
    mainModKey: MainModKey
    onMainModKeyUpdated: (mainModKey: MainModKey) => void
}

function MainModKeyChooser({mainModKey, onMainModKeyUpdated}: MainModKeyChooserProps) {
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

function mapBrowserKeyToAwesomeKey(browserKey: string | ModKey, mainModKey: MainModKey): ModKey {
    if (browserKey === 'OS') {
        return mainModKey;
    }

    return browserKey as ModKey;
}

function isModKey(key: ModKey, mainModKey: MainModKey): boolean {
    return getModKeys(mainModKey).includes(key);
}