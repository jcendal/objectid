/*
 * Lightweight MongoDB ObjectId generator for frontend (TypeScript)
 * Compatible with browsers (uses crypto.getRandomValues)
 * No dependencies, minimal implementation
 * Recommended TypeScript version: 3.3+
 */

import { ObjectIdOptions } from './types';

// Default 64-character alphabet for slim/base64-like encoding
const DEFAULT_CHARS =
  '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
// Machine identifier: 3 random bytes, persistent per module instance
const _machineIdBytes = new Uint8Array(3);
crypto.getRandomValues(_machineIdBytes);
const MACHINE_ID =
  (_machineIdBytes[0] << 16) | (_machineIdBytes[1] << 8) | _machineIdBytes[2];

// Counter: 3-byte counter, seeded randomly
let _counter = (() => {
  const buf = new Uint8Array(3);
  crypto.getRandomValues(buf);
  return (buf[0] << 16) | (buf[1] << 8) | buf[2];
})();

function _getInc(): number {
  _counter = (_counter + 1) % 0xffffff;
  return _counter;
}

export class ObjectId {
  /**
   * Low-level: Generates a 12-byte ObjectId buffer.
   * Use `ObjectId.hex()` or `ObjectId.slim()` for string output instead.
   * @param options Optional ObjectId creation options.
   * @returns Uint8Array representing the raw ObjectId.
   */
  static create(options?: ObjectIdOptions): Uint8Array {
    const ts =
      typeof options?.timestamp === 'number'
        ? Math.floor(options.timestamp)
        : Math.floor(Date.now() / 1000);
    // 12-byte array: 4 bytes timestamp, 3 bytes machine, 2 bytes pid, 3 bytes counter
    const bytes = new Uint8Array(12);

    // Timestamp (big-endian)
    bytes[0] = (ts >> 24) & 0xff;
    bytes[1] = (ts >> 16) & 0xff;
    bytes[2] = (ts >> 8) & 0xff;
    bytes[3] = ts & 0xff;

    // Machine ID
    bytes[4] = (MACHINE_ID >> 16) & 0xff;
    bytes[5] = (MACHINE_ID >> 8) & 0xff;
    bytes[6] = MACHINE_ID & 0xff;

    // Process identifier: in browser, we fake with random 2 bytes per instance
    const pid = (() => {
      const buf = new Uint8Array(2);
      crypto.getRandomValues(buf);
      return (buf[0] << 8) | buf[1];
    })();
    bytes[7] = (pid >> 8) & 0xff;
    bytes[8] = pid & 0xff;

    // Counter
    const inc = _getInc();
    bytes[9] = (inc >> 16) & 0xff;
    bytes[10] = (inc >> 8) & 0xff;
    bytes[11] = inc & 0xff;

    return bytes;
  }

  /**
   * Converts a 12-byte ObjectId buffer to a 24-character hex string.
   */
  static toHex(buffer: Uint8Array): string {
    let str = '';
    for (let i = 0; i < 12; i++) {
      const hex = buffer[i].toString(16);
      str += hex.length === 1 ? '0' + hex : hex;
    }
    return str;
  }

  /**
   * Converts a 12-byte ObjectId buffer to a slim string using a 64-char alphabet.
   */
  static toSlim(buffer: Uint8Array, chars: string = DEFAULT_CHARS): string {
    if (chars.length !== 64) {
      throw new Error('chars alphabet must be 64 characters long');
    }
    let result = '';
    let bits = 0;
    let value = 0;
    let index = buffer.length - 1;

    while (index >= 0 || bits > 0) {
      if (bits < 6 && index >= 0) {
        value |= buffer[index] << bits;
        bits += 8;
        index--;
      }
      result = chars[value & 0x3f] + result;
      value >>= 6;
      bits -= 6;
    }

    return result;
  }

  /**
   * Generates a hex string ObjectId (24 hex chars).
   * @param time Optional Unix timestamp (seconds). Defaults to now.
   */
  static hex(timestamp?: number): string {
    const buf = this.create({ timestamp });
    return this.toHex(buf);
  }

  /**
   * Generates a slim/base64-like string ObjectId.
   * @param time Optional Unix timestamp (seconds). Defaults to now.
   * @param chars Optional 64-character alphabet string.
   */
  static slim(timestamp?: number, chars?: string): string {
    const buf = this.create({ timestamp });
    return this.toSlim(buf, chars ?? DEFAULT_CHARS);
  }
}

// Default export: hex string generator
export default ObjectId.hex;
