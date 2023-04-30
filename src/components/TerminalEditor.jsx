export default function TerminalEditor({ terminal, onTerminalSelected }) {
    return (
        <select
            value={terminal}
            onChange={(e) => onTerminalSelected(e.target.value)}>
            <option value="kitty">kitty</option>
            <option value="alacritty">Alacritty</option>
            <option value="terminator">Terminator</option>
            <option value="gnome-terminal">GNOME Terminal</option>
            <option value="konsole">Konsole</option>
            <option value="xterm">xterm</option>
            <option value="st">st</option>
        </select>
    );
}
