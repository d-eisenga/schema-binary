import {Reader} from './types';

export const create = (arr: Uint8Array): Reader => ({
  arr: arr,
  view: new DataView(arr.buffer),
  pos: 0,
});
