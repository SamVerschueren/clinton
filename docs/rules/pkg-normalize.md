# Enforces package normalization

Enforces package [normalization](https://github.com/npm/normalize-package-data#what-normalization-currently-entails) and warns on moot properties.


## Fail

```json
{
  "name": "package",
  "version": "v1.0.0"
}
```

> Version should be written as `1.0.0` instead.


```json
{
  "name": "foo",
  "bin": {
    "foo": "cli.js"
  }
}
```

> No need to use an object for `bin`, you can directly assign `cli.js` to it.


```json
{
  "name": "package",
  "repository": "SamVerschueren/clinton",
  "bugs": "github.com/SamVerschueren/clinton/issues"
}
```

> The `bugs` property is moot as it is automatically inferred by the `repository` field.


```json
{
  "name": "package",
  "repository": "SamVerschueren/clinton",
  "homepage": "github.com/SamVerschueren/clinton"
}
```

> The `homepage` property is moot as it is automatically inferred by the `repository` field.


## Pass

```json
{
  "name": "foo",
  "version": "1.0.0",
  "repository": "SamVerschueren/clinton",
  "bin": "cli.js"
}
```
