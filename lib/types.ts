import * as S from '@effect/schema/Schema';

export type Reader = {
  arr: Uint8Array,
  view: DataView,
  pos: number,
};

export type Writer = {
  chunks: Uint8Array[];
  length: number;
};

export type FieldType<A> = Readonly<{
  read: (reader: Reader) => A,
  write: (writer: Writer, value: A) => void,
  schema: S.Schema<A>,
}>;
