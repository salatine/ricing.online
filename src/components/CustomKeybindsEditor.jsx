import { useState } from 'react';
import { MOD_KEYS } from '../constants';

export default function CustomKeybindsEditor({ customKeybinds, onCustomKeybindsUpdated }) {
    const customKeybindList = customKeybinds.map((keybind, index) => {
        function handleKeybindEdited(newKeybind) {
            const newCustomKeybinds = [...customKeybinds];
            newCustomKeybinds[index] = newKeybind;
            
            onCustomKeybindsUpdated(newCustomKeybinds);
        }

        function handleKeybindDeleted() {
            // Remover a keybind com o nosso indice
            const newCustomKeybinds = customKeybinds.filter((_, i) => i != index);

            onCustomKeybindsUpdated(newCustomKeybinds);
        }
        
        return (<CustomKeybind key={index} keybind={keybind} onKeybindUpdated={handleKeybindEdited} onKeybindDeleted={handleKeybindDeleted}/>)
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

function CustomKeybind({ keybind, onKeybindEdited, onKeybindDeleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingKeys, setEditingKeys] = useState([]);

    function handleKeysFocus(e) {
        setIsEditing(true);
        setEditingKeys([]);
    }

    function handleKeysKeyDown(e) {
        const newKey = mapBrowserKeyToAwesomeKey(e.key);
        const newEditingKeys = [...editingKeys];

        if (!newEditingKeys.includes(newKey)) {
            newEditingKeys.push(newKey);
        }

        setEditingKeys(newEditingKeys);
    }

    function handleKeysBlur(e) {
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

            onKeybindEdited(newKeybind);
        }

        setIsEditing(false);
        setEditingKeys([]);
    } 

    function handleCommandChange(e) {
        const newKeybind = {
            ...keybind,
            command: e.target.value,
        }

        onKeybindEdited(newKeybind);
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

function mapBrowserKeyToAwesomeKey(browserKey) {
    if (browserKey === 'OS') {
        return 'Mod4';
    }

    return browserKey;
}

function isModKey(key) {
    return MOD_KEYS.includes(key);
}