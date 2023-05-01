import React from 'react';

type Props = {
    onExportClicked: () => void
}

export default function ExportConfigFilesButton({ onExportClicked }: Props) {
    return (
        <input type="button"
            value="export config files"
            onClick={(e) => onExportClicked()}>
        </input>
    );
}
