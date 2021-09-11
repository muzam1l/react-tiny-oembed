import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import typescript from '@rollup/plugin-typescript'; // HAD PROBLEMS
import typescript from 'rollup-plugin-typescript2' // REPLACEMENT
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts' // For concatenated dts
import filesize from 'rollup-plugin-filesize'
import pkg from './package.json'

const EXTERNAL = [...new Set([...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)])]

export default [
    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/index.ts',
        plugins: [
            nodeResolve(), // so Rollup can find external modules
            commonjs(), // so Rollup can convert external modules to an ES module
            typescript(), // so Rollup can convert TypeScript to JavaScript
            terser(), // minify
            filesize(),
        ],
        external: EXTERNAL,
        output: [
            // { file: pkg.main, format: 'cjs', exports: 'auto', },
            // { file: pkg.module, format: 'es', exports: 'auto', },
            { name: 'Embed', file: pkg.main, format: 'umd', exports: 'auto' },
        ],
    },
    // For concatenated dts
    {
        input: 'src/index.ts',
        output: [{ file: 'lib/index.d.ts', format: 'es' }],
        plugins: [dts()],
    },
]
