import { useState, useEffect } from 'react';
import { getAvailableFontFamilies } from "../fonts";

export default function FontEditor({ emulator, font, onFontUpdated }) {
    const [availableFontFamilies, setAvailableFontFamilies] = useState([]);
    useEffect(() => {
        async function loadAvailableFontFamilies() {
            setAvailableFontFamilies(await getAvailableFontFamilies(emulator));
        }

        loadAvailableFontFamilies();
    }, []);

    function updateFont(fieldName, value) {
        const newFont = { ...font };
        newFont[fieldName] = value;

        onFontUpdated(newFont);
    }

    const fontFamilyOptions = availableFontFamilies.map(fontFamily => <option value={fontFamily}>{fontFamily}</option>);
    return (
        <>
            <select
                value={font.family}
                onChange={(e) => updateFont('family', e.target.value)}>
                {fontFamilyOptions}
            </select>
            <input
                min="6"
                max="72"
                type="number"
                value={font.size}
                onChange={(e) => updateFont('size', e.target.value)}>
            </input>
        </>
    );
}
