import assert from 'node:assert/strict';
import * as Test from 'node:test';
import * as S from '@effect/schema/Schema';
import * as FieldTypes from '../../lib/fieldTypes';
import * as Reader from '../../lib/Reader';
import {FieldType} from '../../lib/types';
import * as Writer from '../../lib/Writer';
import {b} from '../utils';

// Test utils
// ==========

type ValuePair<A> = [
  decoded: A,
  encoded: Uint8Array
];

const testRead = <A>(fieldType: FieldType<A>, [decoded, encoded]: ValuePair<A>) => {
  const paddedBytes = b(1, 2, 3, ...encoded, 4, 5, 6);
  const reader = Reader.create(paddedBytes);
  reader.pos = 3;
  const actual = fieldType.read(reader);
  assert.deepEqual(actual, decoded);
  assert.equal(reader.pos, 3 + encoded.length);
  S.decodeSync(fieldType.schema)(actual);
};

const testWrite = <A>(fieldType: FieldType<A>, [decoded, encoded]: ValuePair<A>) => {
  const writer = Writer.create();
  Writer.push(writer, b(1, 2, 3));
  fieldType.write(writer, decoded);
  Writer.push(writer, b(4, 5, 6));
  const actual = Writer.finish(writer);
  assert.deepEqual(actual, b(1, 2, 3, ...encoded, 4, 5, 6));
  assert.equal(writer.length, 6 + encoded.length);
};

type TestSet<A> = {
  name: string,
  fieldType: FieldType<A>,
  valuePairs: ValuePair<A>[],
};

const testSet = <A>(
  name: string,
  fieldType: FieldType<A>,
  valuePairs: ValuePair<A>[]
): TestSet<A> => ({name, fieldType, valuePairs});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testFieldType = (name: string, testSets: TestSet<any>[]) => Test.test(name, async ctx => {
  for (const {name: setName, fieldType, valuePairs} of testSets) {
    await ctx.test(`Read ${setName}`, () => {
      for (const valuePair of valuePairs) {
        testRead(fieldType, valuePair);
      }
    });
    await ctx.test(`Write ${setName}`, () => {
      for (const valuePair of valuePairs) {
        testWrite(fieldType, valuePair);
      }
    });
  }
});

// Tests
// =====

testFieldType('Uint8', [
  testSet('0', FieldTypes.Uint8, [[0, b(0)]]),
  testSet('1', FieldTypes.Uint8, [[1, b(1)]]),
  testSet('128', FieldTypes.Uint8, [[128, b(128)]]),
  testSet('255', FieldTypes.Uint8, [[255, b(255)]]),
]);

testFieldType('Uint16LE', [
  testSet('0', FieldTypes.Uint16LE, [[0, b(0, 0)]]),
  testSet('1', FieldTypes.Uint16LE, [[1, b(1, 0)]]),
  testSet('256', FieldTypes.Uint16LE, [[256, b(0, 1)]]),
  testSet('65535', FieldTypes.Uint16LE, [[65535, b(255, 255)]]),
]);

testFieldType('Uint16BE', [
  testSet('0', FieldTypes.Uint16BE, [[0, b(0, 0)]]),
  testSet('1', FieldTypes.Uint16BE, [[1, b(0, 1)]]),
  testSet('256', FieldTypes.Uint16BE, [[256, b(1, 0)]]),
  testSet('65535', FieldTypes.Uint16BE, [[65535, b(255, 255)]]),
]);

