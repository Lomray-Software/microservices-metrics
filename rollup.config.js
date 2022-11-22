import typescript from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { folderInput } from 'rollup-plugin-folder-input'
import copy from 'rollup-plugin-copy';
import cleaner from 'rollup-plugin-cleaner';

/**
 * This is root config for microservices
 * All microservices extends from this config
 */
const config = {
  input: ['src/**/*.ts'],
  output: {
    dir: 'lib',
    format: 'cjs',
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'auto',
  },
  external: ['dns', '@opentelemetry/sdk-metrics'],
  plugins: [
    cleaner({
      targets: ['./lib/'],
    }),
    folderInput(),
    peerDepsExternal({
      includeDependencies: true,
    }),
    json(),
    typescript({
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
        importHelpers: true,
        sourceMap: true,
        inlineSources: true,
        plugins: [
          {
            "transform": "@zerollup/ts-transform-paths",
            "exclude": ["*"]
          }
        ]
      }),
    }),
    copy({
      targets: [
        { src: 'package.json', dest: 'lib' },
      ]
    }),
  ],
};

export default config;
