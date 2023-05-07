import Handlebars from "handlebars";
import RcLuaTemplate from "bundle-text:./templates/rc.lua.hbs";
import MyTasklistLuaTemplate from "bundle-text:./templates/mytasklist.lua.hbs";
import ThemeLuaTemplate from "bundle-text:./templates/theme.lua.hbs";
import WidgetPartial from "bundle-text:./templates/partials/widget.hbs";
import { readBlobIntoUint8Array, readStringIntoUint8Array, makeBlobFromString } from "./utils";
import { AWESOME_CONFIG } from "./constants";
import { saveAs } from "file-saver";
import JSZip from "jszip";

// handlebars sucks 👍
Handlebars.registerHelper('eq', (a, b) => a === b) 
Handlebars.registerPartial('widget', WidgetPartial)

export type Color = string

export type CustomKeybind = {
    modKeys: string[],
    normalKey: string,
    command: string,
}

export type AutostartApplication = {
    commandLine: string,
}

export type WindowBorder = {
    size: number,
    normalColor: Color,
    focusColor:  Color,
    markedColor: Color,
}

export type FontOptions = {
    family: string,
    size: number,
}

export type StatusBarPosition = 'left' | 'top' | 'right' | 'bottom'

export type LauncherWidget = {
    type: 'launcher',
    iconPath: string,
    command: string,
}

export type SystrayWidget = {
    type: 'systray',
    // 👍 
}

export type ClockWidget = {
    type: 'clock'
}

export type TagListButton = {
    // 👍
}

export type TagListWidget = {
    type: 'taglist',
    buttons: TagListButton[],
    color: Color
}

export type TaskListWidget = {
    type: 'tasklist',
    fontSize: number,
}

export type BrightnessWidget = {
    type: 'brightness',
}

export type BatteryWidget = {
    type: 'battery',
}

export type VolumeWidget = {
    type: 'volume',
}

export type StatusBarWidget
    = LauncherWidget
    | TagListWidget
    | TaskListWidget
    | VolumeWidget 
    | BatteryWidget
    | BrightnessWidget
    | ClockWidget
    | SystrayWidget

export type IdentifiableStatusBarWidget = StatusBarWidget & {
    id: string
}

export type StatusBar = {
    position: StatusBarPosition,
    height: number,
    borderWidth: number,
    color: Color,
    widgets: IdentifiableStatusBarWidget[],
}

export type Options = {
    autostartApplications: AutostartApplication[],
    customKeybinds: CustomKeybind[],
    terminal: string,
    windowBorder: WindowBorder,
    font: FontOptions,
    statusBar: StatusBar,
}

export type ConfigFile = {
    path: string
    contents: Blob
}

export function getConfigFiles(options: Options): ConfigFile[] {
    const configTextFiles: Record<string, string> = {
        ".config/awesome/mytasklist.lua": render(options, MyTasklistLuaTemplate),
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
        await emulator.create_file(emulatorHome + path, await readBlobIntoUint8Array(contents))
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
