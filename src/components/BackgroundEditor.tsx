import React from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack'; 

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
        <Stack>
            <h2>Background</h2>

            <Form.Control 
                type="file"
                name="file"
                onChange={handleFileChanged}>
            </Form.Control>
        </Stack>
    );
}
