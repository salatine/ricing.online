import React from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
    onExportClicked: () => void
}

export default function ExportConfigFilesButton({ onExportClicked }: Props) {
    return (
        <Button
            onClick={(e) => onExportClicked()}>
            Export configuration
        </Button>
    );
}
