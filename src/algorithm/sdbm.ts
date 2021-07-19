// Stolen from https://github.com/sindresorhus/sdbm
// as it is a ESM module and this is not so would not load in nodejs with out bundling

import { HashTestAlgorithm } from '../algo';

export class Sdbm extends HashTestAlgorithm {
  constructor() {
    super('sdbm', 32);
  }

  hash(string: string): string {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }

    // Convert it to an unsigned 32-bit integer.
    return (hash >>> 0).toString(16);
  }
}