testFieldType('Uint32LE', [
  testSet('0', FieldTypes.Uint32LE, [[0, b(0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Uint32LE, [[1, b(1, 0, 0, 0)]]),
  testSet('256', FieldTypes.Uint32LE, [[256, b(0, 1, 0, 0)]]),
  testSet('65536', FieldTypes.Uint32LE, [[65536, b(0, 0, 1, 0)]]),
  testSet('16777216', FieldTypes.Uint32LE, [[16777216, b(0, 0, 0, 1)]]),
  testSet('4294967295', FieldTypes.Uint32LE, [[4294967295, b(255, 255, 255, 255)]]),
]);

testFieldType('Uint32BE', [
  testSet('0', FieldTypes.Uint32BE, [[0, b(0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Uint32BE, [[1, b(0, 0, 0, 1)]]),
  testSet('256', FieldTypes.Uint32BE, [[256, b(0, 0, 1, 0)]]),
  testSet('65536', FieldTypes.Uint32BE, [[65536, b(0, 1, 0, 0)]]),
  testSet('16777216', FieldTypes.Uint32BE, [[16777216, b(1, 0, 0, 0)]]),
  testSet('4294967295', FieldTypes.Uint32BE, [[4294967295, b(255, 255, 255, 255)]]),
]);

testFieldType('Uint64LE', [
  testSet('0', FieldTypes.Uint64LE, [[0n, b(0, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Uint64LE, [[1n, b(1, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('256', FieldTypes.Uint64LE, [[256n, b(0, 1, 0, 0, 0, 0, 0, 0)]]),
  testSet('65536', FieldTypes.Uint64LE, [[65536n, b(0, 0, 1, 0, 0, 0, 0, 0)]]),
  testSet('16777216', FieldTypes.Uint64LE, [[16777216n, b(0, 0, 0, 1, 0, 0, 0, 0)]]),
  testSet('4294967296', FieldTypes.Uint64LE, [[4294967296n, b(0, 0, 0, 0, 1, 0, 0, 0)]]),
  testSet('1099511627776', FieldTypes.Uint64LE, [[1099511627776n, b(0, 0, 0, 0, 0, 1, 0, 0)]]),
  testSet('281474976710656', FieldTypes.Uint64LE, [[281474976710656n, b(0, 0, 0, 0, 0, 0, 1, 0)]]),
  testSet('72057594037927936', FieldTypes.Uint64LE, [
    [72057594037927936n, b(0, 0, 0, 0, 0, 0, 0, 1)],
  ]),
  testSet('18446744073709551615', FieldTypes.Uint64LE, [
    [18446744073709551615n, b(255, 255, 255, 255, 255, 255, 255, 255)],
  ]),
]);

testFieldType('Uint64BE', [
  testSet('0', FieldTypes.Uint64BE, [[0n, b(0, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Uint64BE, [[1n, b(0, 0, 0, 0, 0, 0, 0, 1)]]),
  testSet('256', FieldTypes.Uint64BE, [[256n, b(0, 0, 0, 0, 0, 0, 1, 0)]]),
  testSet('65536', FieldTypes.Uint64BE, [[65536n, b(0, 0, 0, 0, 0, 1, 0, 0)]]),
  testSet('16777216', FieldTypes.Uint64BE, [[16777216n, b(0, 0, 0, 0, 1, 0, 0, 0)]]),
  testSet('4294967296', FieldTypes.Uint64BE, [[4294967296n, b(0, 0, 0, 1, 0, 0, 0, 0)]]),
  testSet('1099511627776', FieldTypes.Uint64BE, [[1099511627776n, b(0, 0, 1, 0, 0, 0, 0, 0)]]),
  testSet('281474976710656', FieldTypes.Uint64BE, [[281474976710656n, b(0, 1, 0, 0, 0, 0, 0, 0)]]),
  testSet('72057594037927936', FieldTypes.Uint64BE, [
    [72057594037927936n, b(1, 0, 0, 0, 0, 0, 0, 0)],
  ]),
  testSet('18446744073709551615', FieldTypes.Uint64BE, [
    [18446744073709551615n, b(255, 255, 255, 255, 255, 255, 255, 255)],
  ]),
]);

testFieldType('Int8', [
  testSet('0', FieldTypes.Int8, [[0, b(0)]]),
  testSet('1', FieldTypes.Int8, [[1, b(1)]]),
  testSet('-1', FieldTypes.Int8, [[-1, b(255)]]),
  testSet('127', FieldTypes.Int8, [[127, b(127)]]),
  testSet('-128', FieldTypes.Int8, [[-128, b(128)]]),
]);

testFieldType('Int16LE', [
  testSet('0', FieldTypes.Int16LE, [[0, b(0, 0)]]),
  testSet('1', FieldTypes.Int16LE, [[1, b(1, 0)]]),
  testSet('-1', FieldTypes.Int16LE, [[-1, b(255, 255)]]),
  testSet('32767', FieldTypes.Int16LE, [[32767, b(255, 127)]]),
  testSet('-32768', FieldTypes.Int16LE, [[-32768, b(0, 128)]]),
]);

testFieldType('Int16BE', [
  testSet('0', FieldTypes.Int16BE, [[0, b(0, 0)]]),
  testSet('1', FieldTypes.Int16BE, [[1, b(0, 1)]]),
  testSet('-1', FieldTypes.Int16BE, [[-1, b(255, 255)]]),
  testSet('32767', FieldTypes.Int16BE, [[32767, b(127, 255)]]),
  testSet('-32768', FieldTypes.Int16BE, [[-32768, b(128, 0)]]),
]);

testFieldType('Int32LE', [
  testSet('0', FieldTypes.Int32LE, [[0, b(0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Int32LE, [[1, b(1, 0, 0, 0)]]),
  testSet('-1', FieldTypes.Int32LE, [[-1, b(255, 255, 255, 255)]]),
  testSet('2147483647', FieldTypes.Int32LE, [[2147483647, b(255, 255, 255, 127)]]),
  testSet('-2147483648', FieldTypes.Int32LE, [[-2147483648, b(0, 0, 0, 128)]]),
]);

testFieldType('Int32BE', [
  testSet('0', FieldTypes.Int32BE, [[0, b(0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Int32BE, [[1, b(0, 0, 0, 1)]]),
  testSet('-1', FieldTypes.Int32BE, [[-1, b(255, 255, 255, 255)]]),
  testSet('2147483647', FieldTypes.Int32BE, [[2147483647, b(127, 255, 255, 255)]]),
  testSet('-2147483648', FieldTypes.Int32BE, [[-2147483648, b(128, 0, 0, 0)]]),
]);

testFieldType('Int64LE', [
  testSet('0', FieldTypes.Int64LE, [[0n, b(0, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Int64LE, [[1n, b(1, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('-1', FieldTypes.Int64LE, [[-1n, b(255, 255, 255, 255, 255, 255, 255, 255)]]),
  testSet('9223372036854775807', FieldTypes.Int64LE, [
    [9223372036854775807n, b(255, 255, 255, 255, 255, 255, 255, 127)],
  ]),
  testSet('-9223372036854775808', FieldTypes.Int64LE, [
    [-9223372036854775808n, b(0, 0, 0, 0, 0, 0, 0, 128)],
  ]),
]);

testFieldType('Int64BE', [
  testSet('0', FieldTypes.Int64BE, [[0n, b(0, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Int64BE, [[1n, b(0, 0, 0, 0, 0, 0, 0, 1)]]),
  testSet('-1', FieldTypes.Int64BE, [[-1n, b(255, 255, 255, 255, 255, 255, 255, 255)]]),
  testSet('9223372036854775807', FieldTypes.Int64BE, [
    [9223372036854775807n, b(127, 255, 255, 255, 255, 255, 255, 255)],
  ]),
  testSet('-9223372036854775808', FieldTypes.Int64BE, [
    [-9223372036854775808n, b(128, 0, 0, 0, 0, 0, 0, 0)],
  ]),
]);
