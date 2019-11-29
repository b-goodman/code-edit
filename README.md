# code-edit

A custom element encapsulating a CodeMirror instance.

## Install

```bash
npm install @bgoodman/code-edit

yarn add @bgoodman/code-edit
```

## Usage

```html
    <script type="module" src="./dist/index.js"></script>

    <code-edit></code-edit>
```

## Attributes

### `mode`

Specify code type using a language mode.  Options include:

+ `"htmlmixed"` - default (html/css/js)
+ `"javascript"`
+ `"typescript"`
+ `"markdown"`

## Methods

### [`getValue`](https://codemirror.net/doc/manual.html#getValue)

Get the current editor content.  You can pass it an optional argument to specify the string to be used to separate lines (defaults to "\n").

```typescript
getValue(seperator?: string): Promise<string>
```
