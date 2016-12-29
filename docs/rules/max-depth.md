# Enforce the maximum depth of the directory structure

Enforces a maximum directory depth. Default is `5`.

## Fail

```
.
└── foo
    └── bar
        └── baz
            └── unicorn
                └── rainbow
                    └── docs
                        └── readme.md
```


## Pass

```
.
└── foo
    └── bar
        └── baz
            └── unicorn
                └── rainbow
                    └── readme.md
```


## Options

You can set the `max` option like this:

```js
"max-depth": ["error", {"max": 10}]
```
