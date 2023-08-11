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

testFieldType('Float32LE', [
  testSet('0', FieldTypes.Float32LE, [[0, b(0, 0, 0, 0)]]),
  testSet('-0', FieldTypes.Float32LE, [[-0, b(0, 0, 0, 128)]]),
  testSet('1', FieldTypes.Float32LE, [[1, b(0, 0, 128, 63)]]),
  testSet('-1', FieldTypes.Float32LE, [[-1, b(0, 0, 128, 191)]]),
  testSet('1.5', FieldTypes.Float32LE, [[1.5, b(0, 0, 192, 63)]]),
  testSet('-1.5', FieldTypes.Float32LE, [[-1.5, b(0, 0, 192, 191)]]),
  testSet('3.4028234663852886e+38', FieldTypes.Float32LE, [
    [3.4028234663852886e+38, b(255, 255, 127, 127)],
  ]),
  testSet('-3.4028234663852886e+38', FieldTypes.Float32LE, [
    [-3.4028234663852886e+38, b(255, 255, 127, 255)],
  ]),
  testSet('1.401298464324817e-45', FieldTypes.Float32LE, [[1.401298464324817e-45, b(1, 0, 0, 0)]]),
  testSet('-1.401298464324817e-45', FieldTypes.Float32LE, [
    [-1.401298464324817e-45, b(1, 0, 0, 128)],
  ]),
  testSet('NaN', FieldTypes.Float32LE, [[NaN, b(0, 0, 192, 127)]]),
  testSet('Infinity', FieldTypes.Float32LE, [[Infinity, b(0, 0, 128, 127)]]),
  testSet('-Infinity', FieldTypes.Float32LE, [[-Infinity, b(0, 0, 128, 255)]]),
]);

testFieldType('Float32BE', [
  testSet('0', FieldTypes.Float32BE, [[0, b(0, 0, 0, 0)]]),
  testSet('-0', FieldTypes.Float32BE, [[-0, b(128, 0, 0, 0)]]),
  testSet('1', FieldTypes.Float32BE, [[1, b(63, 128, 0, 0)]]),
  testSet('-1', FieldTypes.Float32BE, [[-1, b(191, 128, 0, 0)]]),
  testSet('1.5', FieldTypes.Float32BE, [[1.5, b(63, 192, 0, 0)]]),
  testSet('-1.5', FieldTypes.Float32BE, [[-1.5, b(191, 192, 0, 0)]]),
  testSet('3.4028234663852886e+38', FieldTypes.Float32BE, [
    [3.4028234663852886e+38, b(127, 127, 255, 255)],
  ]),
  testSet('-3.4028234663852886e+38', FieldTypes.Float32BE, [
    [-3.4028234663852886e+38, b(255, 127, 255, 255)],
  ]),
  testSet('1.401298464324817e-45', FieldTypes.Float32BE, [[1.401298464324817e-45, b(0, 0, 0, 1)]]),
  testSet('-1.401298464324817e-45', FieldTypes.Float32BE, [
    [-1.401298464324817e-45, b(128, 0, 0, 1)],
  ]),
  testSet('NaN', FieldTypes.Float32BE, [[NaN, b(127, 192, 0, 0)]]),
  testSet('Infinity', FieldTypes.Float32BE, [[Infinity, b(127, 128, 0, 0)]]),
  testSet('-Infinity', FieldTypes.Float32BE, [[-Infinity, b(255, 128, 0, 0)]]),
]);

