# Enforces a valid version identifier in `package.json`

Enforces the use of a semanticly valid version identifier.


## Fail

```json
{
  "name": "foo",
  "version": "1.0"
}
```

```json
{
  "name": "foo",
  "version": "1.0.x"
}
```


## Pass

```json
{
  "name": "foo",
  "version": "1.0.0"
}
```

```json
{
  "name": "foo",
  "version": "1.0.0-beta.1"
}
```
