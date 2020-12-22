const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const banner = require('./banner');


(async () => {
    // Create polyfill
    const polyfillBundle = await rollup.rollup({
        input: 'src/Polyfill.ts',
        plugins: [
            typescript(),
            terser({
                ie8: true,
            }),
        ],
    });
    await polyfillBundle.write({
        file: 'polyfill/index.js',
        format: 'iife',
        banner,
        sourcemap: true,
    });


    const bundle = await rollup.rollup({
        input: 'src/ES6PromiseImpl.ts',
        plugins: [
            typescript(),
            terser({
                ie8: true,
            }),
        ],
    });
    // Create UMD version
    await bundle.write({
        file: 'dist/promise-for-es.js',
        format: 'umd',
        banner,
        name: 'Promise',
        sourcemap: true,
    });
    // Create ESM version
    await bundle.write({
        file: 'dist/promise-for-es.mjs',
        format: 'esm',
        banner,
        sourcemap: true,
    });

})();
