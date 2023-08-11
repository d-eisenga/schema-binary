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

export type DeepWriteable<A> = {-readonly [P in keyof A]: DeepWriteable<A[P]>};

export type FieldTypeInner<A> = A extends FieldType<infer B> ? B :
  A extends DeepWriteable<FieldType<infer C>> ? C :
    never;

export type Cast<A, B> = A extends B ? A : B;
