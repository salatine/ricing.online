import React from 'react';
import { WindowBorder } from '../config';
import { makePartialUpdater } from '../utils';

type Props = {
    windowBorder: WindowBorder,
    onWindowBorderUpdated: (windowBorder: WindowBorder) => void
}

export default function WindowBorderEditor({ windowBorder, onWindowBorderUpdated }: Props) {
    const updateWindowBorder = makePartialUpdater(windowBorder, onWindowBorderUpdated)

    return (
        <div>
            <p>
                Border size: 
                <input type="number"
                    value={windowBorder.size}
                    onChange={(e) => updateWindowBorder({ size: parseInt(e.target.value) })}>
                </input>
            </p>

            <p>
                Border normal color:
                <input type="color"
                    value={windowBorder.normalColor}
                    onChange={(e) => updateWindowBorder({ normalColor: e.target.value })}>
                </input>
            </p>

            <p>
                Border focus color:
                <input type="color"
                    value={windowBorder.focusColor}
                    onChange={(e) => updateWindowBorder({ focusColor: e.target.value } )}>
                </input>
            </p>

            <p>
                Border marked color:
                <input type="color"
                    value={windowBorder.markedColor}
                    onChange={(e) => updateWindowBorder({ markedColor: e.target.value })}>
                </input>
            </p>
        </div>
    );
}
