const viewBuffer = new ArrayBuffer(8);
const view = new DataView(viewBuffer);
const arr = new Uint8Array(viewBuffer);

export const encodeUint8 = (value: number) => {
  view.setUint8(0, value);
  return arr.slice(0, 1);
};

export const encodeUint16 = (value: number, littleEndian: boolean) => {
  view.setUint16(0, value, littleEndian);
  return arr.slice(0, 2);
};

export const encodeUint32 = (value: number, littleEndian: boolean) => {
  view.setUint32(0, value, littleEndian);
  return arr.slice(0, 4);
};

export const encodeUint64 = (value: bigint, littleEndian: boolean) => {
  view.setBigUint64(0, value, littleEndian);
  return arr.slice(0, 8);
};

export const encodeInt8 = (value: number) => {
  view.setInt8(0, value);
  return arr.slice(0, 1);
};

export const encodeInt16 = (value: number, littleEndian: boolean) => {
  view.setInt16(0, value, littleEndian);
  return arr.slice(0, 2);
};

export const encodeInt32 = (value: number, littleEndian: boolean) => {
  view.setInt32(0, value, littleEndian);
  return arr.slice(0, 4);
};

export const encodeInt64 = (value: bigint, littleEndian: boolean) => {
  view.setBigInt64(0, value, littleEndian);
  return arr.slice(0, 8);
};
