# Enforces the use of a `engines.node` field in `package.json`.

Enforces the use of a `engines.node` field in `package.json`.


## Fail

```json
{
  "name": "foo"
}
```

```json
{
  "name": "foo",
  "engines": { }
}
```

```json
{
  "name": "foo",
  "engines": {
    "node": "bar"
  }
}
```


## Pass

```json
{
  "name": "foo",
  "engines": {
    "node": ">=0.10"
  }
}
```

```json
{
  "name": "foo",
  "engines": {
    "node": ">=4"
  }
}
```
