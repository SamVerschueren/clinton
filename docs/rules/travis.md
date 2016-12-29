# Enforces the correct versions in `.travis.yml`

Enforces the correct versions to be tested depending on the `engines` field in `package.json`.


## Fail

### No engines field

```json
{
  "name": "foo"
}
```

### Unsupported versions

```json
{
  "name": "foo",
  "engines": {
    "node": ">=4"
  }
}
```

```yml
language: node_js
node_js:
  - '6'
  - '4'
  - '0.12'
```

### Untested versions

```json
{
  "name": "travis",
  "engines": {
    "node": ">=0.10"
  }
}
```

```yml
language: node_js
node_js:
  - '6'
  - '4'
```

### Deprecated versions

```yml
language: node_js
node_js:
  - 'stable'
  - 'iojs'
```


## Pass

```json
{
  "name": "travis",
  "engines": {
    "node": ">=0.10"
  }
}
```

```yml
language: node_js
node_js:
  - '6'
  - '4'
  - '0.12'
  - '0.10'
```
