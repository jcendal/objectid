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

Run `npm install @jcendal/objectid` to add it to your project. Then import and use it as needed.

## 📚 Usage

### Import the default hex-generator function or the full ObjectId class for more control

```ts
import objectIdHex from '@jcendal/objectid';
```

```ts
import { ObjectId } from '@jcendal/objectid';
```

### Generate a standard hex string ObjectId

```ts
const id = objectIdHex();
console.log(id); // e.g. "64e6f4b83fb0f83c1b3726f0"
```

Or via the class:

```ts
const id = ObjectId.hex();
console.log(id); // e.g. "64e6f4b83fb0f83c1b3726f0"
```

### Generate a slim string ObjectId (base64-like)

```ts
const slimId = ObjectId.slim();
console.log(slimId); // e.g. "-V9MYwMf_OUCoEBuZ1Yv"
```

### Inject a specific timestamp (Unix time in seconds)

```ts
const ts = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
const oldHex = objectIdHex(ts);
const oldSlim = ObjectId.slim(ts);
```

### Use a custom 64-character alphabet for slim encoding

```ts
const customAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const customSlimId = ObjectId.slim(undefined, customAlphabet);
```

## 🛠 API

### Methods

#### `ObjectId.create(options?: { timestamp?: number }): Uint8Array`

Generates a raw 12-byte ObjectId. If `time` is provided (Unix timestamp in seconds), it will be used as the creation time.

#### `ObjectId.toHex(buffer: Uint8Array): string`

Converts a 12-byte ObjectId into a 24-character hexadecimal string.

#### `ObjectId.toSlim(buffer: Uint8Array, chars?: string): string`

Encodes a 12-byte buffer into a slim (base64-like) string. Supply a 64-character chars alphabet to customize.

#### `ObjectId.hex(timestamp?: number): string`

Returns a 24-character hex string ObjectId. Optionally takes a Unix timestamp.

#### `ObjectId.slim(timestamp?: number, chars?: string): string`

Returns a slim-encoded ObjectId using the default or custom 64-character alphabet. Optionally takes a Unix timestamp.

## ⚙️ Implementation Details

The structure of the generated ObjectId mimics MongoDB’s format:

```
| 4 bytes timestamp | 3 bytes machine ID | 2 bytes process ID | 3 bytes counter |
```

- **Machine ID**: Random 3 bytes per module load
- **Process ID**: Simulated with 2 random bytes per instance
- **Counter**: 3-byte integer initialized randomly and incremented per ObjectId

## 📄 License

MIT – Feel free to use, modify, and distribute.
