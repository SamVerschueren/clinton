# Enforce not having duplicate keywords in `package.json`

Prevents having duplicate keywords in the `keywords` field in `package.json`.

## Fail

```json
{
  "name": "foo",
  "keywords": [
    "foo",
    "bar",
    "unicorn",
    "foo",
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
    "unicorn",
    "rainbow"
  ]
}
```
