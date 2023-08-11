import {Writer} from './types';

export const create = (): Writer => ({
  chunks: [],
  length: 0,
});

export const push = (writer: Writer, chunk: Uint8Array) => {
  writer.chunks.push(chunk);
  writer.length += chunk.length;
};

export const finish = (writer: Writer) => {
  const arr = new Uint8Array(writer.length);
  let pos = 0;
  for (const chunk of writer.chunks) {
    arr.set(chunk, pos);
    pos += chunk.length;
  }
  return arr;
};
