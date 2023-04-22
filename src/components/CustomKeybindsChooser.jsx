import { useState } from 'react';
import ReactHotkeys from "react-hot-keys";

const MOD_KEYS = [
    'Alt',
    'Shift',
    'Lock',
    'Control',
    'Mod4',
];

export default function CustomKeybindsChooser({ customKeybinds, onCustomKeybindsUpdated }) {
    const customKeybindList = customKeybinds.map((keybind, index) => {
        function handleOnEdited(newKeybind) {
            const newCustomKeybinds = [...customKeybinds];
            newCustomKeybinds[index] = newKeybind;
            
            onCustomKeybindsUpdated(newCustomKeybinds);
        }

        function handleOnDeleted() {
            // Remover a keybind com o nosso indice
            const newCustomKeybinds = customKeybinds.filter((_, i) => i != index);

            onCustomKeybindsUpdated(newCustomKeybinds);
        }
        
        return (<CustomKeybind key={index} keybind={keybind} onKeybindEdited={handleOnEdited} onKeybindDeleted={handleOnDeleted}/>)
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
    const [temporaryKeys, setTemporaryKeys] = useState([]);

    function handleKeysOnFocus(e) {
        setIsEditing(true);
        setTemporaryKeys([]);
    }

    function handleKeysOnKeyDown(e) {
        console.log(e);

        const newKey = mapBrowserKeyToAwesomeKey(e.key);
        const newTemporaryKeys = [...temporaryKeys];

        if (!newTemporaryKeys.includes(newKey)) {
            newTemporaryKeys.push(newKey);
        }

        setTemporaryKeys(newTemporaryKeys);
    }

    function handleKeysOnBlur(e) {
        const modKeys = temporaryKeys.filter(isModKey);
        const normalKeys = temporaryKeys.filter((key) => !isModKey(key))
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
        setTemporaryKeys([]);
    } 

    function handleCommandOnChange(e) {
        const newKeybind = {
            ...keybind,
            command: e.target.value,
        }

        onKeybindEdited(newKeybind);
    }

    const keys = !isEditing
        ? [...keybind.modKeys, keybind.normalKey]
        : temporaryKeys;

    return (
        <div>
            <input type="text" value={keys.join('+')} onFocus={handleKeysOnFocus} onKeyDown={handleKeysOnKeyDown} onBlur={handleKeysOnBlur} readOnly></input>
            <input type="text" value={keybind.command} onChange={handleCommandOnChange}></input>
            <button onClick={onKeybindDeleted}>X</button>
        </div>
    )
}

function KeyCombinationChooser({ onKeyCombinationChosen, onCancel }) {
    const [keysPressed, setKeysPressed] = useState([]);
    const keysPressedDescription = keysPressed.join('+');

    function handleKeyDown(keyName, e, handle) {
        const newKeysPressed = [...keysPressed];

        if (!newKeysPressed.includes(e.key)) {
            newKeysPressed.push(e.key);
        }

        setKeysPressed(newKeysPressed);
    }

    function handleConfirmClicked() {
        onKeyCombinationChosen(keysPressed)
    }

    function handleCancelClicked() {
        onCancel()
    }

    return (
        <ReactHotkeys
            keyName="*"
            onKeyDown={handleKeyDown}>
            <h2>teclas capturadas: {keysPressedDescription}</h2>
            <button onClick={handleConfirmClicked}>Confirm</button>
            <button onClick={handleCancelClicked}>Cancel</button>
        </ReactHotkeys>
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