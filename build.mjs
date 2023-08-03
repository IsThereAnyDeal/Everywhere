import esbuild from "esbuild";
import clear from "esbuild-plugin-clear";
import copy from "esbuild-plugin-copy";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

const [node_, program_, ...args_] = process.argv;
const args = new Set(args_);

const options = {
    logLevel: "info",
    format: "iife",
    entryPoints: ["./src/content.js"],
    bundle: true,
    minify: false,
    sourcemap: true,
    outdir: "dist",
    plugins: [
        clear("./dist"),
        copy({
            resolveFrom: "cwd",
            assets: [
                {
                    from: "./src/icons/*",
                    to: "./dist/icons"
                },
                {
                    from: "./src/manifest.json",
                    to: "./dist"
                }
            ]
        }),
        esbuildSvelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                hydratable: false,
                css: "external",
                dev: true // TODO
            }
        }),
        /*
        copy({
            resolveFrom: "cwd",
            assets: [
                {
                    from: ["./dist/content.css", "./dist/content.css.map"],
                    to: ["./dist/css/components.css", "./dist/css/components.css.map"],
                }
            ]
        }),
        */
    ]
};

if (args.has("watch")) {
    const context = await esbuild.context(options)
    await context.watch();
} else {
    await esbuild.build(options);
}
