export async function readFileIntoUint8Array(file) {
    const arrayBuffer = await file.arrayBuffer();

    return new Uint8Array(arrayBuffer);
}

export function readStringIntoUint8Array(string) {
    const encoder = new TextEncoder();

    return encoder.encode(string);
}

export function readUint8ArrayIntoString(array) {
    const decoder = new TextDecoder();

    return decoder.decode(array);
}
