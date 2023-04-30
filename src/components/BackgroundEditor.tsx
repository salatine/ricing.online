import React from 'react';

type Props = {
    onBackgroundSelected: (file: File) => void
}

export default function BackgroundEditor({ onBackgroundSelected }) {
    function handleFileChanged(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) {
            return
        }

        onBackgroundSelected(e.target.files[0])
    }

    return (
        <input type="file"
            name="file"
            onChange={handleFileChanged}>
        </input>
    );
}
