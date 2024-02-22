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
    entryPoints: [
        "./src/content/content.ts",
        "./src/background/background.ts",
        "./src/options/options.ts"
    ],
    bundle: true,
    minify: !args.has("dev"),
    sourcemap: true,
    outdir: "dist",
    plugins: [
        clear("./dist"),
        copy({
            resolveFrom: "cwd",
            assets: [
                {
                    from: "./static/assets/*",
                    to: "./dist/assets"
                },
                {
                    from: "./manifest.json",
                    to: "./dist/manifest.json"
                },
                {
                    from: "./src/Options/options.html",
                    to: "./dist/Options/options.html"
                }
            ]
        }),
        esbuildSvelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                hydratable: false,
                css: "external",
                dev: args.has("dev")
            }
        })
    ]
};

if (args.has("watch")) {
    const context = await esbuild.context(options)
    await context.watch();
} else {
    await esbuild.build(options);
}
