# ObjectIdGenerator

A **lightweight ObjectId generator for frontend applications**, designed to mimic MongoDB's 12-byte ObjectId format. This utility is implemented in TypeScript, has no external dependencies, and is fully compatible with modern browsers via the `crypto.getRandomValues` API.

## ✨ Features

- Fully compatible with browser environments
- Zero dependencies
- Generates MongoDB-style 12-byte ObjectIds
- Supports output in:
  - **Hexadecimal format** (24-character hex string)
  - **Slim/Base64-like encoding** (using customizable 64-character alphabet)
- Allows optional timestamp injection for predictable ObjectId generation

## 📦 Installation

This utility is self-contained and can be copied directly into any frontend TypeScript project. No NPM package required.

## 📚 Usage

### Import

```ts
import ObjectIdGenerator from '@jcendal/objectid-litte';
```

### Generate a standard hex string ObjectId

```ts
const objectId = ObjectIdGenerator.hex();
console.log(objectId); // e.g. "64e6f4b83fb0f83c1b3726f0"
```

### Generate a slim string ObjectId (base64-like)

```ts
const slimId = ObjectIdGenerator.slim();
console.log(slimId); // e.g. "-V9MYwMf_OUCoEBuZ1Yv"
```

### Generate with a specific timestamp (Unix time in seconds)

```ts
const ts = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
const objectId = ObjectIdGenerator.hex(ts);
```

### Use a custom alphabet for slim encoding

```ts
const customAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const customSlimId = ObjectIdGenerator.slim(undefined, customAlphabet);
```

## 🛠 API

### `ObjectIdGenerator.generate(time?: number): Uint8Array`

Generates a raw 12-byte ObjectId. If `time` is provided (Unix timestamp in seconds), it will be used as the creation time.

### `ObjectIdGenerator.toHex(buffer: Uint8Array): string`

Converts a 12-byte ObjectId into a 24-character hexadecimal string.

### `ObjectIdGenerator.toSlim(buffer: Uint8Array, chars: string = DEFAULT_CHARS): string`

Encodes the 12-byte ObjectId into a base64-like string using a 64-character alphabet.

### `ObjectIdGenerator.hex(time?: number): string`

Returns a 24-character hex string ObjectId. Optionally takes a Unix timestamp.

### `ObjectIdGenerator.slim(time?: number, chars?: string): string`

Returns a slim-encoded ObjectId using the default or custom 64-character alphabet. Optionally takes a Unix timestamp.

## ⚙️ Implementation Details

The structure of the generated ObjectId mimics MongoDB’s format:

```
| 4 bytes timestamp | 3 bytes machine ID | 2 bytes process ID | 3 bytes counter |
```

- **Machine ID**: Random per module load
- **Process ID**: Simulated with 2 random bytes
- **Counter**: 3-byte integer initialized randomly and incremented per ObjectId

## 📄 License

MIT – Feel free to use, modify, and distribute.
