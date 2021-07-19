import { createHash } from 'crypto';
import { HashTestAlgorithm } from '../algo';

export class NodeCrypto extends HashTestAlgorithm {
  constructor(hashType: string, bits = 256) {
    super(hashType, bits);
  }

  hash(string: string): string {
    return createHash(this.name)
      .update(string)
      .digest('hex')
      .slice(this.bits / 8);
  }
}
