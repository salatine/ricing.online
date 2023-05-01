import React, { useState, useEffect } from 'react';
import { FontFamily, getAvailableFontFamilies } from "../fonts";
import { FontOptions } from "../config"
import { makePartialUpdater } from '../utils';

type Props = {
    emulator: any
    font: FontOptions
    onFontUpdated: (font: FontOptions) => void
}

export default function FontEditor({ emulator, font, onFontUpdated }: Props) {
    const [availableFontFamilies, setAvailableFontFamilies] = useState<FontFamily[]>([]);
    useEffect(() => {
        async function loadAvailableFontFamilies(): Promise<void> {
            setAvailableFontFamilies(await getAvailableFontFamilies(emulator));
        }

        loadAvailableFontFamilies();
    }, []);

    const updateFont = makePartialUpdater(font, onFontUpdated)

    const fontFamilyOptions = availableFontFamilies.map(fontFamily => <option value={fontFamily}>{fontFamily}</option>);
    return (
        <>
            <select
                value={font.family}
                onChange={(e) => updateFont({ family: e.target.value })}>
                {fontFamilyOptions}
            </select>
            <input
                min="6"
                max="72"
                type="number"
                value={font.size}
                onChange={(e) => updateFont({ size: parseInt(e.target.value) })}>
            </input>
        </>
    );
}
