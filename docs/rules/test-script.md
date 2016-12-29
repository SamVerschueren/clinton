# Enforces the use of tests

Enforces the use of the `test` script in `package.json`.


## Fail

```json
{
  "name": "foo"
}
```

```json
{
  "name": "foo",
  "scripts": {
    "test": ""
  }
}
```

```json
{
  "name": "foo",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```


## Pass

```json
{
  "name": "foo",
  "scripts": {
    "test": "xo && ava"
  }
}
```
