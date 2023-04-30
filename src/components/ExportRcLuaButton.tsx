import React from 'react';

type Props = {
    onExportClicked: () => void
}

export default function ExportRcLuaButton({ onExportClicked }: Props) {
    return (
        <input type="button"
            value="export rc.lua"
            onClick={(e) => onExportClicked()}>
        </input>
    );
}
