import * as S from '@effect/schema/Schema';
import {FieldType} from './types';

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
