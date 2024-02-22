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
    entryPoints: ["./src/content/content.ts"],
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
                    from: "./static/assets/*",
                    to: "./dist/assets"
                },
                {
                    from: "./manifest.json",
                    to: "./dist"
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
