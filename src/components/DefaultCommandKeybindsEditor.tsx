import React, { useState } from 'react'
import { DefaultCommandKeybind, MainModKey, ModKey } from '../config'
import { DEFAULT_COMMANDS } from '../constants'
import KeybindInput from './KeybindInput'

type DefaultCommandKeybindsEditorProps = {
    defaultCommandKeybinds: DefaultCommandKeybind[]
    onDefaultCommandKeybindsUpdated: (newDefaultCommandKeybinds: DefaultCommandKeybind[]) => void
    mainModKey: MainModKey
}

export default function DefaultCommandKeybindsEditor({ defaultCommandKeybinds, onDefaultCommandKeybindsUpdated, mainModKey }: DefaultCommandKeybindsEditorProps) {
    const [isSelectedCommand, setIsSelectedCommand] = useState(false)

    const addCommandButton = (
        <button 
            onClick={(e) => setIsSelectedCommand(true)}>
            +
        </button>
    )
    
    const commandOptions = Object.values(DEFAULT_COMMANDS).map(command => {
        return (
            <option 
                title={command.description} 
                value={command.id}>{command.name}
            </option>
        )    
    })

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

    const commandChooser = (
        <select 
            onChange={(e) => {
                handleCommandChange(e.target.value as keyof typeof DEFAULT_COMMANDS)
                setIsSelectedCommand(false)
                }}>
            {commandOptions}
        </select>
    )

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
                {isSelectedCommand ? commandChooser : addCommandButton}
            </div>
            <div>
                {keybindsList}
            </div>
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
        <div>
            <label>{keybind.command.name}</label>
            <KeybindInput 
                keybind={inputKeybind} 
                onKeybindUpdated={handleKeybindInputUpdated} 
                mainModKey={mainModKey} />
            <button 
                onClick={onKeybindDeleted}>
                X
            </button>
        </div>
    )
}
