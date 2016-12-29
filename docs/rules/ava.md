# Enforces the use of AVA

Detects if [AVA](https://github.com/avajs/ava) is being used and is being used correctly.


## Fail


```json
{
  "name": "foo",
  "devDependencies": {
    "ava": "*"
  }
}
```

> `AVA` is not being used in the `test` script.


```json
{
  "name": "foo",
  "scripts": {
    "test": "ava --serial"
  },
  "devDependencies": {
    "AVA": "*"
  }
}
```

> Specify `AVA` configuration via a config object instead of passing it through via the CLI.


## Pass

```json
{
  "name": "foo",
  "scripts": {
    "test": "ava"
  },
  "devDependencies": {
    "ava": "*"
  }
}
```

```json
{
  "name": "foo",
  "scripts": {
    "test": "ava"
  },
  "devDependencies": {
    "ava": "*"
  },
  "ava": {
    "serial": true
  }
}
```


## Options

You can set the required version of `AVA`.

```js
"ava": ["error", "0.15.2"]
```
