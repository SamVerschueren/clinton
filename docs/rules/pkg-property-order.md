# Enforces order of properties in in `package.json`

Enforces the following order in of the properties in `package.json`.

- `name`
- `version`
- `description`
- `license`
- `repository`
- `homepage`
- `bugs`
- `author`
- `maintainers`
- `contributors`
- `private`
- `preferGlobal`
- `publishConfig`
- `config`
- `main`
- `bin`
- `man`
- `os`
- `cpu`
- `engines`
- `scripts`
- `files`
- `keywords`
- `dependencies`
- `devDependencies`
- `peerDependencies`
- `bundledDependencies`
- `optionalDependencies`


## Fail

```json
{
  "name": "foo",
  "description": "Foo bar",
  "version": "1.0.0"
}
```

```json
{
  "name": "foo",
  "version": "1.0.0",
  "license": "MIT",
  "description": "Foo bar"
}
```


## Pass

```json
{
  "name": "foo",
  "version": "1.0.0",
  "description": "Foo bar"
}
```

```json
{
  "name": "foo",
  "version": "1.0.0",
  "description": "Foo bar",
  "license": "MIT",
}
```


## Options

You can set a custom order as well.

```js
"pkg-user-order": ["error", {"order": ["name", "description", "version"]}]
```
