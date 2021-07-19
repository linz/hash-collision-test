import fnv1a from '@sindresorhus/fnv1a';
import { HashTestAlgorithm } from '../algo';

export class Fnv1a extends HashTestAlgorithm {
  bits: 32 | 64 | 128 | 256;

  constructor(bits: 32 | 64 | 128 | 256 = 32) {
    super('fnv1a', bits);
  }

  hash(s: string): string {
    if (this.bits === 32) return fnv1a(s).toString(16);
    return fnv1a.bigInt(s, { size: this.bits }).toString(16);
  }
}
