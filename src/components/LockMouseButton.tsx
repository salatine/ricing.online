import React from 'react';

type Props = {
    onLockClicked: () => void
}

export default function LockMouseButton({ onLockClicked }: Props) {
    return (
        <input type="button"
            value="lock mouse"
            onClick={(e) => onLockClicked()}>
        </input>
    );
}
