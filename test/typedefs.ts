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
