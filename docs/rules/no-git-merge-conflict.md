# Prevents having Git merge conflict markers

Enforces to not have Git merge conflict markers.


## Fail

```js
const foo = 'foo';
<<<<<<< HEAD
const bar = 'bar';
=======
const bar = 'ba';
>>>>>>> master
```

```js
const foo = 'foo';
<<<<<<< HEAD
const bar = 'bar';
```

```js
const foo = 'foo';
const bar = 'bar';
=======
```

```js
const foo = 'foo';
const bar = 'bar';
>>>>>>> master
```


## Pass

```js
const foo = 'foo';
const bar = 'bar';
```
