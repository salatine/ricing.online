import React from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
    onLockClicked: () => void
}

export default function LockMouseButton({ onLockClicked }: Props) {
    return (
        <Button 
            onClick={(e) => onLockClicked()}>
            Lock mouse
        </Button>
    );
}
