# Enforce recommended properties in `package.json`

Enforces the following recommended properties in `package.json`.

- `name`
- `version`
- `description`
- `repository`
- `author`
- `main`
- `engines`
- `files`
- `keywords`


## Fail

```json
{
  "name": "foo",
  "version": "1.0.0",
  "description": "My super awesome module",
  "repository": "SamVerschueren/foo",
  "author": {
    "name": "Sam Verschueren",
    "email": "sam.verschueren@gmail.com",
    "url": "github.com/SamVerschueren"
  }
}
```


## Pass

```json
{
  "name": "foo",
  "version": "1.0.0",
  "description": "My super awesome module",
  "repository": "SamVerschueren/foo",
  "author": {
    "name": "Sam Verschueren",
    "email": "sam.verschueren@gmail.com",
    "url": "github.com/SamVerschueren"
  },
  "main": "index.js",
  "engines": {
    "node": ">=4"
  },
  "files": [
    "index.js"
  ],
  "keywords": [
    "awesome",
    "module"
  ]
}
```
