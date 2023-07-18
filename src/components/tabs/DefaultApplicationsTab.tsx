import React from "react";
import { Options } from "../../config";
import TerminalEditor from "../TerminalEditor";
import { makePartialUpdater } from "../../utils";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Fade from "react-bootstrap/Fade";
import BrowserEditor from "../BrowserEditor";
import FileManagerEditor from "../FileManagerEditor";

type Props = {
    options: Options
    onOptionsUpdated: (newOptions: Options) => void
}

export default function DefaultApplicationsTab({ options, onOptionsUpdated }: Props) {
    const updateOptions = makePartialUpdater(options, onOptionsUpdated)

    return (
        <Fade in={true} appear={true}>
            <Container>
                <Col>
                    <Row>
                        <TerminalEditor terminal={options.terminal} onTerminalSelected={(terminal) => updateOptions({ terminal })} /> 
                    </Row>

                    <Row>
                        <BrowserEditor browser={options.browser} onBrowserSelected={(browser) => updateOptions({ browser })} />
                    </Row>

                    <Row>
                        <FileManagerEditor fileManager={options.fileManager} onFileManagerSelected={(fileManager) => updateOptions({ fileManager })}/>
                    </Row>
                </Col>
            </Container>
        </Fade>
    )
}