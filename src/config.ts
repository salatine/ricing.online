import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:../rc.lua.hbs";
import ThemeLuaTemplate from "bundle-text:../theme.lua.hbs";
import { readBlobIntoUint8Array, readStringIntoUint8Array, makeBlobFromString } from "./utils";
import { AWESOME_CONFIG } from "./constants";
import { saveAs } from "file-saver";
import JSZip from "jszip";

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

export type ConfigFile = {
    path: string
    contents: Blob
}

export function getConfigFiles(options: Options): ConfigFile[] {
    const configTextFiles: Record<string, string> = {
        ".config/awesome/rc.lua": render(options, RcLuaTemplate),
        ".config/awesome/theme.lua": render(options, ThemeLuaTemplate),
    }

    const configFiles: ConfigFile[] = Object.entries(configTextFiles)
        .map(([path, textContents]) => {
            return { path, contents: makeBlobFromString(textContents) }
        })

    return configFiles
}

export async function applyConfigFiles(emulator: any, configFiles: ConfigFile[]): Promise<void> {
    const emulatorHome = '/root/'; 
    const promises = configFiles.map(async ({ path, contents }) => {
        await emulator.create_file(emulatorHome + path, readBlobIntoUint8Array(contents))
    })

    await Promise.allSettled(promises)
}

export async function exportConfigFiles(configFiles: ConfigFile[]): Promise<void> {
    const rice = await zipConfigFiles(configFiles) 
    saveAs(rice, "rice.zip")
}

async function zipConfigFiles(configFiles: ConfigFile[]): Promise<Blob> {
    const zip = new JSZip();
    configFiles.forEach(({path, contents}) => zip.file(path, contents));
    const rice = await zip.generateAsync({type: "blob"})

    return rice
}

function render(options: Options, template: string): string {
    const renderTemplate = Handlebars.compile(template);
    const templateContext = {
        ...options,
        AWESOME_CONFIG,
    }

    return renderTemplate(templateContext)
}
