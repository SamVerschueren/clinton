# Enforces the description to start with a capital letter and not end with a dot

The description of a package should start with an uppercase letter and does not end with a dot.


## Fail

```json
{
  "name": "package",
  "description": "foo"
}
```

```json
{
  "name": "package",
  "description": "Foo bar baz."
}
```


## Pass

```json
{
  "name": "package",
  "description": "Foo bar baz"
}
```
