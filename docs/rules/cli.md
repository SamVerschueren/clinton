# Enforces the existance and executability of the bin file

Enforces the existance and executability of the file defined as `bin` in `package.json`.


## Fail

The rule will fail if the file does not exist or if the file is not executable.


## Pass

The rule will pass if the `bin` property in `package.json` is not defined or if the file exists and is executable.
