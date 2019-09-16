import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';
import path from 'path';
import builtins from 'rollup-plugin-node-builtins';
const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
const external = Object.keys(pkg.dependencies || {});
external.push('atom');
external.push('fs');
external.push('child_process');

export default {
    input: 'index.js',
    output: {
        file: 'build/main.js',
        format: 'cjs',
        sourceMap: false
    },
    plugins: [
        resolve({
            mainFields: ['module', 'main'],
            extensions: ['.js', '.jsx', '.json'],
            preferBuiltins: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs({
            include: ['node_modules/**']
        }),
        builtins()
    ],
    external
};
