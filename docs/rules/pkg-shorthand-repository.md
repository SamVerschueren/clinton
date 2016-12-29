# Enforces the use of the shorthand repository URL

Enforces the use of the shorthand repository URL instead of the full URL.

## Fail

```json
{
  "name": "foo",
  "repository": "https://github.com/SamVerschueren/foo",
}
```

```json
{
  "name": "foo",
  "repository": "https://github.com/SamVerschueren/foo.git"
}
```

```json
{
  "name": "foo",
  "repository": {
    "type": "git",
    "url": "https://github.com/SamVerschueren/foo.git"
  }
}
```


## Pass

```json
{
  "name": "foo",
  "repository": "SamVerschueren/foo",
}
```

```json
{
  "name": "foo",
  "repository": {
    "type": "git",
    "url": "SamVerschueren/foo"
  }
}
```
