# Enforce not having empty keywords in `package.json`

Prevents having empty keywords in the `keywords` field in `package.json`.

## Fail

```json
{
  "name": "foo",
  "keywords": [
    "foo",
    "bar",
    "",
    "rainbow"
  ]
}
```


## Pass

```json
{
  "name": "foo",
  "keywords": [
    "foo",
    "bar",
    "rainbow"
  ]
}
```
