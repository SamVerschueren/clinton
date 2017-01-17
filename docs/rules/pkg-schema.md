# Enforces a valid `package.json`

Enforces a valid `package.json` by validating it against a [schema](http://json.schemastore.org/package).


## Options

The schema is being cached for seven days by default. If you want to change the duration, you can provide the number of milliseconds that the schema should be cached.

```js
"pkg-schema": ["error", {"maxAge": 86400000}]
```
