import React from "react";
import { Options } from "../../config";
import TerminalEditor from "../TerminalEditor";
import { makePartialUpdater } from "../../utils";
import Container from "react-bootstrap/Container";
import Fade from "react-bootstrap/Fade";

type Props = {
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}

export default function DefaultApplicationsTab({ options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    return (
        <Fade in={true} appear={true}>
            <Container>
                <TerminalEditor terminal={options.terminal} onTerminalSelected={(terminal) => updateOptions({ terminal })} /> 
            </Container>
        </Fade>
    )
}