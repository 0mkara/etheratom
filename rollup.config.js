import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';
import path from 'path';
const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
const external = Object.keys(pkg.dependencies || {});

export default {
    entry: 'index.js',
    dest: './build/main.js',
    format: 'cjs',
    sourceMap: 'inline',
    plugins: [
        resolve({
            module: true,
            main: true,
            extensions: [ '.mjs', '.js', '.jsx', '.json' ]
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs({
            include: [ 'node_modules/react-checkbox-tree/**' ]
        })
    ],
    external,
};
