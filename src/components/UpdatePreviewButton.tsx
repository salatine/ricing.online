import React from 'react';

type Props = {
    onUpdateClicked: () => void
}

export default function UpdatePreviewButton({ onUpdateClicked }: Props) {
    return (
        <input type="button"
            value="teste restart"
            onClick={(e) => onUpdateClicked()}>
        </input>
    );
}
