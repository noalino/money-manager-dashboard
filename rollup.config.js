import svelte from 'rollup-plugin-svelte';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

const defaultPlugins = [
  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration -
  // consult the documentation for details:
  // https://github.com/rollup/plugins/tree/master/packages/commonjs
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  commonjs(),

  // Watch the `public` directory and refresh the
  // browser on changes when not in production
  !production && livereload('public'),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser(),
  alias({
    entries: [
      {
        find: 'common',
        replacement: path.resolve(__dirname, 'src', 'common'),
      },
    ],
  }),
];

export default [
  {
    input: 'src/renderer/svelte/index.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/app/build/bundle.js',
    },
    plugins: [
      ...defaultPlugins,
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: (css) => {
          css.write('public/app/build/bundle.css');
        },
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/renderer/svelte/childWindows/addTransaction.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'addTransaction',
      file: 'public/childWindows/addTransaction/build/bundle.js',
    },
    plugins: [
      ...defaultPlugins,
      svelte({
        dev: !production,
        css: (css) => {
          css.write('public/childWindows/addTransaction/build/bundle.css');
        },
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn(
          'npm',
          ['run', 'svelte-start', '--', '--dev'],
          {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true,
          },
        );
      }
    },
  };
}
