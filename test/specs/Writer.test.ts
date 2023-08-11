import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as Writer from '../../lib/Writer';
import {b} from '../utils';

test('Writer', async writerCtx => {
  await writerCtx.test('create', async createCtx => {
    await createCtx.test('creates a writer', () => {
      const writer = Writer.create();
      assert.deepEqual(writer, {
        chunks: [],
        length: 0,
      });
    });
  });

  await writerCtx.test('push', async pushCtx => {
    await pushCtx.test('adds a chunk to the writer', () => {
      const writer = Writer.create();
      Writer.push(writer, b(1, 2, 3));
      assert.deepEqual(writer.chunks, [b(1, 2, 3)]);
      Writer.push(writer, b(4, 5));
      assert.deepEqual(writer.chunks, [b(1, 2, 3), b(4, 5)]);
    });
    await pushCtx.test('updates the length', () => {
      const writer = Writer.create();
      Writer.push(writer, b(1, 2, 3));
      assert.equal(writer.length, 3);
      Writer.push(writer, b(4, 5));
      assert.equal(writer.length, 5);
    });
  });

  await writerCtx.test('finish', async finishCtx => {
    await finishCtx.test('returns a flat Uint8Array with all bytes', () => {
      const writer = Writer.create();
      Writer.push(writer, b(1, 2, 3));
      Writer.push(writer, b(4, 5));
      const arr = Writer.finish(writer);
      assert.deepEqual(arr, b(1, 2, 3, 4, 5));
    });
  });
});
