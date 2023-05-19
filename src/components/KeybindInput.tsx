import React, { useState } from 'react'
import { ModKey, MainModKey, } from '../config'
import { getModKeys } from '../constants'

export type Keybind = {
    modKeys: ModKey[],
    normalKey: string,
}

type Props = {
    keybind: Keybind,
    mainModKey: MainModKey,
    onKeybindUpdated: (newKeybind: Keybind) => void
}

export default function KeybindInput({ keybind, mainModKey, onKeybindUpdated }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingKeys, setEditingKeys] = useState<(string | ModKey)[]>([]);

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
        const modKeys = editingKeys.filter((key) => isModKey(key)) as ModKey[];
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

    const keys = isEditing
        ? editingKeys
        : [...keybind.modKeys, keybind.normalKey];
    
    const displayedKeys = keys.map((key) => {
        if (key === 'MainModKey') {
            return 'MainMod';
        }

        return key
    })

    return (<input type="text" value={displayedKeys.join('+')} onFocus={handleKeysFocus} onKeyDown={handleKeysKeyDown} onBlur={handleKeysBlur} readOnly></input>)
}

function mapBrowserKeyToAwesomeKey(browserKey: string | ModKey): string | ModKey {
    if (browserKey === 'OS') {
        return 'MainModKey';
    }

    return browserKey;
}

function isModKey(key: string | ModKey): boolean {
    return (getModKeys() as string[]).includes(key);
}