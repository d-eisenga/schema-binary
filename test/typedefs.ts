import * as O from '@effect/data/Option';
import * as S from '@effect/schema/Schema';
// eslint-disable-next-line import/no-unresolved
import {expectType} from 'tsd';
import * as F from '../lib/fieldTypes';
import {Reader, FieldType} from '../lib/types';

const checkFieldType = <A>(field: FieldType<A>) => {
  expectType<A>(field.read({} as Reader));
  expectType<S.Schema<A>>(field.schema);
};

checkFieldType<number>(F.Uint8);
checkFieldType<number>(F.Uint16LE);
checkFieldType<number>(F.Uint16BE);
checkFieldType<number>(F.Uint32LE);
checkFieldType<number>(F.Uint32BE);
checkFieldType<bigint>(F.Uint64LE);
checkFieldType<bigint>(F.Uint64BE);

checkFieldType<number>(F.Int8);
checkFieldType<number>(F.Int16LE);
checkFieldType<number>(F.Int16BE);
checkFieldType<number>(F.Int32LE);
checkFieldType<number>(F.Int32BE);
checkFieldType<bigint>(F.Int64LE);
checkFieldType<bigint>(F.Int64BE);

checkFieldType<number>(F.Float32LE);
checkFieldType<number>(F.Float32BE);
checkFieldType<number>(F.Float64LE);
checkFieldType<number>(F.Float64BE);

checkFieldType<Uint8Array>(F.fixedLengthBytes(1));
checkFieldType<Uint8Array>(F.lengthPrefixedBytes(F.Uint8));

checkFieldType<string>(F.NullTerminatedString);
checkFieldType<string>(F.fixedLengthString(1));
checkFieldType<string>(F.lengthPrefixedString(F.Uint8));

checkFieldType<boolean>(F.Bool);

enum StringEnum {Foo = 'Foo', Bar = 'Bar'}
checkFieldType<StringEnum>(F.stringEnum(F.fixedLengthString(3))(StringEnum));
enum NumberEnum {Foo, Bar}
checkFieldType<NumberEnum>(F.numberEnum(F.Uint8)(NumberEnum));
enum NumberEnum2 {Foo = 1, Bar = 2}
checkFieldType<NumberEnum2>(F.numberEnum(F.Uint8)(NumberEnum2));

checkFieldType<O.Option<bigint>>(F.optional(F.Uint64BE));
checkFieldType<O.Option<boolean>>(F.optional(F.Bool));

checkFieldType<readonly string[]>(F.fixedLengthArray(F.NullTerminatedString)(1));
checkFieldType<readonly number[]>(F.fixedLengthArray(F.Uint8)(1));
checkFieldType<readonly boolean[]>(F.lengthPrefixedArray(F.Uint8)(F.Bool));
checkFieldType<readonly bigint[]>(F.lengthPrefixedArray(F.Uint8)(F.Uint64BE));

type Struct = {
  foo: string,
  bar: number,
  baz: boolean,
  qux: 'qux',
};
checkFieldType<Struct>(F.struct([
  ['foo', F.NullTerminatedString],
  ['bar', F.Uint8],
  ['baz', F.Bool],
  ['qux', F.literal(F.NullTerminatedString)('qux')],
] as const));

checkFieldType<'Foo'>(F.literal(F.NullTerminatedString)('Foo'));
checkFieldType<123>(F.literal(F.Uint8)(123));
