/* eslint-disable max-lines */
import * as S from '@effect/schema/Schema';
import * as constants from './constants';
import * as Encode from './encode';
import {FieldType} from './types';
import * as Writer from './Writer';

const int = S.number.pipe(S.int());
const uint = int.pipe(S.nonNegative());
const bigUint = S.bigint.pipe(S.nonNegativeBigint());

export const Uint8: FieldType<number> = {
  read: reader => {
    const value = reader.arr[reader.pos];
    reader.pos += 1;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint8(value));
  },
  schema: uint.pipe(S.lessThan(constants.UINT8_MAX + 1)),
};

export const Uint16LE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getUint16(reader.pos, true);
    reader.pos += 2;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint16(value, true));
  },
  schema: uint.pipe(S.lessThan(constants.UINT16_MAX + 1)),
};

export const Uint16BE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getUint16(reader.pos, false);
    reader.pos += 2;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint16(value, false));
  },
  schema: uint.pipe(S.lessThan(constants.UINT16_MAX + 1)),
};

export const Uint32LE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getUint32(reader.pos, true);
    reader.pos += 4;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint32(value, true));
  },
  schema: uint.pipe(S.lessThan(constants.UINT32_MAX + 1)),
};

export const Uint32BE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getUint32(reader.pos, false);
    reader.pos += 4;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint32(value, false));
  },
  schema: uint.pipe(S.lessThan(constants.UINT32_MAX + 1)),
};

export const Uint64LE: FieldType<bigint> = {
  read: reader => {
    const value = reader.view.getBigUint64(reader.pos, true);
    reader.pos += 8;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint64(value, true));
  },
  schema: bigUint.pipe(S.lessThanBigint(constants.UINT64_MAX + 1n)),
};

export const Uint64BE: FieldType<bigint> = {
  read: reader => {
    const value = reader.view.getBigUint64(reader.pos, false);
    reader.pos += 8;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeUint64(value, false));
  },
  schema: bigUint.pipe(S.lessThanBigint(constants.UINT64_MAX + 1n)),
};

export const Int8: FieldType<number> = {
  read: reader => {
    const value = reader.view.getInt8(reader.pos);
    reader.pos += 1;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt8(value));
  },
  schema: int.pipe(S.between(constants.INT8_MIN, constants.INT8_MAX)),
};

export const Int16LE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getInt16(reader.pos, true);
    reader.pos += 2;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt16(value, true));
  },
  schema: int.pipe(S.between(constants.INT16_MIN, constants.INT16_MAX)),
};

export const Int16BE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getInt16(reader.pos, false);
    reader.pos += 2;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt16(value, false));
  },
  schema: int.pipe(S.between(constants.INT16_MIN, constants.INT16_MAX)),
};

export const Int32LE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getInt32(reader.pos, true);
    reader.pos += 4;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt32(value, true));
  },
  schema: int.pipe(S.between(constants.INT32_MIN, constants.INT32_MAX)),
};

export const Int32BE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getInt32(reader.pos, false);
    reader.pos += 4;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt32(value, false));
  },
  schema: int.pipe(S.between(constants.INT32_MIN, constants.INT32_MAX)),
};

export const Int64LE: FieldType<bigint> = {
  read: reader => {
    const value = reader.view.getBigInt64(reader.pos, true);
    reader.pos += 8;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt64(value, true));
  },
  schema: S.bigint.pipe(S.betweenBigint(constants.INT64_MIN, constants.INT64_MAX)),
};

export const Int64BE: FieldType<bigint> = {
  read: reader => {
    const value = reader.view.getBigInt64(reader.pos, false);
    reader.pos += 8;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeInt64(value, false));
  },
  schema: S.bigint.pipe(S.betweenBigint(constants.INT64_MIN, constants.INT64_MAX)),
};

export const Float32LE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getFloat32(reader.pos, true);
    reader.pos += 4;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeFloat32(value, true));
  },
  schema: S.number,
};

export const Float32BE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getFloat32(reader.pos, false);
    reader.pos += 4;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeFloat32(value, false));
  },
  schema: S.number,
};

export const Float64LE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getFloat64(reader.pos, true);
    reader.pos += 8;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeFloat64(value, true));
  },
  schema: S.number,
};

export const Float64BE: FieldType<number> = {
  read: reader => {
    const value = reader.view.getFloat64(reader.pos, false);
    reader.pos += 8;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeFloat64(value, false));
  },
  schema: S.number,
};

export const fixedLengthBytes = (
  length: number
): FieldType<Uint8Array> => ({
  read: reader => {
    const value = reader.arr.slice(reader.pos, reader.pos + length);
    reader.pos += length;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, value);
  },
  schema: S.instanceOf(Uint8Array),
});

export const lengthPrefixedBytes = (
  lengthField: FieldType<number>
): FieldType<Uint8Array> => ({
  read: reader => {
    const length = lengthField.read(reader);
    const value = reader.arr.slice(reader.pos, reader.pos + length);
    reader.pos += length;
    return value;
  },
  write: (writer, value) => {
    lengthField.write(writer, value.length);
    Writer.push(writer, value);
  },
  schema: S.instanceOf(Uint8Array),
});
