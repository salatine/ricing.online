import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:../rc.lua.hbs";
import { readStringIntoUint8Array } from "./utils";
import { AWESOME_CONFIG } from "./constants";

export type Color = string

export type CustomKeybindOptions = {
    modKeys: string[],
    normalKey: string,
    command: string,
}

export type AutostartApplicationOptions = {
    commandLine: string,
}

export type WindowBorderOptions = {
    size: number,
    normalColor: Color,
    focusColor:  Color,
    markedColor: Color,
}

export type FontOptions = {
    family: string,
    size: number,
}

export type Options = {
    autostartApplications: AutostartApplicationOptions[],
    customKeybinds: CustomKeybindOptions[],
    terminal: string,
    windowBorder: WindowBorderOptions,
    font: FontOptions,
}

export function getConfig(options: Options): string {
    const renderTemplate = Handlebars.compile(RcLuaTemplate);
    const templateContext = {
        ...options,
        AWESOME_CONFIG,
    }

    return renderTemplate(templateContext)
}

export async function applyConfig(emulator: any, options: Options): Promise<void> {
    const config = readStringIntoUint8Array(getConfig(options))

    await emulator.create_file(AWESOME_CONFIG + "/rc.lua", config);
}
