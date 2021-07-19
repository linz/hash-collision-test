// Stolen from https://github.com/sindresorhus/djb2a
// as it is a ESM module and this is not so would not load in nodejs with out bundling
import { HashTestAlgorithm } from '../algo';

const MAGIC_CONSTANT = 5381;

export class Djb2a extends HashTestAlgorithm {
  constructor() {
    super('djb2a', 32);
  }

  hash(string: string): string {
    let hash = MAGIC_CONSTANT;

    for (let index = 0; index < string.length; index++) {
      // Equivalent to: `hash * 33 ^ string.charCodeAt(i)`
      hash = ((hash << 5) + hash) ^ string.charCodeAt(index);
    }

    // Convert it to an unsigned 32-bit integer.
    return (hash >>> 0).toString(16);
  }
}
