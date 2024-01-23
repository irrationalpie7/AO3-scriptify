# Developer notes

## On adding webpack

I added webpack Jan '24 to encourage me to use more sensible separation of functions into separate files. Notes from the experience:

Initial setup more or less followed [this guide to getting started with webpack](https://webpack.js.org/guides/getting-started/). Additionally I had to add a `.gitignore` file to ignore "/node_modules"

I also decided to use a plugin to help with generating the header; I got my info for that from a combination of the [webpack-userscript](https://github.com/momocow/webpack-userscript?tab=readme-ov-file#load-headers) github and a [random example usage](https://github.com/lekakid/ArcaRefresher/blob/develop/webpack.prod.js) I found by searching github for code containing `new UserscriptPlugin language:JavaScript`. Their `meta.json` was useful, though idk if there's an official json schema to use, I didn't get that far and just guessed at the missing fields.

I also wasn't sure how to handle the dependency on [Color.js](https://colorjs.io/) which I was previously just handling with a `// @require https://colorjs.io/dist/color.global.min.js` in the header. In the end I installed it with webpack (`npm install colorjs.io --save`) but also added `"require": ["https://colorjs.io/dist/color.global.min.js"]` to `meta.json` and I'm not sure webpack is really doing anything for me here.

Anyway, you can now `npm run build` to build the userscript, and update the version in `package.json`. There's allegedly a way to have it do different things for dev/production and possibly add on a build number to the version number in dev that updates as you watch the src files and build, but I got stuck and haven't gotten it working yet.

After that it was really just inserting `export` in front of functions I wanted to use from other .js files, and importing them at the top of the file (though after the `// @ts-check` line, as I accidentally discovered), and everything just worked!

I turned minification off (in `webpack.config.js`), but that may be something to consider turning back on in non-dev mode.