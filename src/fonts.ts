import { runCommand } from "./rpc"

export type FontFamily = string

export async function getAvailableFontFamilies(emulator: any): Promise<FontFamily[]> {
    const result = await runCommand(emulator, "fc-list :lang=en:style=Regular family");
    const fontFamilies: string[] = result.split("\n")
        .map(familyNames => familyNames.split(',')[0])

    // remove last empty element
    fontFamilies.pop()

    return fontFamilies 
}