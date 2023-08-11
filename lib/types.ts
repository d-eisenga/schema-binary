export type Reader = {
  arr: Uint8Array,
  view: DataView,
  pos: number,
};

export type Writer = {
  chunks: Uint8Array[];
  length: number;
};
