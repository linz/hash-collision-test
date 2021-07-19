import Xxh from 'xxhash-addon';
import { HashTestAlgorithm } from '../algo';

export class XxHash extends HashTestAlgorithm {
  bits: number;
  seed: number;
  ht: xxhash.Xxhash;

  constructor(bits: number, seed = 0xdeadbeef) {
    super('xxhash' + bits, bits);
    this.seed = seed;

    if (this.bits === 32) this.ht = new Xxh.XXHash32(0);
    if (this.bits === 64) this.ht = new Xxh.XXHash64(0);
    if (this.bits === 128) this.ht = new Xxh.XXHash128(0);
  }

  get id(): string {
    return this.name + ':' + this.bits;
  }

  hash(string: string): string {
    return this.ht.hash(Buffer.from(string)).toString('hex');
  }
}
