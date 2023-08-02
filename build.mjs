import esbuild from "esbuild";
import clear from "esbuild-plugin-clear";
import copy from "esbuild-plugin-copy";

await esbuild.build({
    format: "iife",
    entryPoints: ["./src/content.js", "./src/css/styles.css"],
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
        })
    ]
});
