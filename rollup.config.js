import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";

const production = !process.env.ROLLUP_WATCH; // if watch mode is on, set to false (run dev mode)

const config = ["content"].map((name) => ({
  input: `src/${name}.ts`,
  output: {
    sourcemap: !production,
    file: `dist/${name}.js`,
    name: name,
    format: "iife",
  },
  plugins: [
    del({ targets: "dist/*" }),
    copy({
      targets: [
        { src: "src/manifest.json", dest: "dist" },
        { src: "src/images", dest: "dist" },
        { src: "src/icons", dest: "dist" },
        { src: "src/css", dest: "dist" },
      ],
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: !production,
      inlineSources: !production,
    }),
  ],
}));

export default config;