# Enforce the use of `keywords` in `package.json`

Prevents not having `keywords` or an empty list of `keywords` in `package.json`.


## Fail

```json
{
  "name": "foo"
}
```

```json
{
  "name": "foo",
  "keywords": [
  ]
}
```


## Pass

```json
{
  "name": "foo",
  "keywords": [
    "foo"
  ]
}
```
