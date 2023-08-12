/* eslint-disable max-lines */
import * as O from '@effect/data/Option';
import * as S from '@effect/schema/Schema';
import * as constants from './constants';
import * as Decode from './decode';
import * as Encode from './encode';
import {Cast, DeepWriteable, FieldType, FieldTypeInner} from './types';
import {pipeFieldType} from './utils';
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

export const fixedLengthString = (
  length: number
): FieldType<string> => pipeFieldType(
  fixedLengthBytes(length),
  Decode.decodeText,
  Encode.encodeText,
  S.string
);

export const lengthPrefixedString = (
  lengthField: FieldType<number>
): FieldType<string> => pipeFieldType(
  lengthPrefixedBytes(lengthField),
  Decode.decodeText,
  Encode.encodeText,
  S.string
);

export const NullTerminatedString: FieldType<string> = {
  read: reader => {
    const end = reader.arr.indexOf(0, reader.pos);
    const value = Decode.decodeText(reader.arr.slice(reader.pos, end));
    reader.pos = end + 1;
    return value;
  },
  write: (writer, value) => {
    Writer.push(writer, Encode.encodeText(value));
    Writer.push(writer, Encode.encodeUint8(0));
  },
  schema: S.string,
};

export const Bool: FieldType<boolean> = pipeFieldType(
  Uint8,
  v => v === 1,
  v => v ? 1 : 0,
  S.boolean
);

export const stringEnum = (
  stringField: FieldType<string>
) => <A extends Record<string, string>>(
  enumObj: A
): FieldType<A[keyof A]> => ({
  read: reader => stringField.read(reader) as A[keyof A],
  write: stringField.write,
  schema: S.enums(enumObj),
});

export const numberEnum = (
  numberField: FieldType<number>
) => <A extends Record<string, string | number>>(
  enumObj: A
): FieldType<A[keyof A]> => ({
  read: reader => numberField.read(reader) as A[keyof A],
  write: (writer, value) => {
    if (typeof value !== 'number') {
      throw new Error(`Expected number, got ${typeof value}`);
    }
    numberField.write(writer, value);
  },
  schema: S.enums(enumObj),
});

export const optional = <A>(field: FieldType<A>): FieldType<O.Option<A>> => ({
  read: reader => {
    const isSet = Bool.read(reader);
    return isSet ? O.some(field.read(reader)) : O.none<A>();
  },
  write: (writer, value) => {
    if (O.isSome(value)) {
      Bool.write(writer, true);
      field.write(writer, value.value);
    } else {
      Bool.write(writer, false);
    }
  },
  schema: S.to(S.option(field.schema)),
});

export const fixedLengthArray = <A>(
  field: FieldType<A>
) => (
  length: number
): FieldType<readonly A[]> => ({
  read: reader => {
    const arr: A[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(field.read(reader));
    }
    return arr;
  },
  write: (writer, arr) => {
    for (let i = 0; i < length; i++) {
      field.write(writer, arr[i]);
    }
  },
  schema: S.array(field.schema),
});

export const lengthPrefixedArray = (
  lengthField: FieldType<number>
) => <A>(
  field: FieldType<A>
): FieldType<readonly A[]> => ({
  read: reader => {
    const length = lengthField.read(reader);
    const arr: A[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(field.read(reader));
    }
    return arr;
  },
  write: (writer, arr) => {
    lengthField.write(writer, arr.length);
    for (let i = 0; i < arr.length; i++) {
      field.write(writer, arr[i]);
    }
  },
  schema: S.array(field.schema),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StructEntry<A = any> = readonly [name: string, type: FieldType<A>];

export type StructEntries = readonly [...StructEntry[]];

type StructFromEntries<A> = (
  DeepWriteable<A> extends [infer Key, DeepWriteable<FieldType<unknown>>][]
    ? {[K in Cast<Key, string>]: (
      FieldTypeInner<Extract<DeepWriteable<A>[number], [K, unknown]>[1]>
    )}
    : {[key in string]: unknown}
);

export const struct = <A extends StructEntries>(
  entries: A
): FieldType<StructFromEntries<A>> => ({
  read: reader => {
    const result: Record<string, unknown> = {};
    for (const [name, field] of entries) {
      result[name] = field.read(reader);
    }
    return result as StructFromEntries<A>;
  },
  write: (writer, value) => {
    for (const [name, field] of entries) {
      field.write(writer, value[name]);
    }
  },
  schema: S.struct(
    Object.fromEntries(
      entries.map(([name, field]) => [name, field.schema])
    )
  ) as unknown as S.Schema<StructFromEntries<A>>,
});

export const literal = <A extends string | number | boolean | null | bigint>(
  field: FieldType<A>
) => <B extends A>(
  value: B
): FieldType<B> => ({
  read: reader => field.read(reader) as B,
  write: field.write,
  schema: S.literal(value),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionOption<A = any> = readonly [fieldType: FieldType<A>, is: (value: any) => boolean];

export type UnionOptions = readonly [...UnionOption[]];

export const union = (
  indexField: FieldType<number>
) => <A extends UnionOptions>(
  fields: A
): FieldType<FieldTypeInner<A[number][0]>> => ({
  read: reader => {
    const index = indexField.read(reader);
    return fields[index][0].read(reader);
  },
  write: (writer, value) => {
    for (let i = 0; i < fields.length; i++) {
      const [field, is] = fields[i];
      if (is(value)) {
        indexField.write(writer, i);
        field.write(writer, value);
        return;
      }
    }
  },
  schema: S.union(...fields.map(([field]) => field.schema)),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TupleDef = readonly [...FieldType<any>[]];

type TupleInner<A extends TupleDef> = Readonly<{
  [K in keyof A]: FieldTypeInner<A[K]>;
}>;

export const tuple = <A extends TupleDef>(
  ...fields: A
): FieldType<TupleInner<A>> => ({
  read: reader => {
    const result: unknown[] = [];
    for (const field of fields) {
      result.push(field.read(reader));
    }
    return result as TupleInner<A>;
  },
  write: (writer, value) => {
    for (let i = 0; i < fields.length; i++) {
      fields[i].write(writer, value[i]);
    }
  },
  schema: S.tuple(...fields.map(field => field.schema)) as S.Schema<TupleInner<A>>,
});

export const reference = (
  field: FieldType<number>
): [FieldType<number>, <A>(field: FieldType<A>) => FieldType<A>] => {
  let refIndex: number | null = null;
  const refField: FieldType<number> = {
    read: field.read,
    write: writer => {
      if (refIndex === null) {
        refIndex = writer.chunks.length;
        field.write(writer, 0);
      }
    },
    schema: field.schema,
  };

  const targetField = <A>(innerField: FieldType<A>): FieldType<A> => ({
    read: innerField.read,
    write: (writer, value) => {
      if (refIndex !== null) {
        const restChunks = writer.chunks.slice(refIndex + 1);
        const length = writer.length;
        writer.chunks = writer.chunks.slice(0, refIndex);
        field.write(writer, length);
        writer.chunks.push(...restChunks);
        writer.length = length;
        innerField.write(writer, value);
      }
    },
    schema: innerField.schema,
  });

  return [refField, targetField];
};
