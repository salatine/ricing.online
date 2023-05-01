export async function readBlobIntoUint8Array(blob: Blob): Promise<Uint8Array> {
    const arrayBuffer = await blob.arrayBuffer();

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

export function makeBlobFromString(content: string): Blob {
    return new Blob([content], { type: "text/plain;charset=utf-8" });
}

export function partialUpdate<T>(original: T, newFields: Partial<T>) {  
    return { ...original, ...newFields };
}

export function makePartialUpdater<T>(original: T, onUpdateCallback: (value: T) => void) {
    return (newFields: Partial<T>) => {
        const updated = partialUpdate(original, newFields);
        onUpdateCallback(updated);
    }
}
