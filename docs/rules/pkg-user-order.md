# Enforces order of properties in user objects in `package.json`

Enforces the following order in `author`, `maintainers` and `contributors` objects in `package.json`.

- `name`
- `email`
- `url`


## Fail

```json
{
  "name": "foo",
  "author": {
    "email": "sam.verschueren@gmail.com",
    "name": "Sam Verschueren",
    "url": "github.com/SamVerschueren"
  }
}
```

```json
{
  "name": "foo",
  "maintainers": [
    {
      "name": "Sam Verschueren",
      "url": "github.com/SamVerschueren",
      "email": "sam.verschueren@gmail.com"
    }
  ]
}
```

```json
{
  "name": "foo",
  "contributors": [
    {
      "url": "github.com/SamVerschueren",
      "name": "Sam Verschueren",
      "email": "sam.verschueren@gmail.com"
    }
  ]
}
```


## Pass

```json
{
  "name": "foo",
  "author": {
    "name": "Sam Verschueren",
    "email": "sam.verschueren@gmail.com",
    "url": "github.com/SamVerschueren"
  }
}
```

```json
{
  "name": "foo",
  "maintainers": [
    {
      "name": "Sam Verschueren",
      "email": "sam.verschueren@gmail.com",
      "url": "github.com/SamVerschueren"
    }
  ]
}
```

```json
{
  "name": "foo",
  "contributors": [
    {
      "name": "Sam Verschueren",
      "email": "sam.verschueren@gmail.com",
      "url": "github.com/SamVerschueren"
    }
  ]
}
```


## Options

You can set a custom order as well.

```js
"pkg-user-order": ["error", "email", "name", "url"]
```
