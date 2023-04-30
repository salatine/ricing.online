export async function readFileIntoUint8Array(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();

    return new Uint8Array(arrayBuffer);
}

export function readStringIntoUint8Array(string: string): Uint8Array {
    const encoder = new TextEncoder();

    return encoder.encode(string);
}

export function readUint8ArrayIntoString(array: Uint8Array): string {
    const decoder = new TextDecoder();

    return decoder.decode(array);
}
