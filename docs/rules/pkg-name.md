# Enforces a valid package name

Enforces the use of a valid package name in `package.json`.


## Fail

```json
{
  "name": ".foo"
}
```

```json
{
  "name": "node_modules"
}
```

```json
{
  "name": "favicon.ico"
}
```

```json
{
  "name": "foo bar"
}
```

```json
{
  "name": "foo%bar"
}
```

```json
{
  "name": "@fo@/bar"
}
```


## Pass

```json
{
  "name": "foo-bar"
}
```

```json
{
  "name": "foo_bar"
}
```

```json
{
  "name": "@foo/bar"
}
```
