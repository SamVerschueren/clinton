# Enforces alphabetical order of `dependencies` and `devDependencies` in `package.json`

Enforces an alphabetical order of the `dependencies` and `devDependencies` list in `package.json`.


## Fail

```json
{
  "name": "foo",
  "dependencies": {
    "pify": "*",
    "clinton": "*"
  }
}
```

```json
{
  "name": "foo",
  "devDependencies": {
    "xo": "*",
    "ava": "*"
  }
}
```


## Pass

```json
{
  "name": "foo",
  "dependencies": {
    "clinton": "*",
    "pify": "*"
  }
}
```

```json
{
  "name": "foo",
  "devDependencies": {
    "ava": "*",
    "xo": "*"
  }
}
```
