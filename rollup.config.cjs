// rollup.config.cjs
const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const postcss = require("rollup-plugin-postcss");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom"], // Exclude react and react-dom from the bundle
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    postcss({
      extract: "styles.css",
      minimize: true,
      sourceMap: true,
      modules: false 
    }),
  ],
};
