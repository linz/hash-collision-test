export abstract class HashTestAlgorithm {
  bits: number;
  name: string;

  constructor(name: string, bits: number) {
    this.name = name;
    this.bits = bits;
  }
  get id(): string {
    return this.name + ':' + this.bits;
  }
  abstract hash(string: string): string;

  sub(bits: number): HashTestAlgorithm {
    return new HashTestAlgorithmSub(this, bits);
  }
}

export class HashTestAlgorithmSub extends HashTestAlgorithm {
  ht: HashTestAlgorithm;

  get id(): string {
    return this.name + ':' + this.bits + '/' + this.ht.bits;
  }

  constructor(ht: HashTestAlgorithm, bits: number) {
    super(ht.name, bits);
    this.ht = ht;
  }

  hash(string: string): string {
    return this.ht.hash(string).substring(0, (this.bits / 8) * 2);
  }
}

export class HashTestCase {
  ht: HashTestAlgorithm;
  seen = new Set<string>();
  collisions = new Map<string, string[]>();
  duration = 0;
  constructor(ht: HashTestAlgorithm) {
    this.ht = ht;
  }

  hash(lines: string[]): void {
    const startTime = Date.now();
    for (const str of lines) {
      const hash = this.ht.hash(str);
      if (this.seen.has(hash)) {
        const existing = this.collisions.get(hash) ?? [];
        existing.push(str);
        this.collisions.set(hash, existing);
      }
      this.seen.add(hash);
    }
    this.duration += Date.now() - startTime;
  }
}
