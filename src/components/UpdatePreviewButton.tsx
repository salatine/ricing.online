import React from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
    onUpdateClicked: () => void
}

export default function UpdatePreviewButton({ onUpdateClicked }: Props) {
    return (
        <Button
            onClick={(e) => onUpdateClicked()}>
            Update preview
        </Button>
    );
}
