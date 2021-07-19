import * as fh from 'farmhash';
import { HashTestAlgorithm } from '../algo';

export class FarmHash extends HashTestAlgorithm {
  constructor(bits: number) {
    super('farmhash', bits);
  }

  hash(string: string): string {
    if (this.bits === 32) return fh.hash32(string).toString(16);
    if (this.bits === 64) return BigInt(fh.hash64(string)).toString(16);
    throw new Error('Invalid bits');
  }
}
