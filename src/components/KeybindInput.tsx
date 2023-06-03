import React, { useState } from 'react'
import { ModKey, MainModKey, } from '../config'
import { getModKeys } from '../constants'
import Form from 'react-bootstrap/Form'
import assertNever from 'assert-never'

export type Keybind = {
    modKeys: ModKey[],
    normalKey: string,
}

type Props = {
    keybind: Keybind,
    mainModKey: MainModKey,
    onKeybindUpdated: (newKeybind: Keybind) => void
}

type ReturnedComponents = {
    input: JSX.Element
    feedback: JSX.Element
}

enum InvalidKeybindReason {
    EMPTY,
    NOT_EXACTLY_ONE_NON_NORMAL_KEY,
}

export default function KeybindInput({ keybind, mainModKey, onKeybindUpdated }: Props): ReturnedComponents {
    const [isEditing, setIsEditing] = useState(false);
    const [editingKeys, setEditingKeys] = useState<(string | ModKey)[]>([]);

    const editingModKeys = editingKeys.filter((key) => isModKey(key)) as ModKey[];
    const editingNormalKeys = editingKeys.filter((key) => !isModKey(key))
            .map((key) => key.toLowerCase());

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

    function getInvalidKeybindReason(): InvalidKeybindReason | null {
        if (!isEditing) {
            return null;
        }

        if (editingKeys.length === 0) {
            return InvalidKeybindReason.EMPTY;
        }

        if (editingNormalKeys.length !== 1) {
            return InvalidKeybindReason.NOT_EXACTLY_ONE_NON_NORMAL_KEY;
        }

        return null;
    }

    function isKeybindInvalid() {
        return getInvalidKeybindReason() !== null;
    }

    function formatInvalidKeybindReason(): JSX.Element {
        const reason = getInvalidKeybindReason()
        if (reason === null) {
            return <></>
        }

        switch (reason) {
        case InvalidKeybindReason.EMPTY:
            return <>Keybind cannot be empty.</>;

        case InvalidKeybindReason.NOT_EXACTLY_ONE_NON_NORMAL_KEY:
            return <>There must be <b>exactly</b> one non-modifier key.</>;
        
        default:
            return assertNever(reason);
        }
    }

    function handleKeysBlur() {
        if (!isKeybindInvalid()) {
            const normalKey = editingNormalKeys[0];
            const newKeybind = {
                ...keybind,
                modKeys: editingModKeys,
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

    return {
        input: <Form.Control
                type="text"
                value={displayedKeys.join('+')}
                onFocus={handleKeysFocus}
                onKeyDown={handleKeysKeyDown}
                onBlur={handleKeysBlur}
                readOnly
                isInvalid={isKeybindInvalid()}/>,
        feedback: <Form.Control.Feedback type="invalid">
            {formatInvalidKeybindReason()}
        </Form.Control.Feedback>
    }
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