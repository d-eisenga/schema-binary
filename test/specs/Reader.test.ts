import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as Reader from '../../lib/Reader';

test('Reader', async readerCtx => {
  await readerCtx.test('create', async createCtx => {
    await createCtx.test('creates a reader', () => {
      const reader = Reader.create(new Uint8Array([1, 2, 3]));
      assert.deepEqual(reader, {
        arr: new Uint8Array([1, 2, 3]),
        view: new DataView(new Uint8Array([1, 2, 3]).buffer),
        pos: 0,
      });
      assert.equal(reader.arr.buffer, reader.view.buffer);
    });
  });
});
