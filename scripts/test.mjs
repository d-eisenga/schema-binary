import {spawn} from 'node:child_process';
import process from 'node:process';
import {glob} from 'glob';

// Simply running `node --test test/specs` works for .js files, but not for .ts
// files, even with the swc-node module loader. There doesn't seem to be a way
// to get the Node test runner to run .ts files with a pattern, so we have to
// manually provide an exhaustive list of test files.

const testFilePaths = await glob('test/specs/**/*.test.ts');

if (testFilePaths.length === 0) {
  process.stderr.write('No test files found.\n');
  process.exit(1);
}

/* eslint-disable array-element-newline */
const testProcess = spawn('node', [

  // Add the swc-node module loader to enable TypeScript support.
  '-r', '@swc-node/register',

  // Specify we're running tests.
  '--test',

  // Specify the test files to run.
  ...testFilePaths,
], {

  // Inherit stdio so that we can see the test output.
  stdio: 'inherit',
});
/* eslint-enable array-element-newline */

testProcess.on('exit', exitCode => {
  process.exit(exitCode);
});
