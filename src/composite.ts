import { HashTestAlgorithm } from './algo';

/** Composite of different hash types */
export class CompositeHash extends HashTestAlgorithm {
  hashes: HashTestAlgorithm[];
  constructor(hashes: HashTestAlgorithm[]) {
    super('', 0);
    this.hashes = hashes;
    this.name = this.hashes.map((c) => c.id).join('__');
    this.bits = this.hashes.reduce((total, current) => total + current.bits, 0);
  }

  hash(string: string): string {
    const output = [];
    for (const h of this.hashes) output.push(h.hash(string));
    return output.join(':');
  }
}