testFieldType('Float64LE', [
  testSet('0', FieldTypes.Float64LE, [[0, b(0, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('-0', FieldTypes.Float64LE, [[-0, b(0, 0, 0, 0, 0, 0, 0, 128)]]),
  testSet('1', FieldTypes.Float64LE, [[1, b(0, 0, 0, 0, 0, 0, 240, 63)]]),
  testSet('-1', FieldTypes.Float64LE, [[-1, b(0, 0, 0, 0, 0, 0, 240, 191)]]),
  testSet('1.5', FieldTypes.Float64LE, [[1.5, b(0, 0, 0, 0, 0, 0, 248, 63)]]),
  testSet('-1.5', FieldTypes.Float64LE, [[-1.5, b(0, 0, 0, 0, 0, 0, 248, 191)]]),
  testSet('1.7976931348623157e+308', FieldTypes.Float64LE, [
    [1.7976931348623157e+308, b(255, 255, 255, 255, 255, 255, 239, 127)],
  ]),
  testSet('-1.7976931348623157e+308', FieldTypes.Float64LE, [
    [-1.7976931348623157e+308, b(255, 255, 255, 255, 255, 255, 239, 255)],
  ]),
  testSet('4.9406564584124654e-324', FieldTypes.Float64LE, [
    [4.9406564584124654e-324, b(1, 0, 0, 0, 0, 0, 0, 0)],
  ]),
  testSet('-4.9406564584124654e-324', FieldTypes.Float64LE, [
    [-4.9406564584124654e-324, b(1, 0, 0, 0, 0, 0, 0, 128)],
  ]),
  testSet('NaN', FieldTypes.Float64LE, [[NaN, b(0, 0, 0, 0, 0, 0, 248, 127)]]),
  testSet('Infinity', FieldTypes.Float64LE, [[Infinity, b(0, 0, 0, 0, 0, 0, 240, 127)]]),
  testSet('-Infinity', FieldTypes.Float64LE, [[-Infinity, b(0, 0, 0, 0, 0, 0, 240, 255)]]),
]);

testFieldType('Float64BE', [
  testSet('0', FieldTypes.Float64BE, [[0, b(0, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('-0', FieldTypes.Float64BE, [[-0, b(128, 0, 0, 0, 0, 0, 0, 0)]]),
  testSet('1', FieldTypes.Float64BE, [[1, b(63, 240, 0, 0, 0, 0, 0, 0)]]),
  testSet('-1', FieldTypes.Float64BE, [[-1, b(191, 240, 0, 0, 0, 0, 0, 0)]]),
  testSet('1.5', FieldTypes.Float64BE, [[1.5, b(63, 248, 0, 0, 0, 0, 0, 0)]]),
  testSet('-1.5', FieldTypes.Float64BE, [[-1.5, b(191, 248, 0, 0, 0, 0, 0, 0)]]),
  testSet('1.7976931348623157e+308', FieldTypes.Float64BE, [
    [1.7976931348623157e+308, b(127, 239, 255, 255, 255, 255, 255, 255)],
  ]),
  testSet('-1.7976931348623157e+308', FieldTypes.Float64BE, [
    [-1.7976931348623157e+308, b(255, 239, 255, 255, 255, 255, 255, 255)],
  ]),
  testSet('4.9406564584124654e-324', FieldTypes.Float64BE, [
    [4.9406564584124654e-324, b(0, 0, 0, 0, 0, 0, 0, 1)],
  ]),
  testSet('-4.9406564584124654e-324', FieldTypes.Float64BE, [
    [-4.9406564584124654e-324, b(128, 0, 0, 0, 0, 0, 0, 1)],
  ]),
  testSet('NaN', FieldTypes.Float64BE, [[NaN, b(127, 248, 0, 0, 0, 0, 0, 0)]]),
  testSet('Infinity', FieldTypes.Float64BE, [[Infinity, b(127, 240, 0, 0, 0, 0, 0, 0)]]),
  testSet('-Infinity', FieldTypes.Float64BE, [[-Infinity, b(255, 240, 0, 0, 0, 0, 0, 0)]]),
]);

testFieldType('fixedLengthBytes', [
  testSet('1 byte', FieldTypes.fixedLengthBytes(1), [[b(1), b(1)]]),
  testSet('2 bytes', FieldTypes.fixedLengthBytes(2), [[b(1, 2), b(1, 2)]]),
  testSet('3 bytes', FieldTypes.fixedLengthBytes(3), [[b(1, 2, 3), b(1, 2, 3)]]),
]);

testFieldType('lengthPrefixedBytes', [
  testSet('0 bytes', FieldTypes.lengthPrefixedBytes(FieldTypes.Uint8), [[b(), b(0)]]),
  testSet('1 byte', FieldTypes.lengthPrefixedBytes(FieldTypes.Uint8), [[b(123), b(1, 123)]]),
  testSet('2 bytes', FieldTypes.lengthPrefixedBytes(FieldTypes.Uint8), [
    [b(123, 234), b(2, 123, 234)],
  ]),
  testSet('3 bytes', FieldTypes.lengthPrefixedBytes(FieldTypes.Uint8), [
    [b(123, 234, 45), b(3, 123, 234, 45)],
  ]),
]);
