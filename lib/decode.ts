const textDecoder = new TextDecoder('utf-8', {fatal: true});

export const decodeText = (arr: Uint8Array) => textDecoder.decode(arr);
