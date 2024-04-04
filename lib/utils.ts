import * as S from '@effect/schema/Schema';
import * as Reader from './Reader';
import {FieldType} from './types';
import * as Writer from './Writer';

export const pipeFieldType = <A, B>(
  fieldType: FieldType<A>,
  postRead: (a: A) => B,
  preWrite: (b: B) => A,
  schema: S.Schema<B>
): FieldType<B> => ({
  read: reader => postRead(fieldType.read(reader)),
  write: (writer, value) => fieldType.write(writer, preWrite(value)),
  schema: schema,
});

export const toSchema = <A>(fieldType: FieldType<A>): S.Schema<Uint8Array, A> => S.transform(
  S.instanceOf(Uint8Array),
  fieldType.schema,
  bytes => {
    const reader = Reader.create(bytes);
    return fieldType.read(reader);
  },
  value => {
    const writer = Writer.create();
    fieldType.write(writer, value);
    return Writer.finish(writer);
  }
);
