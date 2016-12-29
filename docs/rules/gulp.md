# Enforces the correct `devDependencies` when Gulp is detected

## Fail

- If no `gulpfile` is present.
- If `gulp` is not in the `devDependencies` list.
- If none of the TypeScript peer dependencies is not in the `devDependencies` list in case `gulpfile.ts` is detected.
- If the `coffee-script` CoffeeScript peer dependency is not in the `devDependencies` list in case `gulpfile.coffee` is detected.


## Options

You can make the use of Gulp required.

```js
"gulp": ["error", "required"]
```
