# Enforces the use of XO

Detects if [XO](https://github.com/sindresorhus/xo) is being used and is being used correctly.


## Fail


```json
{
  "name": "foo",
  "devDependencies": {
    "xo": "*"
  }
}
```

> `XO` is not being used in the `test` script.


```json
{
  "name": "foo",
  "scripts": {
    "test": "xo --esnext"
  },
  "devDependencies": {
    "xo": "*"
  }
}
```

> Specify `XO` configuration via a config object instead of passing it through via the CLI.


## Pass

```json
{
  "name": "foo",
  "scripts": {
    "test": "xo"
  },
  "devDependencies": {
    "xo": "*"
  }
}
```

```json
{
  "name": "foo",
  "engines": {
    "node": ">=4"
  },
  "scripts": {
    "test": "xo"
  },
  "devDependencies": {
    "xo": "*"
  },
  "xo": {
    "esnext": true
  }
}
```


## Options

You can set the required version of `XO`.

```js
"xo": ["error", "0.16.0"]
```
