import {test} from 'node:test';

export const b = (...bytes: number[]) => new Uint8Array(bytes);

export type TestFn = Exclude<Parameters<typeof test>[0], undefined>;
export type TestContext = Parameters<TestFn>[0];
